import express from 'express';
import AdminJS from 'adminjs';
import * as AdminJSExpress from '@adminjs/express';

const PORT = 3003;

const start = async () => {
  const app = express();

  const admin = new AdminJS({
    rootPath: '/admin',
    branding: {
      companyName: 'WTR Admin',
      logo: false,
      softwareBrothers: false,
    },
  });

  const router = AdminJSExpress.buildRouter(admin);
  app.use(admin.options.rootPath, router);

  app.get('/', (req, res) => {
    res.send('AdminJS standalone server. Go to <a href="/admin">/admin</a> to see the panel');
  });

  app.listen(PORT, () => {
    console.log(`AdminJS standalone server started on http://localhost:${PORT}`);
    console.log(`AdminJS available at http://localhost:${PORT}/admin`);
  });
};

start(); 