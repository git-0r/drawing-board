/* eslint-disable @typescript-eslint/no-unused-vars */
import { exec } from 'child_process';

exec(
  'cd ./node_modules/fabric && node build.js modules=ALL exclude=gestures,image_filters && npm run build',
  (err, stdout, stderr) => {
    if (err) {
      console.error(`Error building fabricjs: ${err}`);
      return;
    }

    console.log(`Command output: ${stdout}`);
  }
);

exec('npm run build', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error building drawing board: ${err}`);
    return;
  }

  console.log(`Command output: ${stdout}`);
});
