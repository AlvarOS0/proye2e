import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
//import { Role } from './roles/entities/role.entity';
dotenv.config();


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.BD_HOST,
    port: +process.env.BD_PUERTO,
    username: process.env.BD_USUARIO,
    password: process.env.BD_CLAVE,
    database: process.env.BD_NOMBRE,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,  // O false en producción
    migrations: ['src/database/migrations/*.ts'], // Carpeta de migraciones
});

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source ha sido inicializado!');
    })
    .catch((error) => console.error('Error durante la inicialización de Data Source', error));
