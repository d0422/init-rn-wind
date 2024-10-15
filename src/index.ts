import { input } from '@inquirer/prompts';
import { ChildProcess, spawn } from 'child_process';
import { mkdir, readFile, writeFile } from 'fs/promises';

const promisify = (process: ChildProcess) => {
  return new Promise((resolve) => {
    process.on('exit', () => resolve(null));
  });
};

const app = async () => {
  const result = await input({
    message: 'Input your project name :',
  });
  await promisify(
    spawn(`npx`, ['react-native', 'init', result], {
      stdio: 'inherit',
    })
  );

  await promisify(
    spawn(`npm`, ['install', 'nativewind'], {
      cwd: `./${result}`,
      stdio: 'inherit',
    })
  );

  await promisify(
    spawn(`npm`, ['install', '--save-dev', 'tailwindcss@3.3.2'], {
      cwd: `./${result}`,
      stdio: 'inherit',
    })
  );

  await promisify(
    spawn('npx', ['tailwindcss', 'init'], {
      cwd: `./${result}`,
      stdio: 'inherit',
    })
  );

  await mkdir(`${process.cwd()}/${result}/src`);

  const tailwindConfig = await readFile(
    `${process.cwd()}/${result}/tailwind.config.js`,
    'utf-8'
  );

  const finalTailwindConfig = tailwindConfig.replace(
    'content: [],',
    `content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],`
  );

  await writeFile(
    `${process.cwd()}/${result}/tailwind.config.js`,
    finalTailwindConfig
  );

  const babelConfig = await readFile(
    `${process.cwd()}/${result}/babel.config.js`,
    'utf-8'
  );

  const finalBabelConfig = babelConfig.replace(
    ',',
    `,
  plugins: ['nativewind/babel'],`
  );

  await writeFile(
    `${process.cwd()}/${result}/babel.config.js`,
    finalBabelConfig
  );
};

app();
