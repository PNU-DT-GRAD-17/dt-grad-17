export type Designer = {
  id: string;
  name: string;
  team: string;
  objectImage: string;
  selectedObjectImage: string;
  conceptName: string;
  conceptDescription?: string;
  motionPosterTitle: string;
  motionPosterDescription?: string;
  interactionTitle: string;
  interactionDescription?: string;
  projectDetail?: {
    /** 개인 프로젝트 페이지 전체 배경으로 사용하는 모션 포스터 이미지 */
    motionPosterImage?: string;
    scenarioUrl?: string;
    interactionImages?: string[];
  };
  detail?: {
    nameEn?: string;
    profileImage?: string;
    email?: string;
    instagram?: string;
    portfolio?: string;
    phone?: string;
    teamFilm?: string;
    teamInteraction?: string;
    individualInteraction?: string;
  };
};

type DesignerSource = Omit<Designer, "objectImage" | "selectedObjectImage">;

const designerSources: DesignerSource[] = [
  {
    id: "kang-yeju",
    name: "강예주",
    team: "WEB",
    conceptName: "각인",
    conceptDescription: "우리의 기억은 의식 속에서 서서히 흐려집니다. 그러나 무의식에 남아 우리를 의지와 상관없는 행동과 선택으로 이끕니다. 작품은 우리 안에 잔재하는 기억으로써 작용하는 잔향에 주목합니다. 우리의 인식을 넘어 남아있는 잔향을 시각화하여, 이를 통해 사라지지 않는 각인의 존재를 포착합니다.",
    motionPosterTitle: "모든 기억",
    motionPosterDescription: "살아간 기억이 남는 것이 만물의 특성이라면, 아주 오래전에는 어떤 기억이 남았을까요? 손에 남은 기억은 파도에 휩쓸리듯 사라졌다 이내 다시 나타납니다. 사라짐과 나타남이 교차하는 장면 속 우리는 영원을 경험합니다.",
    interactionTitle: "씻어내다",
    interactionDescription: "우리가 행하는 모든 순간은 하나의 사건이 되어 몸에 고스란히 남습니다. 작품은 신체 부위 중 우리가 가장 자유롭게 사용하는 손에 집중합니다. 손을 씻어내는 동안 사라진 줄 알았던 기억이 다시 나타나는 순간. 몸에 남은 기억의 시각화를 통해 관객은 지워지지 않는 각인을 두 손으로 체득합니다.",
    detail: {
      nameEn: "Kang Yeju",
      email: "zdpslmo26@gmail.com",
      instagram: "@amaiisue",
    },
  },
  {
    id: "kim-yewon",
    name: "김예원",
    team: "WEB",
    conceptName: "작별",
    conceptDescription: "사라짐에서 파생되고 끝내 그마저도 사라지는 잔향을 감각하는 것은 사라짐을 멈추는 것이 아니라 잠시 다시 마주하는 작별의 과정이다. 작별은 능동적인 헤어짐으로 마지막에는 사라짐을 받아들이는 태도를 수반한다. 이는 사라짐과 그 잔향을 긍정하거나 부정하는 것이 아닌, 그 자체를 온전하게 수용하는 것이다.",
    motionPosterTitle: "Unpost-you",
    motionPosterDescription: "누군가가 흔적을 담아 붙여놓은 포스트잇을 직접 떼어내는 행위는 그가 남긴 흔적과 능동적으로 작별하는 과정을 상징한다. 포스트잇이 가득 붙어있다가 하나씩 떼어지는 장면들을 연속적으로 나열한 모션포스터는 관람객이 낯선 이의 흔적을 마주하고 떼어내게 될 행위를 예고한다.\n\n‘Unpost-you’는 포스트잇(Post-it)과 그것이 하나씩 떼어지는 장면에서 착안한 제목이다. ‘게시하다’, ‘붙이다’의 의미를 가지는 ‘post’의 반대인 ‘unpost’를 사용해, ‘너를 떼어낸다’라는 의미를 표현하였다.",
    interactionTitle: "Name-you",
    interactionDescription: "이곳을 거쳐간 누군가가 남긴 잔향을 발견하고 포스트잇을 떼어내며, 우리는 그 위에 남겨진 흔적과 다시 한번 마주하고 사라짐을 받아들이는 작별을 경험한다. 이후 자신 또한 누군가에게 발견될 흔적을 남기는 존재로 전환됨을 깨닫는다. 이러한 과정들이 계속해서 반복됨을 이해하면서, 비로소 사라짐과 그 잔향을 어떠한 주관적 판단 없이 있는 그대로 받아들일 수 있게 된다.\n\n‘Name-you’는 ‘당신을 명명하세요’라는 의미를 가진다. 이는 인터렉션의 시작에서 관람객이 자신을 상징하는 닉네임을 적는 행위와 연결된다. 남겨진 이름은 인터렉션의 전체 과정에서 흔적 탐색 도구로 작동한다.",
    detail: {
      nameEn: "Kim Yewon",
      email: "yeahiwonkim@gmail.com",
      instagram: "@yewanking",
      portfolio: "https://linktr.ee/yeahiwonkim",
      phone: "010-3180-1799",
    },
  },
  {
    id: "bak-geonhui",
    name: "박건희",
    team: "BRANDING",
    conceptName: "Not Gone",
    conceptDescription: "보이지 않았다고 해서 사라진 것이 아니다. 다른 것에 영향을 주어 이를 증명한다.",
    motionPosterTitle: "Not Gone",
    motionPosterDescription: "보이지 않았다고 해서 사라진 것이 아니다. 다른 것에 영향을 주어 이를 증명한다.",
    interactionTitle: "Not Gone",
    interactionDescription: "보이지 않았다고 해서 사라진 것이 아니다. 다른 것에 영향을 주어 이를 증명한다.",
    detail: {
      nameEn: "Pak Geon-hui",
      email: "geonhui1224@naver.com",
      instagram: "@gg00_ny",
      phone: "010-6768-6986",
    },
  },
  {
    id: "park-boeun",
    name: "박보은",
    team: "BRANDING",
    conceptName: "잠복",
    conceptDescription: "잔향은 사라짐과 동시에 들리지 않는다. 소리가 그친 뒤 한 박자 늦게 벽을 타고 되돌아오듯, 사라진 것은 곧바로 흔적을 남기는 대신 잠시 숨어 있다가 뒤늦게 드러난다. 우리는 무언가를 건드린 순간이 아니라 이미 지나온 뒤에야 그것이 남긴 것을 알아차린다. 잔향을 감각한다는 것은 붙잡는 일이 아니라, 늦게 도착한 것을 이미 놓친 채로 마주하는 일이다. 사라짐은 끝이 아니라 드러남을 유예하는 시간이다.",
    motionPosterTitle: "잠복",
    motionPosterDescription: "보이지 않던 자리가 조건을 넘어서야 비로소 형태로 떠오른다. 화면 속에서 자취는 즉시 나타나지 않고, 한 박자 늦게 흐릿하게 피었다가 다시 어둠으로 가라앉는다. 잠복이 숨어 있는 상태라면, 발현은 그 숨은 것이 잔향으로 드러나는 순간이다. 관람객이 공간에서 뒤늦게 자신의 흔적과 마주하게 될 경험을, 지연되어 나타나는 이미지의 출현으로 예고한다.",
    interactionTitle: "잠복",
    interactionDescription: "바닥에는 아무것도 표시되어 있지 않다. 당신이 걷고 멈추고 지나간 자리 어딘가에서, 한 박자 늦게 발소리와 속삭임이 피어오르고 방금 서 있던 자리가 흐릿한 빛으로 번진다. 반응은 언제나 뒤늦게 온다. 무언가를 건드렸다는 사실을 알아차렸을 때, 그것은 이미 사라지는 중이다. 잠복해 있던 잔향은 찾으려는 사람이 아니라 무심코 지나가는 사람에게만 드러난다.",
    detail: {
      nameEn: "Boeun Park",
      email: "eun158@pusan.ac.kr",
      instagram: "@eun__158",
      phone: "010-5410-0775",
    },
  },
  {
    id: "park-sumin",
    name: "박수민",
    team: "WEB",
    conceptName: "문득",
    conceptDescription: "잔향이란 무엇인가?\n\n잔향의 여부는 수용자에 따라 달라진다. 즉 잔향은 어떤 물리적 실체라기보다 인식하는 찰나, 그때의 감각에 더 가까운 개념이다.\n\n잔향은 남기는 것이 아니라, 불현듯 느껴지는 것이다.",
    motionPosterTitle: "문득",
    motionPosterDescription: "무심결에 묻은 얼룩,\n어느샌가 바래진 색,\n알게 모르게 스며든 온기...\n\n우리 주변은 흔적으로 가득 차 있지만, 대부분 깨닫지 못한 채 스쳐 지나간다.\n\n이를 알아차리는 발견의 순간, 잔향은 비로소 완성된다.",
    interactionTitle: "문득",
    interactionDescription: "수없이 많은 원인이 서로 끊임없이 영향을 주고받으며 변화라는 결과를 만들어낸다. 이러한 흐름은 시간과 공간 속에서 다양한 형태로 존재하게 된다.\n\n우리도 예외는 아니다. 의식하지 못해도, 의도하지 않아도, 언제나 무언가를 이 세상에 흘려보내고 있다.",
    detail: {
      nameEn: "Park Sumin",
      email: "sumin.park@pusan.ac.kr",
      instagram: "@sumin._.0202",
    },
  },
  {
    id: "park-jisu",
    name: "박지수",
    team: "OPENING",
    conceptName: "프레임",
    conceptDescription: "잔향은 지나간 순간이 사라진 뒤에도 그 순간을 계속 떠올리고 음미하여 향유하게 만드는 것입니다.\n우리는 말, 글, 음악 등 다양한 형태로 그 순간들을 다시 불러오며, 이 과정에서 잔향은 계속 이어집니다.\n잔향은 형태가 없는 감각이지만, 이러한 표현의 프레임을 통해 드러나며 프레임이 존재하는 한, 순간이 사라진 이후에도 계속 감각될 수 있습니다.",
    motionPosterTitle: "Capture",
    motionPosterDescription: "수많은 순간은 붙잡을 새도 없이 우리를 스쳐 지나갑니다. 그중 어떤 순간은 붙잡히고, 비로소 모습을 드러냅니다. \n화면 위를 지나는 캡처 영역은 보이지 않던 순간을 하나씩 포착합니다. 그렇게 붙잡힌 순간은 사라지지 않고, 다시 꺼내어 바라볼 수 있는 장면으로 남습니다.",
    interactionTitle: "Captured Moment",
    interactionDescription: "검은 공간을 떠다니는 빛은 저마다 하나의 순간을 담고 있습니다. \n빛을 몸 가까이 가져오면 그 순간에 남은 빛과 색, 움직임이 공간으로 펼쳐집니다. \n빛을 놓으면 장면은 사라지고, 또 다른 빛을 통해 새로운 순간을 마주합니다.",
    detail: {
      nameEn: "Park Jisu",
      email: "firefisthm@gmail.com",
      instagram: "@me_jisue",
      phone: "010-2250-7560",
    },
  },
  {
    id: "bae-myeonghwan",
    name: "배명환",
    team: "DP",
    conceptName: "문턱",
    conceptDescription: "향은 붙잡으려 할수록 옅어진다. 곱씹는 동안 감각은 무뎌지고, 애써 떠올린 향은 이미 처음의 것이 아니다. 지각은 정보의 양에 비례하지 않는다. 단서가 너무 많아도 너무 적어도 형태는 나타나지 않으며, 어떤 문턱을 넘는 순간에만 흩어진 것들이 하나의 전체로 출현한다. 알아본다는 것은 쌓아 올리는 일이 아니라 문턱을 넘는 일이다.",
    motionPosterTitle: "발아",
    motionPosterDescription: "떨어지는 문자들이 쌓여 식물의 윤곽을 이룬다. 가까이서는 의미 없는 기호의 나열이고, 물러서야 비로소 한 그루로 보인다. 문자는 식물이 아니지만 식물의 자리를 대신 채운다. 반추가 빈 화분 위에 없는 것을 세우듯, 이 화면은 기호 위에 없는 것을 세운다.",
    interactionTitle: "반추",
    interactionDescription: "되새김은 대상을 보존하는 일처럼 보이지만 실은 닳게 하는 일이다. 기억은 열람이 아니라 매번 다시 짓는 일이고, 다시 지을 때마다 처음에서 멀어진다. 관람자는 관찰 도구를 들어 빈 화분을 비춘다. 도구는 한 번에 한 부분만 보여주고, 묘사는 점차 어긋난다. 빠르게 생각하지 못하면 그것이 무엇이었는지 끝내 알 수 없다.",
    detail: {
      nameEn: "Bae Myeonghwan",
      email: "baemh@ambetri.com",
      phone: "010-9093-0632",
    },
  },
  {
    id: "an-seonju",
    name: "안선주",
    team: "BRANDING",
    conceptName: "확증편향",
    conceptDescription: "우리는 세상을 있는 그대로 바라보기보다는, 이미 가지고 있는 생각을 통해 바라본다. 외모 또한 마찬가지로, 자신의 생각과 기준에 따라 편향되기 쉽다. 결국 거울 속에 존재하는 나의 얼굴은, 내가 바라보는 방식에 따라 서로 다른 얼굴이 된다. 이 프로젝트는 ‘내가 보고 있다고 믿는 얼굴’이 과연 실제의 나와 같은 것인지 질문한다.",
    motionPosterTitle: "perception",
    motionPosterDescription: "PERCEPTION은 바라보는 행위 자체가 가진 불완전함을 시각화한다. 가까이 갈수록 전체의 모습은 흐려지고, 눈앞의 작은 조각만이 선명해진다. 반대로 멀리서 전체를 바라볼수록 흩어져 있던 조각들이 하나의 모습으로 다시 드러난다. 작품은 이처럼 관점에 따라 달라지는 인식의 변화를 담아내어,",
    interactionTitle: "perception",
    interactionDescription: "거울에 마주한 얼굴은 진실일까, 혹은 내 안의 의심이 키워낸 잔상일까. \n본 작품은 외모에 작용하는 확증편향과 그로 인한 인지 왜곡을 탐구한다. \n관객이 거울을 보고 얼굴을 마주할 때, 픽셀로 해체된 얼굴의 형상은 콤플렉스가 투영된 가상의 얼굴로 변화한다. \n이러한 왜곡 속에서, 관객은 스스로 선택하여 만들어낸 자아의 잔향을 마주한다.",
    detail: {
      nameEn: "anseonju",
      email: "tomtom134@naver.com",
      instagram: "@s_z00._",
      phone: "010-3184-3697",
    },
  },
  {
    id: "yoon-seohyun",
    name: "윤서현",
    team: "OPENING",
    conceptName: "진화",
    conceptDescription: "누구나 잔향을 기반으로 살아온다. 우리는 공동체 안에서 살아가며 필연적으로 흔적을 남기고, 누군가가 그 위에 새로운 흔적을 덧씌우며 변화를 일으킨다. 변화의 결과물은 기존의 잔향으로부터 자유로울 수 없으며 곧 다음 변화의 잔향이 된다. 축적되는 변화 속, 잔향은 진화를 반복하며 가변적인 형태로 현재를 구성해나간다.",
    motionPosterTitle: "MUTATE",
    motionPosterDescription: "기존의 흔적 위에 다른 색채가 덧씌워지며 새로운 색으로 변한다. 새로운 색은 다시 변화를 위한 토대가 된다. 진화에는 기반이 필요하므로 결과물은 이전으로부터 완전히 새로울 수 없다. 그럼에도 불구하고 새로움이 개입하여 과거와의 다름을 만들어내는 과정을, 캔버스 위로 떨어진 새로운 색의 잉크를 변이라고 부른다.",
    interactionTitle: "CHIMERA",
    interactionDescription: "본 작품은 타인의 잔향이 미치는 영향을 실감하고 나 또한 타인에게 잔향을 남기는 경험을 제공한다. 타인이 남긴 이전 세대의 그림에 새로운 그림을 덧씌우면 두 잔향이 섞이며 새로운 세대가 만들어진다. 개인은 변이를 만들어내는 환경이고, 기존의 그림에 무엇을 덧씌울지 판단하는 행위가 곧 잔향의 진화를 위한 자연선택이다.",
    detail: {
      nameEn: "Yoon Seohyun",
      email: "yooncrafting@gmail.com",
      instagram: "@yoon__craft",
      portfolio: "https://linktr.ee/yoon__craft",
    },
  },
  {
    id: "lee-suhyeon",
    name: "이수현",
    team: "DP",
    conceptName: "적시",
    conceptDescription: "긍정의 순간을 간직하기 위해서, 부정적인 시간을 받아들이기 위해서 우리는 의식적인 개입이 필요하다. 본질을 무리하게 바꾸는 것이 아닌 잠시 동안 멈춰서 잔향을 직시하는 시간은 의미를 사유하고 변화하는 감정을 정리해 줄 것이다.",
    motionPosterTitle: "적시",
    motionPosterDescription: "컵에 액체가 차오르고 이내 가득 차 넘치기 직전의 순간을 모션 포스터에 담았다.\n\n액체가 채워지는 장면을 보면서 넘치기 직전, 물이 가득 찬 찰나에서의 멈춤이 주는 만족을 느껴보자. 모션 포스터 속 액체는 관람자의 시각에 따라 긍정과 부정을 넘나든다. 당신이 사라진 것을 사유하는 시간, 잔향이 가득 찬 것은 아닐까? ",
    interactionTitle: "적시",
    interactionDescription: "컵에 물이 넘치는 것, 차가 적절히 우러나는 시간, 물고기가 미끼를 물고 도망치기 전까지의 찰나. 적시를 느낄 수 있는 순간들을 전시를 통해 간접적으로 경험할 수 있다. 적절한 시기를 가늠해 보며 관람객 본인과 본인이 머물던 잔향에 대하여 사유해 보는 시간을 만든다.",
    detail: {
      nameEn: "lee suhyeon",
      instagram: "@missikki_",
    },
  },
  {
    id: "lee-eunsol",
    name: "이은솔",
    team: "WEB",
    conceptName: "소원의 누적",
    conceptDescription: "‘잔향’이란 가시적인 존재나 실체가 사라진 뒤에도 소멸하지 않고, \n비가시적인 형태로 공간과 시간 속에 계속해서 전이되어 나타나는 존재의 지속성입니다.\n물리적인 잔향은 공기 중으로 피어올라 확산되어 사라지지만, \n마음속에 새겨진 사람들의 소망과 흔적은 기억의 앙금처럼 밑바닥으로 가라앉아 겹겹이 '누적'됩니다. ",
    motionPosterTitle: "Make a wish",
    motionPosterDescription: "‘소원의 누적’ 컨셉을 몽환적이고 감각적인 모션 그래픽으로 담아낸 포스터입니다.\n사진 레이어들이 차곡차곡 쌓여가는 층위모션을 활용하여, \n비가시적인 소망과 시간의 흔적들이 정갈하게 누적되어 하나의 상징적 아키텍처로 완성되는 과정을 보여줍니다.",
    interactionTitle: "Make a wish",
    interactionDescription: "관람객이 실제 돌탑을 쌓는 물리적 행위에 실시간으로 반응하는 인터랙티브 미디어 작품입니다. \n관람객이 쌓아 올리는 돌탑의 높이와 크기에 비례하여, 스크린 속 동화적 숲에 다채로운 꽃들이 자라나고 만개합니다. \n관람객 개개인의 소망과 정성이 디지털 공간의 생태계를 피워내는 정성스러운 자양분이 되는 과정을 체험할 수 있습니다.",
    detail: {
      nameEn: "LEE EUNSOL",
      email: "congsol0906@naver.com",
      instagram: "@unezzol",
      phone: "010-4095-5195",
    },
  },
  {
    id: "lee-hyeonji",
    name: "이현지",
    team: "OPENING",
    conceptName: "여과",
    conceptDescription: "우리가 느끼는 잔향은 저절로 남은 흔적처럼 보이지만, 사실 그 안엔 무엇을 남기고 무엇을 흘려보낼지 걸러낸 마음의 여과가 숨어 있습니다.",
    motionPosterTitle: "잔존",
    motionPosterDescription: "수많은 말들이 오가지만, 걸러진 단어만이 마음속에 남아 쌓입니다.",
    interactionTitle: "아직도 여기에",
    interactionDescription: "감정에 민감하게 반응하는 사람들, 흔히 '감정형'이라 불리는 사람들은 상대방의 말 속에서 감정을 담은 키워드를 무의식적으로 골라 듣게 됩니다.\n\n예를 들어 \"오늘 네가 나를 도와줘서 고마웠어. 졸업 축하해. 나는 네가 좋아.\" 라는 말 속에서, 다른 정보는 흐려져도 '고마워', '축하해', '좋아' 같은 감정 단어만은 마음 속에 선명하게 남습니다.\n",
    detail: {
      nameEn: "LEE HYEON JI",
      email: "luisxx8@naver.com",
      instagram: "@hyy_lhj_",
      phone: "010-6315-4067",
    },
  },
  {
    id: "jang-jaewon",
    name: "장재원",
    team: "OPENING",
    conceptName: "Big Freeze",
    conceptDescription: "사라짐을 개인의 소멸에서 시작해 분자, 원자, 아원자를 거쳐 우주 팽창의 끝인 빅 프리즈로 정의한다. 빅 프리즈 이후에도 하이젠베르크 불확정성 원리에 따라 완전히 0이 될 수 없는 미세한 떨림이 남는데, 이 잔향이 곧 양자요동이다.",
    motionPosterTitle: "Quantum Fluctuation",
    motionPosterDescription: "넘실거리는 파동에서 입자가 생성되고, 입자들이 응집하며 텍스트가 드러난다. 이내 입자는 다시 파동으로 흩어지며, 양자요동의 전 과정을 함축적으로 보여준다.",
    interactionTitle: "양자 요동",
    interactionDescription: "완전한 고요 속에도 사라지지 않는 미세한 반짝거림, 양자요동을 형상화한 인터랙티브 설치 작품이다. 관객의 움직임이 곧 관측이 되어 파동의 넘실거림을 일으키고, 그 속도에 따라 숨어있던 입자들이 반짝이며 드러난다. 관객이 떠난 뒤에도 움직임의 여운이 서서히 잦아들다가, 다시 고요한 요동으로 돌아간다.",
    detail: {
      nameEn: "Jang Jaewon",
      email: "45866381a@gmail.com",
      instagram: "@jangjaewant",
      portfolio: "https://linktr.ee/jangjaewant",
      phone: "010-4586-6381",
    },
  },
  {
    id: "jeon-subean",
    name: "전수빈",
    team: "DP",
    conceptName: "기억의 왜곡",
    conceptDescription: "기억은 떠올리는 순간 원래의 모습 그대로 되돌아오는 것이 아니라, 시간과 감정, 현재의 시선에 따라 조금씩 변형된다. 그렇게 어긋난 기억은 완전히 사라지지 않고 흔적처럼 남으며, 그 지속되는 감각을 잔향으로 보았다.",
    motionPosterTitle: "MEMORY",
    motionPosterDescription: "기억을 형성하는 뉴런과 신경망의 구조를 모티브로, 어둠 속 작은 빛과 세포들이 움직이며 서로 연결되는 과정을 표현한다.하나의 망을 이루고 확장되는 모습을 통해 기억이 재구성되고 축적되는 흐름을 시각화하여 보여준다.",
    interactionTitle: "가까워질수록",
    interactionDescription: "작품 속 망 아래의 사진은 관객의 거리에 따라 다른 결로 바뀐다. 하나의 이미지 안에서 원본과 각기 다른 필터의 모습이 교차하고, 가까워지고 멀어지는 사이 원래의 모습은 서서히 어긋나며 변형된 잔상으로 남는다.",
    detail: {
      nameEn: "JEON SUBEAN",
      email: "qls5189@pusan.ac.kr",
      instagram: "@__iamsubean",
      phone: "010-7774-8744",
    },
  },
  {
    id: "jung-miyeon",
    name: "정미연",
    team: "DP",
    conceptName: "Waterproof Dreams",
    conceptDescription: "꿈은 수용성이다. 간밤에 베개를 식은땀으로 적시게 한 악몽도 따뜻한 아침 샤워 한방이면 모두 씻겨 내려가지 않던가? 그런데 어떤 꿈은 간직하고 싶다. 아침 샤워에도 녹아내리지 않고 마음 한구석에 잔향처럼 머무르는 꿈. 나는 그것을 워터프루프 꿈이라고 부르기로 했다.",
    motionPosterTitle: "Waterproof Dreams",
    motionPosterDescription: "비가 내린다. 밤사이 꾼 꿈들이 빗물에 희석되고 결국에는 씻겨 내려간다. 아침이 오면 대부분이 그렇게 사라진다. 그런데 어떤 꿈은 남아 있다. 왜 그들은 물에 젖지 않았을까? 그들을 끝까지 붙잡은 것은 무엇이었을까? 어쩌면 무언가를 영원히 간직한다는 것은 생각보다 쉬운 일이 아닐지도 모른다.",
    interactionTitle: "Carousel 1878",
    interactionDescription: "여기에 한 회전목마가 있다. 빗속에서도 이 회전목마는 돌아간다. 방수 처리된 천막 아래엔 인류가 그토록 붙잡아두려 했던 꿈과 기억이, 회전 운동으로 얻은 생명력으로 한순간을 영원히 달린다. 빛으로 소환된 이곳의 말과 기수는 세월이 지나도 바래지 않는다.",
    detail: {
      nameEn: "Miyeon Jung",
      email: "mformiyeon@gmail.com",
      instagram: "@dialmformiyeon",
      phone: "010-2788-3975",
    },
  },
  {
    id: "jeong-sunghyun",
    name: "정성현",
    team: "DP",
    conceptName: "미련",
    conceptDescription: "미련은 대상이 사라진 뒤에도 완전히 사라지지 않고 남아 있는 감정의 흔적입니다.\n 이 흔적은 시간이 지나면서 점차 희미해지지만, 특정한 외부 자극을 만나면 다시 선명하게 떠오릅니다. 저는 사라짐 이후에도 완전히 소멸하지 않고 남아 있는 감정의 흔적에 주목했고, 이를 ‘잔향’이라는 개념으로 바라보았습니다.",
    motionPosterTitle: "흔적",
    motionPosterDescription: "무질서하게 흩어진 입자들은 서로 모여 하나의 형태를 이루고, 다시 흩어져 사라집니다. 하지만 형태는 사라져도 그를 이루던 흔적은 남습니다. 어쩌면 그 흔적 속에는 잊었다고 생각했던 무언가가 다시 떠오를 가능성이 남아 있을지도 모릅니다.",
    interactionTitle: "모래성",
    interactionDescription: "한때 선명했던 감정은 어느 순간 사라진 듯 보입니다. 그러나 완전히 지워진 것은 아니며, 작은 계기만으로도 다시 떠오를 수 있습니다. 모래성은 무너져 형태를 잃어도 다시 형태를 갖출 수 있듯, 미련 역시 사라진 듯한 자리에서 흔적으로 남아 언제든 다시 선명해질 지도 모릅니다.",
    detail: {
      nameEn: "Jeong SungHyun",
      email: "sicross88@gmail.com",
      instagram: "@hyeon0_zth",
      phone: "010-4953-3455",
    },
  },
  {
    id: "choi-yangjin",
    name: "최양진",
    team: "WEB",
    conceptName: "哀悼 (애도)",
    conceptDescription: "깊이 사랑한 것들의 잔향은 슬픔을 불러온다. 그 슬픔에는 끝이 보이지 않고 계속해서 우리에게 찾아온다. 애도와 삶, 무엇 하나 외면할 수 없지만 그 사이에 \n균형은 분명히 존재한다. 그 균형에 대한 정답은 존재하지 않는다. 우리는 그 답을 스스로 찾아가는 과정을 반드시 거쳐야 한다.",
    motionPosterTitle: "哀悼 (애도)",
    motionPosterDescription: "우리는 반복적으로 슬픔 앞에서 선택의 시간을 마주한다. 삶과 애도 중 어느 것을 선택하겠는가? 그 선택들이 쌓여 당신만의 균형을 찾아가게 된다.",
    interactionTitle: "哀悼 (애도)",
    interactionDescription: "무한한 시간 속에서 돌아오는 슬픔을 당신은 어떻게 대할 것인가. 삶과 애도 사이의 균형에 대한 답은 당신만이 알 수 있다. \n그 답을 찾아가는 과정을 체험해보자. ",
    detail: {
      nameEn: "CHOI YANGJIN",
      email: "chldidwls@pusan.ac.kr",
      instagram: "@yangj2n",
    },
  },
  {
    id: "hwang-hyejeong",
    name: "황혜정",
    team: "BRANDING",
    conceptName: "시절인연(時節因緣)",
    conceptDescription: "‘시절인연’은 모든 인연에는 저마다의 때가 있다는 말에서 시작한다. 어떤 관계는 오래 이어지고, 어떤 관계는 짧게 스쳐 지나가지만 그 시간들이 완전히 사라지는 것은 아니다. 한때 가까웠던 사람, 우연히 만났던 사람, 이미 멀어진 사람까지 우리는 수많은 관계를 지나며 살아간다. 이 작업에서는 그렇게 한 시절을 함께했던 인연이 시간이 흐른 뒤에도 기억과 감정의 흔적으로 남는 모습을 ‘실’과 ‘매듭’을 통해 표현하고자 했다.",
    motionPosterTitle: "시절인연(時節因緣)",
    motionPosterDescription: "모션포스터에서는 서로 다른 실이 만나고 엮이며 하나의 매듭을 이루는 모습을 통해 인연의 형성과 흔적을 표현했다. 각각의 실은 서로 다른 관계를 의미하며, 시간이 흐르며 얽히고 형태를 이루는 과정 속에서 인연이 쌓여가는 모습을 보여준다. 이후 완성된 매듭과 실의 흔적을 통해, 한때 맺어진 관계가 지나간 뒤에도 기억과 감정으로 남아 현재의 나를 이루고 있음을 나타내고자 했다.",
    interactionTitle: "시절인연(時節因緣)",
    interactionDescription: "관객이 직접 실을 연결하고 매듭을 만들며 자신이 지나온 관계를 떠올려보는 참여형 전시이다. 실을 가로로 길게 이어 오래 지속된 인연을 표현하거나, 세로로 깊게 연결해 깊은 관계를 나타낼 수 있으며, 가로와 세로가 비슷하게 얽힌 형태는 우연히 마주친 인연을 의미한다. 관객이 만든 실의 형태는 실시간으로 분석되어 인연의 유형에 따라 서로 다른 모습으로 변환되고, 화면 속 자신의 실루엣 위에 겹쳐진다. 이를 통해 지나온 관계의 시간과 깊이를 눈에 보이는 흔적으로 남기고, 그 인연들이 현재의 나를 이루는 일부가 되었음을 표현했다.",
    detail: {
      nameEn: "HWANG HYEJEONG",
      email: "ssssandy@pusan.ac.kr",
      instagram: "@oncldnein",
      phone: "010-2111-6330",
    },
  },
];

export const designers: Designer[] = [
  {
    id: "all",
    name: "ALL",
    team: "",
    objectImage: "/images/object/black/000.png",
    selectedObjectImage: "/images/object/color/000.png",
    conceptName: "",
    motionPosterTitle: "",
    interactionTitle: "",
  },
  ...designerSources.map((designer, index) => {
    const imageNumber = String(index + 1).padStart(3, "0");

    return {
      ...designer,
      objectImage: `/images/object/black/${imageNumber}.png`,
      selectedObjectImage: `/images/object/color/${imageNumber}.png`,
    };
  }),
];
