import { Module, DynamicModule } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

@Module({})
export class AppModule {
  static async register(): Promise<DynamicModule> {
    const { AdminModule } = await import('@adminjs/nestjs');

    return {
      module: AppModule,
      imports: [
        AdminModule.createAdminAsync({
          useFactory: () => ({
            adminJsOptions: {
              rootPath: '/admin',
              resources: [],
            },
            auth: {
              authenticate,
              cookieName: 'adminjs',
              cookiePassword: 'secret',
            },
            sessionOptions: {
              resave: true,
              saveUninitialized: true,
              secret: 'secret',
            },
          }),
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    };
  }
}
