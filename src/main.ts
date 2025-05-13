// main.ts
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import session from 'express-session';
import formidableMiddleware from 'express-formidable';
import AdminJS from 'adminjs';
import * as AdminJSExpress from '@adminjs/express';

import { AppModule } from './app.module.js';

async function bootstrap() {
  try {
    // Create express app
    const expressApp = express();

    // Session + formidable middleware (required for AdminJS auth + file uploads)
    expressApp.use(
      session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
      }),
    );
    expressApp.use(formidableMiddleware());

    // Create AdminJS instance manually
    const adminJs = new AdminJS({
      rootPath: '/admin',
      resources: [],
    });

    // Set up AdminJS authentication
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
      adminJs,
      {
        authenticate: async (email, password) => {
          if (email === 'admin@example.com' && password === 'password') {
            return { email };
          }
          return null;
        },
        cookieName: 'adminjs',
        cookiePassword: 'secret',
      },
      null,
      {
        resave: true,
        saveUninitialized: true,
        secret: 'secret',
      }
    );

    // Mount AdminJS router manually
    expressApp.use(adminJs.options.rootPath, adminRouter);

    // Create Nest app
    const app = await NestFactory.create(
      await AppModule.register(),
      new ExpressAdapter(expressApp),
    );

    await app.listen(3001);
    console.log(`AdminJS available at http://localhost:3001/admin`);
  } catch (error) {
    console.error('Error bootstrapping application:', error);
  }
}
bootstrap();
