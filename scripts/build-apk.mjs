// Gera o APK de instalação direta (sem loja): npm run apk
// Resultado: apk/GloboDasNacoes.apk
//
// Requisitos: Android Studio instalado (fornece o Java "JBR" e o SDK Android).
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ANDROID = join(ROOT, 'android');
const isWindows = process.platform === 'win32';
const env = { ...process.env };

// Java: usa o JAVA_HOME existente ou o Java que vem com o Android Studio.
if (!env.JAVA_HOME) {
  const candidates = isWindows
    ? ['C:/Program Files/Android/Android Studio/jbr']
    : ['/Applications/Android Studio.app/Contents/jbr/Contents/Home', '/opt/android-studio/jbr'];
  env.JAVA_HOME = candidates.find((dir) => existsSync(dir));
  if (!env.JAVA_HOME) throw new Error('Java não encontrado. Instale o Android Studio ou defina JAVA_HOME.');
}

// SDK Android: aponta o local.properties para o SDK instalado.
const sdk =
  env.ANDROID_HOME ??
  env.ANDROID_SDK_ROOT ??
  (isWindows ? join(env.LOCALAPPDATA ?? '', 'Android', 'Sdk') : join(env.HOME ?? '', 'Library', 'Android', 'sdk'));
if (!existsSync(sdk)) throw new Error(`SDK Android não encontrado em ${sdk}. Defina ANDROID_HOME.`);
writeFileSync(join(ANDROID, 'local.properties'), `sdk.dir=${sdk.replaceAll('\\', '/')}\n`);

const run = (command, cwd = ROOT) => execSync(command, { cwd, env, stdio: 'inherit' });
run('npm run build');
run('npx cap sync android');
run(isWindows ? `"${join(ANDROID, 'gradlew.bat')}" assembleDebug` : './gradlew assembleDebug', ANDROID);

const apk = join(ANDROID, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
const outDir = join(ROOT, 'apk');
mkdirSync(outDir, { recursive: true });
copyFileSync(apk, join(outDir, 'GloboDasNacoes.apk'));
console.log(`\nAPK pronto: ${join(outDir, 'GloboDasNacoes.apk')}`);
