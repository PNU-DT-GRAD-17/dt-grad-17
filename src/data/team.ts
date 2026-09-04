import { designers, type Designer } from "./designers";

export type TeamCategory = "BRANDING" | "DP" | "OPENING" | "WEB";

export type TeamProject = {
  category: TeamCategory;
  title: string;
  conceptName: string;
  conceptDescription: string;
  videoTitle: string;
  videoDescription: string;
  interactionTitle: string;
  interactionDescription: string;
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
    title: "Branding",
    conceptName: "청춘점화",
    conceptDescription: "청춘은 한 순간의 불꽃놀이처럼 짧고 강렬하게 타오릅니다. 그 빛은 곧 흩어지지만, 잔향은 우리 삶에 지워지지 않는 지도로 남습니다. 우리 팀은 그 불을 붙이는 순간부터 사라진 뒤 남는 여운까지, 청춘의 찰나를 '청춘점화'라는 이름으로 담아냈습니다.",
    videoTitle: "AFTERGLOW",
    videoDescription: "불꽃이 사라진 자리에도 빛은 남는다. 하늘을 가득 채웠던 색이 서서히 옅어지면서도 한동안 눈 안에 머무는 것처럼, 청춘의 장면들도 시간이 지나도 오래도록 우리 안에 남아있다.",
    interactionTitle: "Spark",
    interactionDescription: `반짝이는 별들 사이로 스파크는 청춘이 타오르는 그 찰나의 순간을 담습니다.

불꽃놀이가 남기는 빛의 궤적과 청춘이 지나간 뒤 남는 기억의 흔적을 연결하여 빛나는 순간이 남긴 의미와 감정이 오래도록 기억된다는 ‘잔향’을 시각적으로 경험하게 합니다.

짧고 강렬하게 피었다 사라지는 글귀를 통해, 청춘이 가진 찰나의 강렬함과 그 잔향을 표현한 작품입니다.`,
    description: "브랜딩팀은 전시의 주제와 메세지를 시각적으로 구체화하고, 전시 전반에 일관된 이미지를 구축하는 역할을 담당합니다. 로고, 컬러, 서체, 그래픽 요소 등 전시의 아이덴티티를 개발하고 이를 포스터, 초대장, 리플렛, 도록과 같은 다양한 인쇄물과 굿즈에 적용합니다. 또한 제작한 그래픽 시스템이 웹과 전시장 등 여러 매체에서도 통일감 있게 활용될 수 있도록 기준과 에셋을 공유하며, 관람객이 전시를 하나의 완성된 시각 경험으로 인식할 수 있도록 합니다.",
    objectImage : "/images/team/branding.png",
    link: "/project/team/branding",
    members: getTeamMembers("BRANDING"),
  },

  DP: {
    category: "DP",
    title: "DP",
    conceptName: "열쇠",
    conceptDescription: "남는다는 것은 온전히 보존되는 것이 아니다. 형상은 흩어지고, 흩어진 것은 다시 모여 낯선 전체가 된다. 무엇이 진짜였는지는 알 수 없게 되지만, 그럼에도 끝까지 지워지지 않는 것이 있다. 사라진 것을 붙잡으려는 자는 마침내 제 안의 표상과 마주친다. 잔향은 그 마주침의 이름이다.",
    videoTitle: "그녀의 베이스 노트에는 무언가가 있다",
    videoDescription: "후각은 인간의 오감 가운데 기억과 가장 밀접하게 연결된 감각으로 알려져 있다. 인간에게 가장 오래 남는 감각 기억이 후각이라면, 향수에서 가장 늦게까지 지속되는 것은 베이스 노트이다. 우리는 이 두 구조의 유사성에 주목하여, 시간이 흐르며 사라져가는 기억 속에서도 끝까지 남아있는 감정의 흔적을 향수의 마지막 잔향에 빗대어 담아내고자 하였다.",
    interactionTitle: "현상",
    interactionDescription: "잔향은 물러난 자리에서 생겨난다. 현상도 그렇다. 지나간 사람이 남긴 모습들은 그의 축소판이 아니라 그가 사라진 뒤에 생긴 것이다. 되돌릴 원본은 없고 알아볼 듯 알아볼 수 없는 점들만 남는다. 지나가는 사람은 자신이 남긴 것을 알지 못하고, 머무는 사람만이 그것을 본다. 관람자가 남긴 흔적, 그것이 잔향이다.",
    description: "DP팀은 전시의 전체 틀을 짜는 팀입니다. 개별 작품이 놓일 공간의 질서를 구상하고, 관람 동선과 작품 간의 호응 관계를 설계합니다. 그 틀에 맞춰 각 작품의 배치를 결정하며, 흩어진 작업들이 하나의 전시로 읽히게 만듭니다.",
    objectImage: "/images/team/dp.png",
    link: "/project/team/dp",
    members: getTeamMembers("DP"),
  },

  OPENING: {
    category: "OPENING",
    title: "Opening",
    conceptName: "영향의 축적",
    conceptDescription: `우리는 살아가며 수많은 사람을 만나고 스쳐 지나갑니다. 누군가는 오래 머물고, 누군가는 짧은 순간을 함께하지만 그들이 남긴 흔적은 쉽게 사라지지 않습니다.
기억과 경험으로 쌓인 흔적은 보이지 않는 곳에서 우리에게 영향을 미치며, 그렇게 남겨진 수많은 잔향은 지금의 우리를 만들어갑니다.`,
    videoTitle: "스밈",
    videoDescription: `주인공은 스쳐 지나가는 타인들과 상호작용하며 영향을 주고받고, 그 흔적은 시각적으로 축적되어 남습니다.
누군가와의 인연이 소멸하더라도 상대에게서 받은 영향은 내 안에 스며들어 잔존합니다.
이러한 인연의 생성과 소멸 속에서 남겨진 영향이 축적되어 우리를 채워가는 과정을 추상적 이미지로 풀어내고자 하였습니다`,
    interactionTitle: "한 장 너머",
    interactionDescription: `한 장의 명함만으로 한 사람을 모두 알 수는 없습니다.
우리는 수많은 사람과 관계를 맺으며 영향을 주고받고, 그 시간 속에서 각자의 모습을 만들어갑니다.
명함을 인식하면 참여자의 짧은 비하인드가 재생되며, 한 장 너머에 있는 각자의 모습을 만나볼 수 있습니다.`,
    description: `오프닝 팀은 전시의 시작을 알리는 오프닝 영상을 기획하고 제작하는 팀입니다.
전시의 주제와 분위기를 영상으로 풀어내 관람객에게 전시의 첫인상을 전달하며, 전시를 준비하는 과정 또한 비하인드 영상으로 기록합니다.`,
    objectImage: "/images/team/opening.png",
    link: "/project/team/opening",
    members: getTeamMembers("OPENING"),
  },

  WEB: {
    category: "WEB",
    title: "WEB",
    conceptName: "Build - Up",
    conceptDescription: `지금의 우리는 각자가 지나온 시간들의 잔향으로 이루어진 존재이다. 시간 속에서 각자가 맞닥뜨린 사건, 감정, 태도가 남기는 흔적들에 따라 존재가 가지는 의미가 다양해진다.
우리는 시간 속에서 경험과 감정이 축적되고, 그들이 모여 하나의 존재와 의미를 완성해가는 과정에 주목하였다.`,
    videoTitle: "Level - Up",
    videoDescription: `졸업전시를 준비하며 우리가 거쳐온 시간들을 영상으로 표현하고자 하였다. 해당 영상은 졸업 전시를 준비하며 겪은 다양한 도전과 기억을 게임으로 재해석하여 풀어낸다.
우리는 기나긴 과정을 지나 더 넓은 세계로 발을 내디딘다. 게임 속 캐릭터처럼 ‘레벨업’을 거치며 우리는 이전과 다른 자신이 된다.`,
    interactionTitle: "Fill - Up",
    interactionDescription: "비어 있던 공간은 관람객의 참여가 하나씩 더해지며 새로운 모습으로 채워진다. 서로 다른 관람객의 경험이 모여 하나의 작품을 완성해 나가며, 전시는 관람객의 참여를 통해 비로소 완전한 형태를 갖게 된다.",
    description: "전시회 작업물을 아카이빙하는 졸업 논문 대체 웹 사이트 제작과 SNS 채널 관리를 통해 전시회의 디지털 기록과 홍보를 담당합니다.",
    objectImage: "/images/team/web.png",
    link: "/project/team/web",
    members: getTeamMembers("WEB"),
  },
};
