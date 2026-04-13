import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const SITE_URL = normalizeSiteUrl(
  process.env.SITE_URL || 'http://localhost:4200'
);

const PROJECTS_API_URL =
  process.env.PROJECTS_API_URL || 'http://localhost:8080/api/public/projects';

async function generateSeoFiles() {
  try {
    console.log(`SITE_URL = ${SITE_URL}`);
    console.log(`PROJECTS_API_URL = ${PROJECTS_API_URL}`);

    const projects = await fetchProjectsSafely();

    const staticUrls = [
      {
        loc: `${SITE_URL}/`,
        changefreq: 'weekly',
        priority: '1.0',
      },
    ];

    const projectUrls = Array.isArray(projects)
      ? deduplicateUrls(
          projects
            .map((project) => buildProjectUrlEntry(project))
            .filter(Boolean)
        )
      : [];

    const allUrls = [...staticUrls, ...projectUrls];

    const sitemapXml = buildSitemapXml(allUrls);
    const robotsTxt = buildRobotsTxt(SITE_URL);

    const sitemapOutputPath = path.join(projectRoot, 'src', 'sitemap.xml');
    const robotsOutputPath = path.join(projectRoot, 'src', 'robots.txt');

    await mkdir(path.dirname(sitemapOutputPath), { recursive: true });

    await writeFile(sitemapOutputPath, sitemapXml, 'utf-8');
    await writeFile(robotsOutputPath, robotsTxt, 'utf-8');

    console.log(`Sitemap généré avec succès : ${sitemapOutputPath}`);
    console.log(`Robots généré avec succès : ${robotsOutputPath}`);
    console.log(`Nombre d'URLs dans le sitemap : ${allUrls.length}`);
  } catch (error) {
    console.error('Échec de génération des fichiers SEO.');
    console.error(error);
    process.exit(1);
  }
}

async function fetchProjectsSafely() {
  try {
    const response = await fetch(PROJECTS_API_URL);

    if (!response.ok) {
      throw new Error(`Erreur API ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.warn('Impossible de récupérer les projets publiés pour le sitemap.');
    console.warn('Le build continuera avec la route "/" uniquement.');
    console.warn(error instanceof Error ? error.message : error);

    return [];
  }
}

function buildProjectUrlEntry(project) {
  const rawSlug = typeof project?.slug === 'string' ? project.slug.trim() : '';

  if (!rawSlug) {
    return null;
  }

  return {
    loc: `${SITE_URL}/projects/${encodeSlug(rawSlug)}`,
    changefreq: 'monthly',
    priority: '0.8',
  };
}

function encodeSlug(slug) {
  return slug
    .split('/')
    .map((segment) => encodeURIComponent(segment.trim()))
    .join('/');
}

function deduplicateUrls(urls) {
  const seen = new Set();

  return urls.filter((url) => {
    if (seen.has(url.loc)) {
      return false;
    }

    seen.add(url.loc);
    return true;
  });
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

function buildRobotsTxt(siteUrl) {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /admin/login

Sitemap: ${siteUrl}/sitemap.xml
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

function normalizeSiteUrl(value) {
  return String(value).trim().replace(/\/+$/, '');
}

generateSeoFiles();