  import { Module } from '@nestjs/common';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { ConfigModule, ConfigService } from '@nestjs/config';

  import { AppController } from './app.controller';
  import { AppService } from './app.service';

  import { UsersModule } from './models/users/users.module';
  import { AuthModule } from './models/auth/auth.module';
  import { AplicationsModule } from './models/aplications/aplications.module';
  import { VacanciesModule } from './models/vacancies/vacancies.module';

  console.log('API DB:', process.env.POSTGRES_DB);

  @Module({
    imports: [
      // Global environmental variables
      ConfigModule.forRoot({
        isGlobal: true,
      }),

      // Database connection
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          type: 'postgres',
          host: config.get<string>('POSTGRES_HOST', 'db'),
          port: config.get<number>('POSTGRES_PORT', 5432),
          username: config.get<string>('POSTGRES_USER', 'postgres'),
          password: config.get<string>('POSTGRES_PASSWORD', '123456'),
          database: config.get<string>('POSTGRES_DB', 'node'),
          autoLoadEntities: true,
          synchronize: true,
        }),
      }),
      // App modules
      UsersModule,
      AuthModule,
      AplicationsModule,
      VacanciesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule { }
