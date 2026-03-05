import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Cocktails API (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;
  let ingredientId: number;
  let cocktailId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    dataSource = moduleFixture.get(DataSource);

    // Czyść bazę przed testami
    await dataSource.query('DELETE FROM cocktail_ingredients');
    await dataSource.query('DELETE FROM cocktails');
    await dataSource.query('DELETE FROM ingredients');
    await dataSource.query('DELETE FROM users');
  });

  afterAll(async () => {
    await dataSource.query('DELETE FROM cocktail_ingredients');
    await dataSource.query('DELETE FROM cocktails');
    await dataSource.query('DELETE FROM ingredients');
    await dataSource.query('DELETE FROM users');
    await app.close();
  });

  // ─── AUTH ─────────────────────────────────────────────────
  describe('Auth', () => {
    it('POST /auth/register – rejestracja', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'admin@test.com', password: 'haslo123' });

      expect(res.status).toBe(201);
      expect(res.body.email).toBe('admin@test.com');
    });

    it('POST /auth/login – logowanie zwraca token', async () => {
      // Ustaw rolę admin
      await dataSource.query(`UPDATE users SET role = 'admin' WHERE email = 'admin@test.com'`);

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@test.com', password: 'haslo123' });

      expect(res.status).toBe(201);
      expect(res.body.access_token).toBeDefined();
      adminToken = res.body.access_token;
    });

    it('POST /auth/register – rejestracja zwykłego usera', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'user@test.com', password: 'haslo123' });

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'user@test.com', password: 'haslo123' });

      userToken = res.body.access_token;
    });

    it('POST /auth/login – błędne hasło zwraca 401', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@test.com', password: 'zlehaslo' });

      expect(res.status).toBe(401);
    });
  });

  // ─── INGREDIENTS ──────────────────────────────────────────
  describe('Ingredients', () => {
    it('POST /ingredients – admin może dodać składnik', async () => {
      const res = await request(app.getHttpServer())
        .post('/ingredients')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Rum', description: 'Alkohol trzcinowy', isAlcoholic: true });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Rum');
      ingredientId = res.body.id;
    });

    it('POST /ingredients – zwykły user NIE może dodać składnika', async () => {
      const res = await request(app.getHttpServer())
        .post('/ingredients')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Woda', isAlcoholic: false });

      expect(res.status).toBe(403);
    });

    it('GET /ingredients – lista składników', async () => {
      const res = await request(app.getHttpServer()).get('/ingredients');

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.meta).toBeDefined();
    });

    it('GET /ingredients/:id – pobierz składnik', async () => {
      const res = await request(app.getHttpServer()).get(`/ingredients/${ingredientId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(ingredientId);
    });

    it('GET /ingredients/99999 – nieistniejący składnik zwraca 404', async () => {
      const res = await request(app.getHttpServer()).get('/ingredients/99999');

      expect(res.status).toBe(404);
    });
  });

  // ─── COCKTAILS ────────────────────────────────────────────
  describe('Cocktails', () => {
    it('POST /cocktails – zalogowany user może dodać koktajl', async () => {
      const res = await request(app.getHttpServer())
        .post('/cocktails')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Mojito',
          category: 'Klasyczny',
          instructions: 'Wymieszaj rum z miętą i limonką dokładnie z lodem.',
          ingredients: [{ ingredientId, amount: '50ml' }],
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Mojito');
      cocktailId = res.body.id;
    });

    it('POST /cocktails – niezalogowany NIE może dodać koktajlu', async () => {
      const res = await request(app.getHttpServer())
        .post('/cocktails')
        .send({ name: 'Test', category: 'X', instructions: 'Opis testowy', ingredients: [] });

      expect(res.status).toBe(401);
    });

    it('GET /cocktails – lista koktajli', async () => {
      const res = await request(app.getHttpServer()).get('/cocktails');

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.meta).toBeDefined();
    });

    it('GET /cocktails?search=Mojito – wyszukiwanie', async () => {
      const res = await request(app.getHttpServer()).get('/cocktails?search=Mojito');

      expect(res.status).toBe(200);
      expect(res.body.data.some((c: any) => c.name === 'Mojito')).toBe(true);
    });

    it('PATCH /cocktails/:id – autor może edytować', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/cocktails/${cocktailId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Mojito Premium' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Mojito Premium');
    });

    it('DELETE /cocktails/:id – autor może usunąć', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/cocktails/${cocktailId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
    });

    it('GET /cocktails/:id – usunięty koktajl zwraca 404', async () => {
      const res = await request(app.getHttpServer()).get(`/cocktails/${cocktailId}`);

      expect(res.status).toBe(404);
    });
  });
});