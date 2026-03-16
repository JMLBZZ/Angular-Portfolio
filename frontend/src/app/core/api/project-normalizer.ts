import { Project, ProjectCategory } from '../../shared/models/project.model';
import { resolveMediaUrl } from './media-url.utils';

interface NormalizeProjectOptions {
  resolveMediaUrls?: boolean;
}

export function normalizeProject(
  project: Project,
  options: NormalizeProjectOptions = {}
): Project {
  return {
    ...project,
    category: normalizeCategory(project.category),
    image: normalizeImage(project.image, options.resolveMediaUrls ?? false),
    cover: normalizeImage(project.cover, options.resolveMediaUrls ?? false),
    images: project.images
      ?.map((img) => normalizeImage(img, options.resolveMediaUrls ?? false))
      .filter(Boolean) as string[] | undefined,
  };
}

/** Le backend peut renvoyer "frontend" / "backend" alors que le frontend filtre avec "front" / "back".*/
function normalizeCategory(category: string | undefined): ProjectCategory {
  switch ((category ?? '').toLowerCase()) {
    case 'frontend':
    case 'front':
      return 'front';

    case 'backend':
    case 'back':
      return 'back';

    case 'fullstack':
    case 'full-stack':
      return 'fullstack';

    case 'uiux':
    case 'ui/ux':
      return 'uiux';

    case 'pao':
      return 'pao';

    default:
      return 'other';
  }
}

function normalizeImage(
  image: string | undefined,
  resolveUrls: boolean
): string | undefined {
  if (!image) return undefined;
  return resolveUrls ? resolveMediaUrl(image) : image;
}