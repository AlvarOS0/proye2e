import { CanActivate, Injectable, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private usuarioService: AuthService,
        private reflector: Reflector,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const rolesDecorador = this.reflector.get<string[]>(ROLES_KEY, context.getHandler())
        if (!rolesDecorador) {
            return true;
        }
        console.log('ROLES DECORADOR')
        console.log(rolesDecorador)

        const peticion = context.switchToHttp().getRequest();
        const autorizacionCabecera = peticion.headers.authorization;
        if (!autorizacionCabecera) {
            throw new ForbiddenException('Requiere autorizaciòn');
        }

        const [tipo, token] = autorizacionCabecera.split(' ');
        if (tipo !== 'JWT' || !token) {
            throw new ForbiddenException('Token invalido');
        }

        try {
            const decodificarToken = this.jwtService.verify(token);
            //console.log(decodificarToken);

            const idUsuario = decodificarToken.id;
            const usuario = await this.usuarioService.findOne(idUsuario);
            if (!usuario) {
                throw new ForbiddenException('Usuario incorrecto');
            }

            const nombreRoles = usuario.roles.map(role => role.nombre);
            const roles = decodificarToken.roles;
            const verificarRoles = nombreRoles.every(elemento => roles.includes(elemento))

            if (!roles || roles.length == 0 || !verificarRoles) {
                throw new ForbiddenException('El usuario no tiene roles asignados');
            }

            const tieneRol = rolesDecorador.some(role => nombreRoles.includes(role))
            console.log('Tiene Rol');
            console.log(nombreRoles);
            console.log(tieneRol)

            if (!tieneRol) {
                throw new ForbiddenException('El usuario no tiene los roles suficientes');
            }

            return true;
        } catch (error) {
            throw new ForbiddenException(error.message || 'No se pudo verificar el token');
        }


        return true;
    }
}