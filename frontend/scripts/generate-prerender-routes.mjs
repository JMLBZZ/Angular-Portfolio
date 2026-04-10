import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const PROJECTS_API_URL =
  process.env.PROJECTS_API_URL || 'http://localhost:8080/api/public/projects';

const outputPath = path.join(projectRoot, 'prerender-routes.txt');

async function generateRoutesFile() {
  const routes = new Set(['/']);

  try {
    console.log(`PROJECTS_API_URL = ${PROJECTS_API_URL}`);

    const response = await fetch(PROJECTS_API_URL);

    if (!response.ok) {
      throw new Error(`Erreur API ${response.status} ${response.statusText}`);
    }

    const projects = await response.json();

    if (Array.isArray(projects)) {
      for (const project of projects) {
        const rawSlug = typeof project?.slug === 'string' ? project.slug.trim() : '';

        if (!rawSlug) {
          continue;
        }

        const encodedSlug = encodeURIComponent(rawSlug);
        routes.add(`/projects/${encodedSlug}`);
      }
    }
  } catch (error) {
    console.warn('Impossible de récupérer les projets publiés pour le prerender.');
    console.warn('Le build continuera avec la route "/" uniquement.');
    console.warn(error instanceof Error ? error.message : error);
  }

  const fileContent = `${Array.from(routes).join('\n')}\n`;
  await writeFile(outputPath, fileContent, 'utf-8');

  console.log(`Fichier généré : ${outputPath}`);
  console.log(`Nombre de routes de prerender : ${routes.size}`);
}

generateRoutesFile().catch((error) => {
  console.error('Échec de génération du fichier prerender-routes.txt');
  console.error(error);
  process.exit(1);
});