import { CanActivate, Injectable, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";


@Injectable()
export class JwtGuard implements CanActivate{
    constructor(
        private jwtService: JwtService,
        private usuarioService: AuthService,
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const peticion = context.switchToHttp().getRequest();
        const autorizacionCabecera = peticion.headers.authorization;
        if (! autorizacionCabecera) {
            throw new ForbiddenException('Requiere autorizaciòn');
        }

        const [tipo, token] = autorizacionCabecera.split(' ');
        if (tipo !== 'JWT' || !token){
            throw new ForbiddenException('Token invalido');
        }

        try{
            const decodificarToken = this.jwtService.verify(token);
            console.log(decodificarToken);

            const idUsuario = decodificarToken.id;
            const usuario = await this.usuarioService.findOne(idUsuario);
            if (!usuario) {
                throw new ForbiddenException('Usuario incorrecto');    
            }

            const nombreRoles = usuario.roles.map(role => role.nombre);
            const roles = decodificarToken.roles;
            const verificarRoles = nombreRoles.every(elemento => roles.includes(elemento))
            
            if (!roles || roles.length == 0 || !verificarRoles){
                throw new ForbiddenException('El usuario no tiene roles asignados');    
            }

            peticion.usuario = usuario;

            return true;
        } catch(error){
            throw new ForbiddenException('No se pudo verificar el token');
        }


        return true;
    }
}