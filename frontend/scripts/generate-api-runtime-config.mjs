import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const PUBLIC_API_BASE_URL = normalizeBaseUrl(
  process.env.PUBLIC_API_BASE_URL || 'http://localhost:8080'
);

const outputPath = path.join(
  projectRoot,
  'src',
  'app',
  'core',
  'api',
  'api.runtime-config.ts'
);

async function generateApiRuntimeConfig() {
  const content = `export const API_RUNTIME_CONFIG = {
  publicApiBaseUrl: '${escapeForTs(PUBLIC_API_BASE_URL)}',
} as const;
`;

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, content, 'utf-8');

  console.log(`Configuration API générée : ${outputPath}`);
  console.log(`PUBLIC_API_BASE_URL = ${PUBLIC_API_BASE_URL}`);
}

function normalizeBaseUrl(value) {
  return String(value).trim().replace(/\/+$/, '');
}

function escapeForTs(value) {
  return String(value)
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'");
}

generateApiRuntimeConfig().catch((error) => {
  console.error('Échec de génération du fichier api.runtime-config.ts');
  console.error(error);
  process.exit(1);
});