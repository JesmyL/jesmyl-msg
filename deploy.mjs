import archiver from 'archiver';
import { exec } from 'child_process';
import { build } from 'esbuild';
import FormData from 'form-data';
import file_system from 'fs';
import fetch from 'node-fetch';

const isBuildFront = true;

const filename = `tmp-build-archive.zip`;
const passphrase = (process.argv.find(param => param.startsWith('--pass=')) || '').split('=')[1] || 'default';

const archive = (isFront, onError, versionNum) => {
  const archive = archiver('zip');
  console.info(`Send created ${filename} file`);

  archive.on('error', err => {
    onError?.();
    throw err;
  });

  archive.on('end', () => {
    const body = new FormData();
    body.append(0, file_system.createReadStream(filename));
    fetch(
      `https://msg.jesmyl.ru/bomba.php?pass=${passphrase}&isFront=${isFront ? '1' : ''}&versionNum=` +
        (versionNum ? versionNum : '') +
        `&refreshStatic=${process.argv.indexOf('--refresh-static') < 0 ? '' : '1'}`,
      {
        method: 'POST',
        body,
      },
    )
      .then(r => r.text())
      .then(r => {
        const [firstPart, secondPart] = r.split('===JSON:separation===');

        try {
          if (firstPart) {
            console.info('Upload respond with errors:', JSON.parse(secondPart));
            console.error(firstPart);
            onError?.();
          } else console.info('Upload respond:', JSON.parse(secondPart));
        } catch (e) {
          console.error(e, r);
          onError?.();
        }
        file_system.unlinkSync(filename);
        console.info('DONE!');
      })
      .catch(error => {
        console.error('upload error:', error);
        file_system.unlinkSync(filename);
        onError?.();
      });
  });

  archive.pipe(file_system.createWriteStream(filename));
  if (isFront) archive.directory('dist', false);
  else {
    archive.directory('src/back', false, file => {
      if (
        !file.name.includes('/+') &&
        (file.name.endsWith('.json') || file.name.endsWith('.js') || file.name.endsWith('.php'))
      )
        return file;

      return false;
    });

    archive.directory('prisma', 'prisma', file => {
      if (file.name.endsWith('.prisma') || file.name.endsWith('.sql') || file.name.endsWith('.toml')) {
        return file;
      }

      return false;
    });
  }
  archive.finalize();
};

if (~process.argv.indexOf('--push-front')) {
  const riseVersion = (version, cb) => file_system.writeFile('src/back/+version.json', version, () => cb?.());

  // await build({
  //   entryPoints: ['src/service-worker.ts'],
  //   bundle: true,
  //   minify: true,
  //   keepNames: true,
  //   minifyWhitespace: true,
  //   minifyIdentifiers: true,
  //   treeShaking: true,
  //   platform: 'browser',
  //   format: 'cjs',
  //   outfile: 'dist/service-worker.js',

  //   charset: 'utf8',
  //   // external: ['node-schedule', 'ws', '@prisma/client', '.prisma/client', 'MyLib'],
  //   // drop: ['console', 'debugger'],
  //   // dropLabels: ['DEV', 'TEST'],
  // });

  file_system.readFile('src/back/+version.json', 'utf8', (err, versionStr) => {
    if (err) {
      console.error('version not inkremented', err);
      return;
    }
    let { num } = JSON.parse(versionStr);
    const prevNum = JSON.stringify({ num });
    num++;
    const newNum = JSON.stringify({ num });

    riseVersion(newNum, () => {
      const send = err => {
        console.info('Build is finished.');
        if (err) riseVersion(prevNum, () => console.error('BUILD FAILURE!', err));
        else archive(true, () => riseVersion(prevNum), num);
      };
      if (isBuildFront) {
        // console.info(`collect known icons`);
        // exec('node collect-known-icons.mjs', err => err && send(err));

        console.info(`Build ${num} is running...`);
        exec('npm run build', err => send(err));
      } else {
        console.info(`Send ${num} without building`);
        send(err);
      }
    });
  });
}

if (~process.argv.indexOf('--push-back')) {
  (async () => {
    await build({
      entryPoints: ['src/back/back.index.ts'],
      bundle: true,
      minify: false,
      keepNames: true,
      // minifyWhitespace: true,
      // minifyIdentifiers: true,
      treeShaking: true,
      platform: 'node',
      format: 'cjs',
      outfile: 'src/back/back.index.js',

      charset: 'utf8',
      external: ['node-schedule', 'ws', '@prisma/client', '.prisma/client', 'MyLib'],
      // drop: ['console', 'debugger'],
      // dropLabels: ['DEV', 'TEST'],
    });
    archive(false);
  })();
}
