import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module.js';

async function bootstrap() {
  try {
    // Create Express instance
    const expressApp = express();

    // Create NestJS app with Express adapter
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    
    const port = 3001;
    
    // Start the server
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`AdminJS panel is available at: http://localhost:${port}/admin`);
  } catch (error) {
    console.error('Error bootstrapping application:', error);
  }
}
bootstrap(); 