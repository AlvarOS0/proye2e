import { BadRequestException, Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import path, { join } from 'path';
import { bufferToggle } from 'rxjs';
//import imageType from 'image-type';

@Injectable()
export class FileService {

    private path = require('path');
   // private filePath = path.join('D:', 'FinalBackend', 'backendfacturacion', 'tmp', 'archivos');

    private basePath = this.path.join('C:', 'usuarios', 'alvaros','back', 'backend','tmp', 'archivos');
    //E:\Diplomado Backend\II\diplomadobackend\tmp\archivos
    async save(base64Data: string, filename: string) {
        const safeFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');

        const filePath = join(this.basePath, safeFilename);
        //decodificar el base64
        const buffer = Buffer.from(base64Data, 'base64');

        //const { fileTypeFromBuffer } = await import('file-type');
        //const type = await fileTypeFromBuffer(buffer);
        //console.log(type)
        //verificar si el mimetype del archivo es imagen
        //const type = await imageType(buffer)
        //if(!type){
        //    throw new BadRequestException('El archivo no es una imagen valida')
        //}

        //guardar el archivo en el sistema de archivos
        await writeFile(filePath, buffer);
        //retornar la ruta donde se guardo el archivo
        return filePath;
    }
}