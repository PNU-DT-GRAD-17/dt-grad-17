import { designers } from "./designers";
import { teamProjects, type TeamCategory } from "./team";

type ProjectNavigationItem = {
  label: string;
  to: string;
};

const teamCategories: TeamCategory[] = ["BRANDING", "DP", "OPENING", "WEB"];

const projectNavigation: ProjectNavigationItem[] = [
  ...teamCategories.map((category) => ({
    label: teamProjects[category].title,
    to: teamProjects[category].link,
  })),
  ...designers.filter((designer) => designer.id !== "all").map((designer) => ({
    label: designer.name,
    to: `/project/${designer.id}`,
  })),
];

export const getProjectNeighbors = (path: string) => {
  const index = projectNavigation.findIndex((project) => project.to === path);

  if (index === -1) {
    throw new Error(`Unknown project path: ${path}`);
  }

  return {
    previous: projectNavigation[(index - 1 + projectNavigation.length) % projectNavigation.length],
    next: projectNavigation[(index + 1) % projectNavigation.length],
  };
};
