import { deployTheCode } from '../jesmyl-pwa/deploy-the-code.mjs';

deployTheCode(
  {
    builtFolder: 'dist',
  },
  {
    targetDir: 'sub',
    toLoad: ['./prisma'],
  },
);
