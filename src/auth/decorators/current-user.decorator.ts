import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// Dekorator który wyciąga aktualnego usera z requestu
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
