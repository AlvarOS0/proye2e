import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const Sesion = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const peticion = ctx.switchToHttp().getRequest();
        return peticion.usuario;
    }
);