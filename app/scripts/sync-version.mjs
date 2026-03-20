import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rawTag = process.argv[2] ?? '';
const version = rawTag.replace(/^v/, '').trim();

if (!version) {
  console.error('Missing release tag/version.');
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(version)) {
  console.error(`Invalid semver version: ${version}`);
  process.exit(1);
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');

const packageJsonPath = path.join(root, 'package.json');
const tauriConfigPath = path.join(root, 'src-tauri', 'tauri.conf.json');
const cargoTomlPath = path.join(root, 'src-tauri', 'Cargo.toml');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
packageJson.version = version;
fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

const tauriConfig = JSON.parse(fs.readFileSync(tauriConfigPath, 'utf8'));
tauriConfig.version = version;
fs.writeFileSync(tauriConfigPath, `${JSON.stringify(tauriConfig, null, 2)}\n`);

const cargoToml = fs.readFileSync(cargoTomlPath, 'utf8');
const cargoVersionPattern = /^version = ".*"$/m;

if (!cargoVersionPattern.test(cargoToml)) {
  console.error('Could not find Cargo.toml package version.');
  process.exit(1);
}

const updatedCargoToml = cargoToml.replace(
  cargoVersionPattern,
  `version = "${version}"`,
);

fs.writeFileSync(cargoTomlPath, updatedCargoToml);

console.log(`Synchronized app version to ${version}`);
