export type Designer = {
        id: string;
        name: string;
        team: string;
        objectImage: string;
        selectedObjectImage: string;
        conceptName: string;
        motionPosterTitle: string;
        interactionTitle: string;
        projectDetail?: {
                /** 개인 프로젝트 페이지 전체 배경으로 사용하는 모션 포스터 이미지 */
                motionPosterImage?: string;
                description?: string;
                scenarioUrl?: string;
                interactionImages?: string[];
        };
        detail?: {
                nameEn?: string;
                profileImage?: string;
                email?: string;
                instagram?: URL;
                portfolio?: URL;
                phone?: string;
                teamFilm?: string;
                teamInteraction?: string;
                individualInteraction?: string;
        };
}

export const designers: Designer[] = [
        {
                id: "all",
                name: "ALL",
                team: "",
                objectImage: "/images/object/black/000.png",
                selectedObjectImage: "/images/object/color/000.png",
                conceptName: "",
                motionPosterTitle: "",
                interactionTitle: ""
        },
        {
                id: "kang-yeju",
                name: "강예주",
                team: "WEB",
                objectImage: "/images/object/black/001.png",
                selectedObjectImage: "/images/object/color/001.png",
                conceptName: "콤플렉스",
                motionPosterTitle: "-motion-poster-001",
                interactionTitle: "다아섯글자"
        },
        {
                id: "kim-yewon",
                name: "김예원",
                team: "WEB",
                objectImage: "/images/object/black/002.png",
                selectedObjectImage: "/images/object/color/002.png",
                conceptName: "작별",
                motionPosterTitle: "Unpost-you",
                interactionTitle: "Name-you"
        },
        {
                id: "bak-geonhui",
                name: "박건희",
                team: "BRANDING",
                objectImage: "/images/object/black/003.png",
                selectedObjectImage: "/images/object/color/003.png",
                conceptName: "네에글자",
                motionPosterTitle: "-motion-poster-003",
                interactionTitle: "여어서섯글자"
        },
        {
                id: "park-boeun",
                name: "박보은",
                team: "BRANDING",
                objectImage: "/images/object/black/004.png",
                selectedObjectImage: "/images/object/color/004.png",
                conceptName: "23434342342342424",
                motionPosterTitle: "-motion-poster-004",
                interactionTitle: "23434342342342424"
        },
        {
                id: "park-sumin",
                name: "박수민",
                team: "WEB",
                objectImage: "/images/object/black/005.png",
                selectedObjectImage: "/images/object/color/005.png",
                conceptName: "ㅇㅇㅇㅇㅇ",
                motionPosterTitle: "-motion-poster-005",
                interactionTitle: "ㅇㅇㄹㅇㅇㄹㅇㅇ"
        },
        {
                id: "park-jisu",
                name: "박지수",
                team: "OPENING",
                objectImage: "/images/object/black/006.png",
                selectedObjectImage: "/images/object/color/006.png",
                conceptName: "프레임",
                motionPosterTitle: "-motion-poster-006",
                interactionTitle: "Capture"
        },
        {
                id: "bae-myeonghwan",
                name: "배명환",
                team: "DP",
                objectImage: "/images/object/black/007.png",
                selectedObjectImage: "/images/object/color/007.png",
                conceptName: "ㅇㅇㅇㅇㅇㅇㅇ",
                motionPosterTitle: "-motion-poster-007",
                interactionTitle: "ㅇㅇㅇㅇㅇㅇㅇ"
        },
        {
                id: "an-seonju",
                name: "안선주",
                team: "BRANDING",
                objectImage: "/images/object/black/008.png",
                selectedObjectImage: "/images/object/color/008.png",
                conceptName: "ㅇㅇㅇㅇㅇㅇㅇㅇ",
                motionPosterTitle: "-motion-poster-008",
                interactionTitle: "ㅇㅇㅇㅇㅇㅇㅇㅇㅇ"
        },
        {
                id: "yoon-seohyun",
                name: "윤서현",
                team: "OPENING",
                objectImage: "/images/object/black/009.png",
                selectedObjectImage: "/images/object/color/009.png",
                conceptName: "변이",
                motionPosterTitle: "-motion-poster-009",
                interactionTitle: "ㅇㅇㅇㅇㅇㅇㅇㅇ"
        },
        {
                id: "lee-suhyeon",
                name: "이수현",
                team: "DP",
                objectImage: "/images/object/black/010.png",
                selectedObjectImage: "/images/object/color/010.png",
                conceptName: "ㅇㅇㅇㅇㅇㅇ",
                motionPosterTitle: "-motion-poster-010",
                interactionTitle: "ㅇㅇㅇㅇㅇㅇ"
        },
        {
                id: "lee-eunsol",
                name: "이은솔",
                team: "WEB",
                objectImage: "/images/object/black/011.png",
                selectedObjectImage: "/images/object/color/011.png",
                conceptName: "축적",
                motionPosterTitle: "-motion-poster-011",
                interactionTitle: "돌탑"
        },
        {
                id: "lee-hyeonji",
                name: "이현지",
                team: "OPENING",
                objectImage: "/images/object/black/012.png",
                selectedObjectImage: "/images/object/color/012.png",
                conceptName: "여과",
                motionPosterTitle: "-motion-poster-012",
                interactionTitle: "ㅇㅇㅇㅇㅇㅇ"
        },
        {
                id: "jang-jaewon",
                name: "장재원",
                team: "OPENING",
                objectImage: "/images/object/black/013.png",
                selectedObjectImage: "/images/object/color/013.png",
                conceptName: "ㅇㅇㅇㅇ",
                motionPosterTitle: "-motion-poster-013",
                interactionTitle: "양자여동"
        },
        {
                id: "jeon-subean",
                name: "전수빈",
                team: "DP",
                objectImage: "/images/object/black/014.png",
                selectedObjectImage: "/images/object/color/014.png",
                conceptName: "ㅇㅇㅇㅇ",
                motionPosterTitle: "-motion-poster-014",
                interactionTitle: "ㅇㅇㅇㅇㅇㅇ"
        },
        {
                id: "jung-miyeon",
                name: "정미연",
                team: "DP",
                objectImage: "/images/object/black/015.png",
                selectedObjectImage: "/images/object/color/015.png",
                conceptName: "ㅇㅇㅇㅇㅇㅇ",
                motionPosterTitle: "-motion-poster-015",
                interactionTitle: "ㅇㅇㅇㅇㅇㅇ"
        },
        {
                id: "jeong-sunghyun",
                name: "정성현",
                team: "DP",
                objectImage: "/images/object/black/016.png",
                selectedObjectImage: "/images/object/color/016.png",
                conceptName: "ㅇㅇㅇㅇ",
                motionPosterTitle: "-motion-poster-016",
                interactionTitle: "모래성"
        },
        {
                id: "choi-yangjin",
                name: "최양진",
                team: "WEB",
                objectImage: "/images/object/black/017.png",
                selectedObjectImage: "/images/object/color/017.png",
                conceptName: "哀悼",
                motionPosterTitle: "-motion-poster-017",
                interactionTitle: "哀悼"
        },
        {
                id: "hwang-hyejeong",
                name: "황혜정",
                team: "BRANDING",
                objectImage: "/images/object/black/018.png",
                selectedObjectImage: "/images/object/color/018.png",
                conceptName: "ㅇㅇㅇㅇㅇㅇ",
                motionPosterTitle: "-motion-poster-018",
                interactionTitle: "ㅇㅇㅇㅇㅇㅇ"
        },
];
