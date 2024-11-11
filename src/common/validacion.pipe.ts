import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidacionPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        // Convertir los datos entrantes al tipo de metatype
        const object = plainToInstance(metatype, value);

        // Validar el objeto
        const errors = await validate(object);

        if (errors.length > 0) {
            // Personalizar los mensajes de error basados en la validación que ha fallado
            const errorMessages = errors.map(err => this.formatErrorMessage(err));
            throw new BadRequestException(errorMessages);
        }

        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }

    // Función para personalizar los mensajes de error
    private formatErrorMessage(error: any): string {
        const property = error.property;
        const constraints = error.constraints;

        // Aquí podrías definir mensajes personalizados según la validación que falló
        if (constraints) {
            const errorMessage = Object.values(constraints).join(', ');
            return `Error en la propiedad '${property}': ${errorMessage}`;
        }

        return `Error en la propiedad '${property}'`;
    }
}
