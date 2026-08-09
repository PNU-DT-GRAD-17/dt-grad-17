import { designers, type Designer } from "./designers";

export type TeamCategory = "BRANDING" | "DP" | "OPENING" | "WEB";

export type TeamProject = {
  category: TeamCategory;
  title: string;
  conceptName: string;
  videoTitle: string;
  interactionTitle: string;
  description: string;
  objectImage: string;
  link: string;
  members: Designer[];
};

const getTeamMembers = (category: TeamCategory) =>
  designers.filter((designer) => designer.team === category);

export const teamProjects: Record<TeamCategory, TeamProject> = {
  BRANDING: {
    category: "BRANDING",
    title: "브랜딩 팀 작품명",
    conceptName: "브랜딩 팀 컨셉",
    videoTitle: "팀 영상 제목",
    interactionTitle: "팀 인터 제목",
    description: "브랜딩 팀 프로젝트 설명",
    objectImage : "/images/team/branding.png",
    link: "/project/team/branding",
    members: getTeamMembers("BRANDING"),
  },

  DP: {
    category: "DP",
    title: "DP 팀 작품명",
    conceptName: "DP 팀 컨셉",
    videoTitle: "팀 영상 제목",
    interactionTitle: "팀 인터 제목",
    description: "DP 팀 프로젝트 설명",
    objectImage: "/images/team/dp.png",
    link: "/project/team/dp",
    members: getTeamMembers("DP"),
  },

  OPENING: {
    category: "OPENING",
    title: "오프닝 팀 작품명",
    conceptName: "오프닝 팀 컨셉",
    videoTitle: "팀 영상 제목",
    interactionTitle: "팀 인터 제목",
    description: "오프닝 팀 프로젝트 설명",
    objectImage: "/images/team/opening.png",
    link: "/project/team/opening",
    members: getTeamMembers("OPENING"),
  },

  WEB: {
    category: "WEB",
    title: "잔향:졸업전시회",
    conceptName: "웹 팀 컨셉",
    videoTitle: "팀 영상 제목",
    interactionTitle: "팀 인터 제목",
    description: "웹 팀 프로젝트 설명",
    objectImage: "/images/team/web.png",
    link: "/project/team/web",
    members: getTeamMembers("WEB"),
  },
};
