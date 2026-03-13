import { Project, ProjectCategory } from '../../shared/models/project.model';

export function normalizeProject(project: Project): Project {
  return {
    ...project,
    category: normalizeCategory(project.category),
    image: normalizeImage(project.image),
    cover: normalizeImage(project.cover),
    images: project.images
      ?.map((img) => normalizeImage(img))
      .filter(Boolean) as string[] | undefined,
  };
}

/**
 * Le backend peut renvoyer "frontend" / "backend"
 * alors que le frontend filtre avec "front" / "back".
 */
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

function normalizeImage(image: string | undefined): string | undefined {
  if (!image) return undefined;
  return image;
}