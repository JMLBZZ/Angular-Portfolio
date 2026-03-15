import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const SITE_URL = process.env.SITE_URL || 'http://localhost:4200';
const PROJECTS_API_URL =
  process.env.PROJECTS_API_URL || 'http://localhost:8080/api/public/projects';

async function generateSitemap() {
  try {
    console.log(`SITE_URL = ${SITE_URL}`);
    console.log(`PROJECTS_API_URL = ${PROJECTS_API_URL}`);

    const response = await fetch(PROJECTS_API_URL);

    if (!response.ok) {
      throw new Error(`Erreur API ${response.status} ${response.statusText}`);
    }

    const projects = await response.json();

    const staticUrls = [
      {
        loc: `${stripTrailingSlash(SITE_URL)}/`,
        changefreq: 'weekly',
        priority: '1.0',
      },
    ];

    const projectUrls = Array.isArray(projects)
      ? projects
          .filter((project) => !!project?.slug)
          .map((project) => ({
            loc: `${stripTrailingSlash(SITE_URL)}/projects/${project.slug}`,
            changefreq: 'monthly',
            priority: '0.8',
          }))
      : [];

    const allUrls = [...staticUrls, ...projectUrls];

    const xml = buildSitemapXml(allUrls);

    const outputPath = path.join(projectRoot, 'src', 'sitemap.xml');

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, xml, 'utf-8');

    console.log(`Sitemap généré avec succès : ${outputPath}`);
    console.log(`Nombre d'URLs : ${allUrls.length}`);
  } catch (error) {
    console.error('Échec de génération du sitemap.');
    console.error(error);
    process.exit(1);
  }
}

function buildSitemapXml(urls) {
  const entries = urls
    .map(
      (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${entries}

</urlset>
`;
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function stripTrailingSlash(value) {
  return String(value).replace(/\/+$/, '');
}

generateSitemap();