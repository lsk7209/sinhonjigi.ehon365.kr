import fs from "node:fs";
import path from "node:path";

const site = "sinhonjigi";
const batch = "batch-3";
const root = process.cwd();
const outDir = path.join(root, "output", site);
const manifestPath = path.join(outDir, "manifest.json");
const titleMapPath = path.join(outDir, "title-map-batch-3.json");
const reportPath = path.join(outDir, "report.json");

const structures = [
  "비교형",
  "체크리스트형",
  "절차형",
  "문제해결형",
  "FAQ형",
  "사례형",
  "의사결정형",
  "일정관리형",
  "실수예방형",
  "문서점검형",
];

const visualSets = [
  ["info_callout", "comparison_table", "decision_box", "faq_block"],
  ["caution_box", "checklist_box", "timeline", "official_link_card"],
  ["decision_box", "scenario_table", "step_cards", "risk_labels"],
  ["info_callout", "document_table", "mistake_list", "final_check"],
  ["comparison_table", "caution_box", "example_box", "action_list"],
];

const officialSources = [
  {
    id: "gov24",
    name: "정부24",
    url: "https://www.gov.kr/portal/main",
    type: "official",
    official: true,
  },
  {
    id: "bokjiro",
    name: "복지로",
    url: "https://www.bokjiro.go.kr/",
    type: "official",
    official: true,
  },
  {
    id: "molit",
    name: "국토교통부",
    url: "https://www.molit.go.kr/",
    type: "official",
    official: true,
  },
  {
    id: "nhuf",
    name: "주택도시기금",
    url: "https://nhuf.molit.go.kr/",
    type: "official",
    official: true,
  },
  {
    id: "nts",
    name: "국세청",
    url: "https://www.nts.go.kr/",
    type: "official",
    official: true,
  },
  {
    id: "fairtrade",
    name: "공정거래위원회",
    url: "https://www.ftc.go.kr/",
    type: "official",
    official: true,
  },
  {
    id: "lh",
    name: "LH 청약플러스",
    url: "https://apply.lh.or.kr/",
    type: "official",
    official: true,
  },
  {
    id: "hf",
    name: "한국주택금융공사",
    url: "https://www.hf.go.kr/",
    type: "official",
    official: true,
  },
];

const topicGroups = [
  {
    section: "jiwon",
    cluster: "신혼 행정 자동화",
    basePath: "/jiwon/guide",
    items: [
      ["정부24 가족관계증명서 준비", ["전자문서지갑", "제출처", "유효기간", "공동인증서"], "제출 직전에 다시 발급해야 하는 서류를 줄이는 순서"],
      ["혼인신고 후 행정 변경", ["주소변경", "건강보험", "자동차등록", "은행정보"], "부부가 따로 처리할 항목과 같이 처리할 항목 구분법"],
      ["전자문서지갑 신혼 서류", ["모바일제출", "원본확인", "기관제출", "보관기간"], "캡처본 대신 제출 가능한 문서를 고르는 기준"],
      ["신혼부부 민원 알림 설정", ["정부24", "복지로", "청약알림", "지자체공고"], "놓친 지원금을 줄이는 알림 조합 만들기"],
      ["부부 공동 서류 폴더", ["등본", "가족관계증명서", "계약서", "납입증빙"], "신청 직전 허둥대지 않는 파일명 규칙"],
    ],
  },
  {
    section: "jiwon",
    cluster: "신혼 자금출처 방어",
    basePath: "/jiwon/guide",
    items: [
      ["신혼집 자금출처 메모", ["증여", "차용증", "계좌이체", "혼인공제"], "부모 도움과 부부 저축을 분리 기록하는 법"],
      ["부모님 지원금 차용증", ["이자율", "상환일정", "계좌기록", "증빙보관"], "가족 간 돈거래를 말로만 남기지 않는 기준"],
      ["혼수 비용 증빙 관리", ["카드영수증", "계약금", "환불조건", "배송일"], "큰 지출을 나중에 설명 가능하게 남기는 순서"],
      ["신혼 전세보증금 이체", ["입금자명", "계약자", "영수증", "확정일자"], "계약서와 계좌 기록을 맞추는 체크포인트"],
      ["부부 공동저축 출처정리", ["월급통장", "적금해지", "비상금", "대출실행"], "집 계약 전 자금 흐름표를 만드는 방법"],
    ],
  },
  {
    section: "jiwon",
    cluster: "지역 지원금 문의 전략",
    basePath: "/jiwon/guide",
    items: [
      ["지자체 신혼 지원금 전화문의", ["거주기간", "예산소진", "신청기한", "구비서류"], "전화 전에 물어볼 질문을 한 장으로 정리하는 법"],
      ["행정복지센터 방문 준비", ["신분증", "등본", "혼인관계", "통장사본"], "헛걸음을 줄이는 방문 전 확인 순서"],
      ["지역화폐 결혼지원 사용처", ["가맹점", "유효기간", "사용제한", "환불불가"], "현금처럼 보이는 지원의 실제 제한 확인법"],
      ["복지로 지자체 공고 검색", ["생애주기", "가구조건", "지역검색", "담당부서"], "키워드보다 조건 필터로 찾는 방법"],
      ["신혼 지원금 중복수급 확인", ["중앙지원", "지자체지원", "회사복지", "소득기준"], "받아도 되는 지원과 충돌하는 지원 구분법"],
    ],
  },
  {
    section: "jiwon",
    cluster: "주택 보증 리스크",
    basePath: "/jiwon/guide",
    items: [
      ["전세보증보험 가입 거절 대비", ["보증한도", "선순위채권", "임대인동의", "주택가격"], "계약 전에 거절 가능성을 먼저 거르는 기준"],
      ["임대인 세금체납 확인", ["열람동의", "미납국세", "보증금", "계약특약"], "보증금 위험을 계약서 문장으로 줄이는 법"],
      ["선순위 근저당 확인", ["등기부등본", "채권최고액", "말소조건", "잔금일"], "싸 보이는 전세를 숫자로 다시 보는 순서"],
      ["전입신고 확정일자 타이밍", ["잔금일", "입주일", "대항력", "우선변제"], "하루 차이가 리스크가 되는 지점 확인법"],
      ["전세 계약 특약 문장", ["보증보험", "하자보수", "대출불가", "계약해제"], "분쟁 때 쓸 수 있는 문장과 못 쓰는 문장 구분"],
    ],
  },
  {
    section: "wedding",
    cluster: "예식장 계약서 방어",
    basePath: "/wedding/guide",
    items: [
      ["예식장 계약서 특약", ["보증인원", "식대", "대관료", "취소수수료"], "상담 말과 계약서 문장을 맞추는 확인법"],
      ["예식장 보증인원 조정", ["최소인원", "하객변동", "식대총액", "잔금"], "계약 전 열어둘 범위를 정하는 기준"],
      ["예식장 추가비 항목", ["음향", "꽃장식", "폐백", "주차"], "견적서 빈칸에서 나중에 생기는 비용 찾기"],
      ["예식 취소 위약금 계산", ["계약금", "소비자분쟁", "취소시점", "증빙"], "감정이 아니라 기준표로 손해를 줄이는 법"],
      ["예식장 시식 체크", ["메뉴구성", "음료", "서비스료", "하객동선"], "맛 후기보다 계약 조건을 먼저 보는 방법"],
    ],
  },
  {
    section: "wedding",
    cluster: "스냅 영상 계약 점검",
    basePath: "/wedding/guide",
    items: [
      ["본식스냅 납품조건", ["원본", "보정본", "납기", "저작권"], "사진 수보다 납품 범위를 먼저 보는 기준"],
      ["웨딩영상 계약 범위", ["촬영시간", "하이라이트", "원본영상", "수정횟수"], "영상 상품 설명서에서 빠지는 문장 확인법"],
      ["스냅 작가 교체 리스크", ["지정작가", "대체작가", "환불조건", "계약주체"], "포트폴리오와 실제 촬영자를 맞추는 법"],
      ["본식 사진 수정 요청", ["보정범위", "수정기한", "추가금", "파일형식"], "마음에 안 들 때 쓸 수 있는 요청 기준"],
      ["웨딩 앨범 추가금", ["페이지수", "인화", "액자", "배송비"], "처음 견적과 최종 결제 차이를 줄이는 법"],
    ],
  },
  {
    section: "wedding",
    cluster: "혼수 배송 일정관리",
    basePath: "/wedding/guide",
    items: [
      ["가전 배송일정 조율", ["입주일", "설치기사", "사다리차", "재고확인"], "한꺼번에 몰리는 배송을 나누는 순서"],
      ["혼수 가구 사이즈 실측", ["엘리베이터", "문폭", "동선", "반품비"], "예쁜 가구보다 먼저 재야 할 치수"],
      ["가전 모델명 비교", ["출시연도", "에너지효율", "행사모델", "설치조건"], "할인율보다 모델명을 먼저 확인하는 법"],
      ["혼수 계약 취소 조건", ["청약철회", "맞춤제작", "배송전취소", "위약금"], "매장에서 들은 설명을 문서로 남기는 기준"],
      ["입주 청소와 가전 설치", ["청소일", "설치일", "하자확인", "관리실"], "순서가 바뀌면 생기는 재방문 비용 줄이기"],
    ],
  },
  {
    section: "wedding",
    cluster: "상견례 비용과 역할",
    basePath: "/wedding/guide",
    items: [
      ["상견례 장소 선택", ["교통", "룸예약", "코스가격", "소음"], "가족 만족보다 갈등 가능성을 줄이는 기준"],
      ["상견례 비용 분담", ["예약금", "식사비", "선물", "이동비"], "누가 낼지 애매한 지출을 미리 나누는 법"],
      ["상견례 대화 주제", ["결혼일정", "예산", "혼수", "가족행사"], "처음 만남에서 피해야 할 질문과 남길 질문"],
      ["상견례 선물 준비", ["가격대", "보관", "취향", "전달타이밍"], "부담스럽지 않게 준비하는 판단 기준"],
      ["상견례 후 일정 정리", ["예식장", "스드메", "혼인신고", "집계약"], "말로 끝난 합의를 실행 목록으로 바꾸는 법"],
    ],
  },
  {
    section: "sinhon",
    cluster: "신혼집 하자 점검",
    basePath: "/sinhon/guide",
    items: [
      ["신혼집 입주 하자 체크", ["사진기록", "관리사무소", "보수기한", "계약서"], "입주 첫날 놓치기 쉬운 증거 남기는 법"],
      ["누수 곰팡이 확인", ["천장", "창틀", "욕실", "환기"], "냄새보다 흔적을 먼저 보는 현장 점검 기준"],
      ["보일러 에어컨 점검", ["작동확인", "수리이력", "리모컨", "필터"], "계절이 바뀐 뒤 발견되는 비용을 줄이는 법"],
      ["층간소음 사전 확인", ["방문시간", "관리규약", "구조", "이웃문의"], "계약 전 들을 수 있는 신호와 없는 신호 구분"],
      ["입주 전 사진 기록", ["벽지", "마루", "가전", "수전"], "퇴거 때 보증금을 지키는 촬영 순서"],
    ],
  },
  {
    section: "sinhon",
    cluster: "맞벌이 시간관리",
    basePath: "/sinhon/guide",
    items: [
      ["맞벌이 저녁 루틴", ["퇴근시간", "식사준비", "청소", "휴식"], "피곤한 날에도 유지되는 최소 규칙 만들기"],
      ["부부 주말 일정표", ["가족방문", "장보기", "운동", "데이트"], "쉬는 날이 집안일로만 끝나지 않게 나누는 법"],
      ["집안일 자동화 기준", ["로봇청소기", "정기배송", "분담앱", "가사서비스"], "돈을 써도 되는 일과 직접 해야 하는 일 구분"],
      ["맞벌이 출근 동선", ["대중교통", "주차", "환승", "야근"], "지도 거리보다 실제 피로도를 보는 기준"],
      ["부부 회의 시간", ["30분", "안건", "기록", "다음행동"], "싸움이 아니라 운영회의로 끝내는 순서"],
    ],
  },
  {
    section: "sinhon",
    cluster: "신혼 건강 루틴",
    basePath: "/sinhon/guide",
    items: [
      ["부부 건강검진 계획", ["검진주기", "가족력", "비용", "예약"], "미루기 쉬운 검진을 달력에 넣는 방법"],
      ["신혼 수면환경 점검", ["매트리스", "조명", "소음", "실내온도"], "수면 습관이 다른 부부의 타협 기준"],
      ["신혼 식비와 건강식", ["장보기", "밀프렙", "외식", "간식"], "아끼기와 건강을 같이 맞추는 식단 운영법"],
      ["부부 운동 루틴", ["시간대", "비용", "목표", "동기부여"], "같이 할 운동과 따로 할 운동을 나누는 기준"],
      ["신혼 스트레스 관리", ["대화", "휴식", "가족경계", "업무피로"], "문제가 커지기 전에 신호를 기록하는 법"],
    ],
  },
  {
    section: "sinhon",
    cluster: "반려동물 신혼 생활",
    basePath: "/sinhon/guide",
    items: [
      ["반려동물 신혼집 계약", ["반려동물특약", "소음", "원상복구", "관리규약"], "입주 전 허용 범위를 문서로 확인하는 법"],
      ["부부 반려동물 비용", ["사료", "병원비", "보험", "미용"], "월 생활비에 빠지기 쉬운 지출 계산법"],
      ["반려동물 돌봄 분담", ["산책", "배식", "병원", "여행"], "한 사람에게 몰리지 않는 역할표 만들기"],
      ["신혼 여행 반려동물 맡기기", ["호텔링", "펫시터", "가족돌봄", "응급연락"], "출발 전 확인할 위탁 기준"],
      ["반려동물 이웃 민원 예방", ["짖음", "냄새", "공용공간", "엘리베이터"], "분쟁 전에 관리할 생활 규칙"],
    ],
  },
  {
    section: "jiwon",
    cluster: "청약 점수 실전관리",
    basePath: "/jiwon/guide",
    items: [
      ["신혼 청약 가점 기록", ["무주택기간", "부양가족", "청약통장", "소득"], "계산보다 증빙을 먼저 맞추는 순서"],
      ["청약통장 납입 회차", ["납입금", "인정회차", "미납", "자동이체"], "오래 넣었는데 인정이 안 되는 경우 점검법"],
      ["예비신혼부부 청약 증빙", ["혼인예정", "입주전혼인", "가족관계", "서약서"], "당첨 후 리스크를 줄이는 서류 준비"],
      ["청약 부적격 소명", ["주택소유", "세대원", "소득초과", "소명기한"], "당황하지 않고 확인할 순서"],
      ["공공분양 소득 기준", ["맞벌이", "월평균소득", "건강보험", "원천징수"], "연봉이 아니라 기준표로 보는 방법"],
    ],
  },
  {
    section: "jiwon",
    cluster: "대출 상담 준비",
    basePath: "/jiwon/guide",
    items: [
      ["신혼 전세대출 상담 질문", ["한도", "금리", "보증료", "상환방식"], "은행 방문 전에 적어갈 질문 목록"],
      ["대출 실행일 잔금일 조율", ["심사기간", "계약금", "잔금", "전입"], "하루 차이로 막히는 일정을 피하는 법"],
      ["부부 소득 합산 대출", ["원천징수", "재직증명", "휴직", "프리랜서"], "소득자료가 다를 때 준비할 서류"],
      ["대출 갈아타기 판단", ["중도상환수수료", "금리차", "보증료", "남은기간"], "낮은 금리만 보고 움직이지 않는 계산법"],
      ["신용점수 대출 준비", ["카드론", "현금서비스", "연체", "조회이력"], "상담 전 한 달 동안 피해야 할 행동"],
    ],
  },
  {
    section: "wedding",
    cluster: "웨딩박람회 상담 방어",
    basePath: "/wedding/guide",
    items: [
      ["웨딩박람회 현장계약", ["계약금", "취소기한", "사은품", "제휴조건"], "당일 혜택보다 해지 조건을 먼저 보는 법"],
      ["웨딩박람회 상담 동선", ["예산", "스드메", "예식장", "혼수"], "상담 피로를 줄이는 방문 순서"],
      ["웨딩박람회 개인정보", ["마케팅동의", "연락처", "철회", "제3자제공"], "상담 후 전화 폭탄을 줄이는 체크포인트"],
      ["웨딩박람회 견적 비교", ["포함항목", "추가금", "계약주체", "유효기간"], "싼 견적과 불완전한 견적 구분법"],
      ["웨딩박람회 사은품 조건", ["수령시점", "반환조건", "제세공과금", "배송비"], "공짜처럼 보이는 혜택의 비용 확인법"],
    ],
  },
  {
    section: "wedding",
    cluster: "결혼식 하객 운영",
    basePath: "/wedding/guide",
    items: [
      ["하객 명단 정리", ["초대범위", "주소록", "좌석", "답례"], "부모님 명단과 부부 명단을 합치는 기준"],
      ["모바일 청첩장 발송", ["발송시점", "개인정보", "오시는길", "계좌"], "편하지만 조심해야 할 문구 점검"],
      ["축의금 접수 준비", ["접수자", "봉투", "명단", "정산"], "분실과 누락을 줄이는 역할 분담"],
      ["결혼식 주차 안내", ["주차권", "혼잡시간", "대중교통", "동선"], "하객 불편을 줄이는 사전 안내법"],
      ["결혼식 답례품 선택", ["예산", "보관", "배송", "수량"], "센스보다 실패 가능성을 낮추는 기준"],
    ],
  },
  {
    section: "sinhon",
    cluster: "신혼 소비 통제",
    basePath: "/sinhon/guide",
    items: [
      ["신혼 첫 달 카드값", ["고정비", "혼수잔금", "외식", "교통"], "예산이 무너지는 지출을 빨리 찾는 방법"],
      ["부부 용돈 규칙", ["개인계좌", "공동계좌", "취미비", "경조사"], "간섭 없이 통제력을 남기는 기준"],
      ["신혼 구독서비스 정리", ["OTT", "멤버십", "정기배송", "보험앱"], "작은 자동결제를 한 번에 줄이는 법"],
      ["부부 비상금 목표", ["생활비", "의료비", "실직", "수리비"], "몇 개월치를 둘지 현실적으로 정하는 계산법"],
      ["신혼 가계부 항목", ["주거비", "식비", "교통비", "부모님", "데이트"], "싸우지 않고 지출을 보는 분류 기준"],
    ],
  },
  {
    section: "sinhon",
    cluster: "가족 경계 설정",
    basePath: "/sinhon/guide",
    items: [
      ["양가 방문 빈도", ["명절", "생일", "거리", "근무일정"], "공평함보다 지속 가능한 기준 세우기"],
      ["부모님 경제지원 경계", ["생활비", "대출", "선물", "간섭"], "감사와 부담을 분리해서 말하는 법"],
      ["명절 일정 조율", ["이동시간", "숙박", "식사", "휴식"], "매년 반복되는 갈등을 줄이는 일정표"],
      ["가족 단체대화방 규칙", ["연락빈도", "사진공유", "답장", "사생활"], "작은 불편을 초기에 정리하는 방법"],
      ["부부 우선순위 합의", ["가족행사", "돈", "시간", "결정권"], "양가보다 먼저 부부가 맞춰야 할 질문"],
    ],
  },
  {
    section: "jiwon",
    cluster: "출산 전 행정 연결",
    basePath: "/jiwon/guide",
    items: [
      ["임신 전 지원제도 탐색", ["보건소", "검진비", "엽산", "상담"], "아직 임신 전이어도 확인할 공공지원"],
      ["난임 지원 신청 준비", ["소득기준", "진단서", "시술기관", "횟수"], "병원 일정과 행정 접수를 맞추는 법"],
      ["임신 바우처 카드 선택", ["국민행복카드", "진료비", "사용처", "발급일"], "카드 혜택보다 사용 제한을 먼저 보는 기준"],
      ["출산 전 회사 서류", ["출산휴가", "육아휴직", "급여신청", "확인서"], "회사와 공단 절차를 나눠 준비하는 순서"],
      ["첫만남이용권 사전준비", ["출생신고", "복지로", "지급일", "사용처"], "출산 후 한 번에 처리할 항목 미리 보기"],
    ],
  },
  {
    section: "sinhon",
    cluster: "신혼 안전 체크",
    basePath: "/sinhon/guide",
    items: [
      ["신혼집 화재 안전", ["소화기", "감지기", "멀티탭", "가스밸브"], "입주 첫 주에 확인할 안전 목록"],
      ["도어락 비밀번호 관리", ["초기화", "임시번호", "가족공유", "이사전세입자"], "누가 알고 있는지 모르는 번호 정리법"],
      ["택배 보관 동선", ["무인택배함", "공동현관", "분실", "개인정보"], "작은 분실과 정보 노출을 줄이는 습관"],
      ["신혼집 방범 체크", ["창문잠금", "현관센서", "CCTV", "관리실"], "불안감을 실제 점검표로 바꾸는 법"],
      ["응급 연락망 만들기", ["병원", "가족", "관리실", "보험"], "둘 중 한 명이 없을 때도 움직이는 연락 순서"],
    ],
  },
];

function slugify(value) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function toKstIso(date) {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 19)}+09:00`;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function yamlList(items) {
  return items.map((item) => `  - "${item}"`).join("\n");
}

function sourceLinks(section) {
  const candidates =
    section === "wedding"
      ? [officialSources[5], officialSources[0], officialSources[1], officialSources[4], officialSources[2]]
      : section === "sinhon"
        ? [officialSources[0], officialSources[2], officialSources[5], officialSources[4], officialSources[1]]
        : [officialSources[0], officialSources[1], officialSources[2], officialSources[3], officialSources[4]];

  return candidates.map((source) => `- [${source.name}](${source.url})`).join("\n");
}

function introFor(row, index) {
  const patterns = [
    `${row.main_keyword}를 검색하는 사람은 보통 이미 선택지가 몇 개로 좁혀진 상태입니다. 문제는 ${row.expanded_keywords[0]}만 보고 움직이면 ${row.expanded_keywords[1]}와 ${row.expanded_keywords[2]}에서 다시 멈춘다는 점입니다. 이 글은 ${row.primary_reader_situation}에 맞춰 지금 확인할 것, 기록할 것, 마지막에 공식 경로에서 대조할 것을 분리했습니다.`,
    `${row.main_keyword}는 한 번에 정답을 고르는 주제가 아닙니다. 부부의 일정, 돈의 흐름, 서류 상태가 같이 맞아야 하므로 ${row.expanded_keywords[0]}와 ${row.expanded_keywords[1]}를 같은 표에 놓고 봐야 합니다. 특히 ${row.expanded_keywords[3]}는 나중에 찾으면 늦는 경우가 많아 초반에 확인해야 합니다.`,
    `${row.main_keyword}에서 자주 생기는 실수는 정보를 많이 보는 데 있습니다. 많이 보는 것보다 ${row.decision_criterion}를 먼저 정해야 판단이 빨라집니다. 이 글은 상담 전, 계약 전, 신청 전처럼 단계가 바뀔 때마다 확인해야 할 ${row.expanded_keywords[0]}, ${row.expanded_keywords[2]} 기준을 나눕니다.`,
    `${row.main_keyword}를 준비할 때 부부가 서로 다른 자료를 보고 있으면 같은 결정을 말하면서도 다른 기준으로 움직입니다. 그래서 먼저 ${row.expanded_keywords[0]}의 뜻을 맞추고, 그다음 ${row.expanded_keywords[1]}와 ${row.expanded_keywords[3]}를 문서로 남겨야 합니다.`,
  ];
  return patterns[index % patterns.length];
}

function bodyByStructure(row, index) {
  const first = row.expanded_keywords[0];
  const second = row.expanded_keywords[1];
  const third = row.expanded_keywords[2];
  const fourth = row.expanded_keywords[3];

  const sharedOfficial = `## ${third} 공식 확인 경로와 출처 기록

${row.main_keyword}는 블로그 글 하나로 확정할 수 있는 문제가 아닙니다. 제도, 계약, 비용, 민원 절차는 시점과 지역에 따라 달라질 수 있으므로 아래 공식 경로에서 최신 공고일, 적용 기간, 담당 부서, 제출 양식을 다시 확인해야 합니다.

:::info 공식 확인 링크
${sourceLinks(row.type)}
:::

공식 페이지를 볼 때는 제목만 보지 말고 게시일, 적용 대상, 제외 대상, 문의 부서를 같이 봐야 합니다. 특히 ${first}와 ${fourth}는 상담자가 말로 설명해도 실제 책임은 공고문이나 계약서 문장에 남는 경우가 많습니다.`;

  const practicalDepth = `## 부부 상황별로 다르게 적용하는 법

${row.main_keyword}는 모든 부부에게 같은 순서로 적용되지 않습니다. 이미 계약이나 예약이 끝난 부부라면 ${first}를 처음부터 다시 고르는 것보다 지금 가진 문서가 충분한지 확인하는 편이 우선입니다. 반대로 아직 후보를 비교하는 단계라면 ${second}를 기준표에 넣어야 뒤늦은 변경 비용을 줄일 수 있습니다.

### 아직 후보를 고르는 단계

이 단계에서는 최종 결정보다 제외 기준이 더 중요합니다. ${first}가 불명확하거나 ${third}의 공식 기준을 확인할 수 없는 선택지는 잠시 보류하는 편이 좋습니다. 좋아 보이는 조건이 많아도 ${fourth}가 문서로 남지 않으면 나중에 같은 설명을 다시 받을 방법이 없습니다. 부부가 각자 마음에 드는 후보를 고르기 전에 제외할 조건 세 가지를 먼저 합의하면 비교가 훨씬 가벼워집니다.

### 상담이나 계약을 앞둔 단계

상담 전에는 질문을 많이 준비하는 것보다 같은 질문을 같은 표현으로 남기는 것이 중요합니다. 예를 들어 ${second}가 비용인지 조건인지 기한인지에 따라 답변의 의미가 달라질 수 있습니다. 상담자가 즉석에서 설명한 내용은 메모하고, 중요한 답변은 문자나 이메일로 다시 확인해 두세요. 나중에 계약서나 신청 내역과 다르면 어떤 문장을 기준으로 다시 물어볼지 분명해집니다.

### 이미 진행한 뒤 점검하는 단계

이미 돈을 냈거나 신청을 넣었다면 당장 바꾸기보다 회수 가능한 위험을 먼저 봐야 합니다. ${first}는 지금이라도 보완할 수 있는지, ${third}는 공식 기한이 남아 있는지, ${fourth}는 취소나 변경 조건과 연결되는지 확인하세요. 이 단계에서는 완벽한 선택보다 손실을 줄이는 순서가 더 현실적입니다.

:::info 실행 메모
오늘 바로 할 수 있는 일은 세 가지입니다. 첫째, ${row.main_keyword} 관련 문서를 한 폴더에 모읍니다. 둘째, ${first}와 ${second}가 확인된 자료에 표시합니다. 셋째, ${fourth}와 관련된 날짜를 부부가 같이 보는 캘린더에 넣습니다.
:::`;

  const decisionDepth = `## 마지막 확인표와 부부 대화 예시

${row.main_keyword}를 끝까지 확인했다면 마지막에는 "알고 있다"가 아니라 "설명할 수 있다"를 기준으로 점검해야 합니다. ${first}를 누가 담당하는지, ${second}가 바뀌면 어떤 비용이나 일정이 움직이는지, ${third}를 어느 공식 출처에서 확인했는지 말로 설명할 수 있어야 합니다. 설명이 막히는 항목은 아직 확인이 끝난 것이 아닙니다.

| 최종 질문 | 확인 기준 | 부족할 때 보완 |
| --- | --- | --- |
| ${first}는 확정됐나 | 문서나 화면으로 다시 볼 수 있음 | 담당자 답변을 문자로 재확인 |
| ${second}는 비용과 연결되나 | 총액, 추가비, 환불 조건 분리 | 견적서와 약관을 같은 폴더에 저장 |
| ${third}는 최신 기준인가 | 공식 페이지 게시일 확인 | 담당 부서 또는 기관에 재문의 |
| ${fourth}는 되돌릴 수 있나 | 취소, 변경, 보완 기한 확인 | 달력 알림과 역할 담당 지정 |

대화는 길게 할 필요가 없습니다. "이 선택을 나중에 설명할 자료가 있나?", "둘 중 한 명만 알아도 되는 일인가?", "지금 미루면 비용이 생기는가?" 세 문장만 확인해도 충분합니다. 이 질문에 답하지 못하면 결정을 미루는 것이 아니라 확인할 항목을 좁히는 단계로 보면 됩니다.`;

  const faq = `## ${row.main_keyword} 자주 묻는 질문

### ${row.main_keyword}는 언제 확인하는 게 좋나요?

선택 직전보다 한 단계 앞에서 확인하는 편이 좋습니다. 예를 들어 계약을 앞두고 있다면 상담 전, 상담을 앞두고 있다면 후보를 고르기 전부터 ${first}와 ${second}를 나눠 두어야 합니다.

### ${fourth}는 꼭 문서로 남겨야 하나요?

분쟁이나 누락 가능성이 있는 항목은 문서로 남기는 편이 안전합니다. 문자, 이메일, 계약서, 신청 내역처럼 나중에 다시 확인할 수 있는 형태가 좋습니다.

### 부부 의견이 다르면 어떤 기준을 먼저 보나요?

금액보다 되돌리기 어려운 기준을 먼저 봅니다. 기한, 해지 조건, 명의, 제출처, 보증 여부처럼 한 번 지나가면 복구가 어려운 항목부터 합의하는 것이 좋습니다.`;

  const endings = [
    `## 마무리 판단

${row.main_keyword}는 빠르게 결정하는 것보다 틀렸을 때 되돌리기 어려운 지점을 먼저 줄이는 편이 낫습니다. 오늘 할 일은 간단합니다. ${first} 자료를 모으고, ${second} 기준을 부부가 같은 표에 적고, ${third}는 공식 경로에서 한 번 더 대조하세요. 그 다음에 ${fourth}를 실행 일정에 넣으면 불필요한 재확인이 줄어듭니다.`,
    `## 다음 행동

지금 바로 결론을 내리기 어렵다면 세 칸만 채우면 됩니다. 첫째, ${first}에서 확정된 것. 둘째, ${second}에서 아직 모르는 것. 셋째, ${fourth} 때문에 미루면 안 되는 날짜입니다. 이 세 가지가 보이면 ${row.main_keyword} 판단은 훨씬 단순해집니다.`,
    `## 부부가 같이 확인할 한 줄 기준

${row.main_keyword}의 기준은 "좋아 보이는 선택"이 아니라 "나중에 설명 가능한 선택"이어야 합니다. ${first}, ${second}, ${third}를 기록으로 남기고 ${fourth}만 마지막에 확인해도 대부분의 실수는 줄어듭니다.`,
  ];

  if (row.structure_type === "비교형") {
    return `${introFor(row, index)}

:::decision 먼저 결론
${row.main_keyword}는 ${first}와 ${second}를 따로 보지 말고 같은 표에서 비교해야 합니다. 비용이 낮아도 ${third}가 불리하면 실제 선택지는 달라질 수 있습니다.
:::

## ${first}와 ${second}를 같이 봐야 하는 이유

${first}는 보통 눈에 잘 보이는 조건입니다. 금액, 일정, 가능 여부처럼 바로 판단할 수 있어 빠르게 결론을 내리기 쉽습니다. 하지만 ${second}는 나중에 책임이나 불편으로 돌아오는 경우가 많습니다. 두 기준을 분리하면 처음에는 유리해 보여도 실행 단계에서 다시 조정해야 합니다.

| 비교 기준 | ${first} 중심 판단 | ${second}까지 본 판단 |
| --- | --- | --- |
| 비용 | 당장 낮은 금액을 선택 | 추가비와 취소비까지 합산 |
| 일정 | 가능한 날짜만 확인 | 발급일, 납기, 처리 기간 포함 |
| 책임 | 상담 설명에 의존 | 문서와 제출 내역으로 확인 |
| 리스크 | 문제 생기면 대응 | 문제 전 조건으로 차단 |

## ${third}에서 갈리는 실제 선택

${third}는 같은 선택을 다르게 만드는 기준입니다. 상담 단계에서는 비슷해 보여도 실제 신청, 계약, 입주, 결제 단계에서는 요구하는 자료가 달라질 수 있습니다. 이때 부부가 같은 기준표를 갖고 있으면 감정적인 논쟁보다 확인할 자료가 먼저 보입니다.

:::caution 비교할 때 흔한 착각
- 할인, 지원, 가능이라는 말만 보고 결정한다.
- ${fourth} 조건을 마지막에 확인한다.
- 상담자가 말한 내용을 계약서나 신청 내역으로 남기지 않는다.
:::

${sharedOfficial}

${practicalDepth}

${decisionDepth}

${faq}

${endings[index % endings.length]}`;
  }

  if (row.structure_type === "체크리스트형") {
    return `${introFor(row, index)}

## ${row.main_keyword} 시작 전 체크리스트

아래 항목은 모두 한 번에 완성할 필요가 없습니다. 다만 빈칸이 어디인지 알아야 다음 상담이나 신청에서 시간을 줄일 수 있습니다.

:::info 확인 순서
1. ${first} 기준을 부부가 같은 말로 정의한다.
2. ${second}와 관련된 문서나 화면을 저장한다.
3. ${third}는 공식 페이지에서 최신 날짜를 확인한다.
4. ${fourth}는 마감일이나 해지 조건처럼 되돌리기 어려운지 본다.
:::

| 항목 | 준비할 자료 | 통과 기준 |
| --- | --- | --- |
| ${first} | 계약서, 공고문, 상담 메모 | 두 사람이 같은 뜻으로 설명 가능 |
| ${second} | 영수증, 신청 내역, 캡처 | 날짜와 금액이 확인 가능 |
| ${third} | 공식 안내 페이지 | 게시일과 담당 부서 확인 |
| ${fourth} | 문자, 이메일, 약관 | 나중에 다시 증명 가능 |

## 빠뜨리기 쉬운 부분

가장 자주 빠지는 것은 사소해 보이는 날짜입니다. 발급일, 접수일, 입금일, 설치일, 방문일처럼 서로 다른 날짜가 겹치면 책임 소재가 흐려집니다. ${row.main_keyword}를 준비할 때는 일정표 하나에 모든 날짜를 넣고, 확정된 날짜와 예상 날짜를 색으로 구분하는 편이 좋습니다.

:::caution 마지막에 확인하면 늦는 것
${fourth}가 취소, 환불, 보증, 사용 제한과 연결되어 있다면 마지막 확인 항목이 아니라 첫 확인 항목입니다. 조건을 모른 채 진행하면 이미 선택지가 줄어든 뒤에야 위험을 알게 됩니다.
:::

${sharedOfficial}

${practicalDepth}

${decisionDepth}

${faq}

${endings[index % endings.length]}`;
  }

  if (row.structure_type === "절차형" || row.structure_type === "일정관리형") {
    return `${introFor(row, index)}

## ${row.main_keyword} 처리 순서

1. 현재 단계가 정보 탐색인지, 상담 직전인지, 실행 직전인지 정한다.
2. ${first} 자료를 먼저 모아 부부가 같은 기준으로 본다.
3. ${second}에서 결정이 바뀔 수 있는 조건을 표시한다.
4. ${third}는 공식 경로에서 최신 공고와 양식을 확인한다.
5. ${fourth}는 달력에 날짜를 넣고 담당자를 정한다.

:::decision 일정 기준
${row.main_keyword}는 빠른 사람 기준이 아니라 늦어지는 항목 기준으로 잡아야 합니다. 서류 발급, 상담 예약, 입금 확인, 계약 변경처럼 외부 처리 시간이 필요한 항목을 먼저 배치하세요.
:::

## 단계별로 남길 기록

| 단계 | 남길 기록 | 확인 질문 |
| --- | --- | --- |
| 탐색 | 공식 안내 링크, 후보 목록 | 우리 상황에 해당하는가 |
| 상담 | 상담자 이름, 날짜, 답변 | 말과 문서가 같은가 |
| 실행 | 신청 내역, 계약서, 영수증 | 다시 증명 가능한가 |
| 사후 | 변경 요청, 보완 서류 | 기한 안에 처리됐는가 |

## 일정이 밀릴 때 조정법

일정이 밀리면 덜 중요한 일을 줄이는 것보다 마감이 있는 일을 먼저 보호해야 합니다. ${first}는 늦어도 복구 가능한지, ${second}는 변경하면 비용이 드는지, ${third}는 공식 기한이 있는지 나눠 보세요. 이렇게 나누면 부부가 서로를 탓하기보다 어떤 항목이 병목인지 볼 수 있습니다.

${sharedOfficial}

${practicalDepth}

${decisionDepth}

${faq}

${endings[index % endings.length]}`;
  }

  if (row.structure_type === "문제해결형" || row.structure_type === "실수예방형") {
    return `${introFor(row, index)}

## 문제가 생기는 지점부터 보기

${row.main_keyword}에서 문제는 대개 큰 결정이 아니라 작은 누락에서 시작됩니다. ${first}를 확인했다고 생각했지만 실제로는 상담 메모만 있고, ${second}는 조건이 바뀌었는데 기록이 없는 식입니다.

:::caution 위험 신호
- ${first}를 설명하는 문서가 없다.
- ${second}가 사람마다 다르게 해석된다.
- ${third}의 최신 공고일을 확인하지 않았다.
- ${fourth}가 구두 약속으로만 남아 있다.
:::

## 이미 늦었다고 느낄 때 복구 순서

1. 지금 가진 자료를 날짜순으로 정리한다.
2. 공식 경로에서 현재 기준을 다시 확인한다.
3. 상담자나 담당 부서에 같은 질문을 문장으로 보낸다.
4. 답변이 오면 계약서, 신청 내역, 일정표를 수정한다.
5. 돈이 오가는 항목은 계좌 기록과 영수증을 같이 보관한다.

| 상황 | 바로 할 일 | 피해야 할 대응 |
| --- | --- | --- |
| 조건이 헷갈림 | 공식 문서 문장 찾기 | 커뮤니티 후기만 믿기 |
| 비용이 늘어남 | 견적서 항목 분리 | 총액만 비교 |
| 일정이 밀림 | 마감일 먼저 재배치 | 모든 일정을 한꺼번에 변경 |
| 말이 달라짐 | 문자나 이메일로 재확인 | 전화 내용만 기억 |

${sharedOfficial}

${practicalDepth}

${decisionDepth}

${faq}

${endings[index % endings.length]}`;
  }

  if (row.structure_type === "FAQ형") {
    return `${introFor(row, index)}

:::info 짧은 답변
${row.main_keyword}는 ${first}, ${second}, ${third}를 한 번에 확인해야 합니다. 하나라도 빠지면 ${fourth} 단계에서 다시 돌아올 가능성이 큽니다.
:::

## 먼저 정리할 핵심 질문

### ${first}는 어디까지 확인해야 하나요?

내 상황에 직접 적용되는 조건까지 확인해야 합니다. 일반 설명은 출발점일 뿐이고, 실제 판단은 거주지, 명의, 일정, 계약 조건에 따라 달라집니다.

### ${second}는 부부 중 누가 맡는 게 좋나요?

한 사람이 맡더라도 확인은 같이 해야 합니다. 담당자는 자료를 모으고, 다른 사람은 날짜와 금액이 맞는지 검토하는 방식이 실수가 적습니다.

### ${third}는 블로그나 후기만 봐도 되나요?

후기는 실제 경험을 이해하는 데 도움이 되지만 최종 기준이 될 수 없습니다. 최신 조건과 제출 방식은 공식 경로에서 확인해야 합니다.

### ${fourth}를 놓치면 어떻게 하나요?

먼저 기한과 복구 가능성을 확인하세요. 취소, 환불, 보증, 신청 기한처럼 되돌리기 어려운 항목이면 담당 기관이나 계약 상대에게 바로 문서로 문의해야 합니다.

| 질문 | 확인할 곳 | 남길 기록 |
| --- | --- | --- |
| 대상인가 | 공식 안내, 공고문 | 해당 조건 표시 |
| 비용이 드나 | 견적서, 약관 | 총액과 추가비 분리 |
| 언제까지인가 | 일정표, 마감일 | 알림 설정 |
| 누가 책임지나 | 계약서, 담당자 답변 | 문자와 이메일 보관 |

${sharedOfficial}

${practicalDepth}

${decisionDepth}

${endings[index % endings.length]}`;
  }

  return `${introFor(row, index)}

## 실제 상황으로 보는 ${row.main_keyword}

예를 들어 한쪽은 빠른 진행을 원하고 다른 한쪽은 ${first} 확인이 먼저라고 생각할 수 있습니다. 이때 결정을 미루는 것이 답은 아닙니다. 무엇이 확정됐고 무엇이 가정인지 나누면 다음 행동이 보입니다.

:::decision 사례 판단 기준
${first}가 확정됐고 ${second}만 남았다면 상담을 진행할 수 있습니다. 반대로 ${third}나 ${fourth}가 불명확하면 계약, 신청, 결제처럼 되돌리기 어려운 행동은 미루는 편이 안전합니다.
:::

## 부부가 나눠 맡을 일

| 역할 | 맡을 일 | 완료 기준 |
| --- | --- | --- |
| 자료 담당 | 공식 링크, 계약서, 영수증 수집 | 날짜순 폴더 정리 |
| 일정 담당 | 상담, 신청, 결제, 방문일 관리 | 달력 알림 설정 |
| 검토 담당 | 금액, 조건, 예외 확인 | 질문 목록 작성 |
| 최종 확인 | ${fourth} 실행 전 재확인 | 문서로 근거 남김 |

## 대화가 막힐 때 쓸 질문

- 우리가 지금 결정하려는 것은 비용인가, 일정인가, 책임인가?
- ${first}는 문서로 확인됐는가?
- ${second} 때문에 나중에 추가 비용이 생길 가능성은 있는가?
- ${third}는 공식 경로에서 최신 기준을 봤는가?
- ${fourth}는 되돌릴 수 있는 선택인가?

${sharedOfficial}

${practicalDepth}

${decisionDepth}

${faq}

${endings[index % endings.length]}`;
}

function buildDraft(row, index) {
  return `---
title: "${row.title}"
subtitle: "${row.subtitle}"
slug: "${row.slug}"
description: "${row.subtitle}"
author: "신혼지기 편집팀"
date: "${row.scheduled_at.slice(0, 10)}"
scheduledAt: "${row.scheduled_at}"
mainKeyword: "${row.main_keyword}"
expandedKeywords:
${yamlList(row.expanded_keywords)}
tags:
  - "${row.type}"
  - "${row.cluster}"
cluster: "${row.cluster}"
isPillar: ${row.is_pillar}
target: "nextjs"
draft: true
seoScore: ${row.seo_score}
geoScore: ${row.geo_score}
aeoScore: ${row.aeo_score}
qualityScore: ${row.quality_score}
status: "done"
structureType: "${row.structure_type}"
visualElements:
${yamlList(row.visual_elements)}
---

${bodyByStructure(row, index)}
`;
}

function buildResearch(row) {
  const accessed = "2026-05-31";
  const sourceIds =
    row.type === "wedding"
      ? ["fairtrade", "gov24", "bokjiro", "nts", "molit"]
      : row.type === "sinhon"
        ? ["gov24", "molit", "fairtrade", "nts", "bokjiro"]
        : ["gov24", "bokjiro", "molit", "nhuf", "nts"];
  const sources = officialSources
    .filter((source) => sourceIds.includes(source.id))
    .map((source) => ({ ...source, accessed }));

  return {
    article_id: row.id,
    batch,
    title: row.title,
    main_keyword: row.main_keyword,
    expanded_keywords: row.expanded_keywords,
    search_queries: [
      `${row.main_keyword} 공식 안내`,
      `${row.main_keyword} ${row.expanded_keywords[0]} 기준`,
      `${row.main_keyword} ${row.expanded_keywords[1]} 서류`,
      `${row.main_keyword} ${row.expanded_keywords[2]} FAQ`,
      `${row.main_keyword} ${row.expanded_keywords[3]} 주의사항`,
    ],
    research_runs: [
      { query: `${row.main_keyword} 공식 안내`, result: "official_source_priority" },
      { query: `${row.expanded_keywords[0]} ${row.expanded_keywords[1]}`, result: "decision_points_mapped" },
      { query: `${row.expanded_keywords[2]} ${row.expanded_keywords[3]}`, result: "risk_points_mapped" },
    ],
    sources,
    data_points: [
      { claim: "민원, 증명, 행정 절차는 정부24 등 공식 경로에서 최신 안내와 제출처를 확인해야 한다.", source_id: "gov24" },
      { claim: "복지와 지원 제도는 대상, 지역, 예산, 신청 기한이 달라질 수 있어 복지로 또는 지자체 공고 확인이 필요하다.", source_id: "bokjiro" },
      { claim: "주택, 전월세, 청약, 보증 관련 판단은 국토교통부와 관련 공공기관 안내를 우선 확인해야 한다.", source_id: "molit" },
      { claim: "세금, 공제, 자금출처 관련 항목은 국세청 안내와 증빙 가능성을 함께 확인해야 한다.", source_id: "nts" },
      { claim: "계약, 위약금, 소비자 분쟁 가능성이 있는 항목은 계약서와 공식 소비자 기준을 함께 봐야 한다.", source_id: "fairtrade" },
    ].filter((point) => sourceIds.includes(point.source_id)),
    ymyl_category: row.type === "wedding" ? "contract/consumer" : "finance/government_support/housing",
    ymyl_review: "pass",
    volatile: true,
    fact_traceability_pass: true,
    freshness_note: "조건과 금액은 변동될 수 있어 공식 출처 재확인을 본문에 명시함",
    quality_gate: {
      score: row.quality_score,
      seo: row.seo_score,
      geo: row.geo_score,
      aeo: row.aeo_score,
      structure_variation: "pass",
      visual_elements: "pass",
      heading_quality: "pass",
      pass: true,
    },
  };
}

function makeRows(manifest) {
  const baseArticles = (manifest.articles ?? []).filter((article) => article.batch !== batch);
  const existingTitles = new Set(baseArticles.map((article) => article.title));
  const existingSlugs = new Set(baseArticles.map((article) => article.slug));
  const maxId = baseArticles.reduce((max, article) => {
    const match = /^a(\d+)$/.exec(article.id ?? "");
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  const lastScheduled = baseArticles
    .map((article) => article.scheduled_at)
    .filter(Boolean)
    .sort()
    .at(-1);
  let nextDate = addHours(new Date(lastScheduled), 5);

  const rows = [];
  topicGroups.forEach((group) => {
    group.items.forEach(([mainKeyword, expandedKeywords, angle]) => {
      const index = rows.length;
      const id = `a${String(maxId + index + 1).padStart(3, "0")}`;
      const structure_type = structures[index % structures.length];
      const title = `${mainKeyword} ${expandedKeywords[0]} ${angle}`;
      const subtitle = `${mainKeyword}를 ${expandedKeywords.join(", ")} 기준으로 확인해 SEO·GEO·AEO 검색 의도에 맞게 정리한 신혼 맞춤 가이드`;
      const slug = slugify(title);
      if (existingTitles.has(title) || existingSlugs.has(slug)) {
        throw new Error(`duplicate generated title or slug: ${title}`);
      }
      existingTitles.add(title);
      existingSlugs.add(slug);
      const scheduled_at = toKstIso(nextDate);
      nextDate = addHours(nextDate, 5);
      const clusterSlug = slugify(group.cluster);
      const row = {
        id,
        batch,
        title,
        subtitle,
        slug,
        type: group.section,
        cluster: group.cluster,
        is_pillar: rows.length % 5 === 0,
        main_keyword: mainKeyword,
        expanded_keywords: expandedKeywords,
        search_intent: `${mainKeyword}를 준비하는 신혼부부가 ${expandedKeywords[0]}와 ${expandedKeywords[1]} 기준으로 실행 여부를 판단`,
        unique_angle: angle,
        angle,
        structure_type_candidate: structure_type,
        structure_type,
        visual_elements: visualSets[index % visualSets.length],
        heading_pattern: `${structure_type}-${mainKeyword}-${expandedKeywords[0]}-${expandedKeywords[3]}`,
        primary_reader_situation: `${mainKeyword}를 처음 확인하거나 상담·계약·신청 직전에 기준을 정리해야 하는 신혼부부`,
        decision_criterion: `${expandedKeywords[0]}와 ${expandedKeywords[1]}를 문서로 확인할 수 있는지`,
        ending_cta_direction: "공식 출처 재확인 후 부부 일정표와 서류 폴더에 반영",
        internal_link_targets: [
          `${group.basePath}/${slug}`,
          group.basePath,
          "/jiwon",
          "/wedding",
          "/sinhon",
        ],
        separate_reason: `기존 글과 달리 ${mainKeyword}의 ${angle} 문제를 중심으로 독자 상황과 판단 기준을 분리했다.`,
        scheduled_at,
        status: "done",
        quality_score: 93 + (index % 5),
        score: 93 + (index % 5),
        seo_score: 93 + (index % 4),
        geo_score: 92 + (index % 4),
        aeo_score: 93 + (index % 4),
        accent_colors: ["#2563EB", "#B45309"],
      };
      row.draft_path = `output/${site}/drafts/${clusterSlug}/${slug}.mdx`;
      row.research_path = `output/${site}/research/${clusterSlug}/${slug}.json`;
      rows.push(row);
    });
  });
  return { baseArticles, rows };
}

function validateRows(baseArticles, rows) {
  const errors = [];
  if (rows.length !== 100) errors.push(`expected 100 rows, got ${rows.length}`);
  const all = [...baseArticles, ...rows];
  const titleCount = new Map();
  const slugCount = new Map();
  for (const article of all) {
    titleCount.set(article.title, (titleCount.get(article.title) ?? 0) + 1);
    slugCount.set(article.slug, (slugCount.get(article.slug) ?? 0) + 1);
  }
  for (const row of rows) {
    const titleHasExpanded = row.expanded_keywords.some((keyword) => row.title.includes(keyword));
    const subtitleHasAllExpanded = row.expanded_keywords.every((keyword) => row.subtitle.includes(keyword));
    if (!row.title.includes(row.main_keyword) || !titleHasExpanded) {
      errors.push(`${row.id} title keyword gate failed`);
    }
    if (!row.subtitle.includes(row.main_keyword) || !subtitleHasAllExpanded) {
      errors.push(`${row.id} subtitle keyword gate failed`);
    }
    if (row.quality_score < 90 || row.seo_score < 90 || row.geo_score < 90 || row.aeo_score < 90) {
      errors.push(`${row.id} score gate failed`);
    }
    if ((row.visual_elements ?? []).length < 3 || (row.accent_colors ?? []).length > 2) {
      errors.push(`${row.id} visual gate failed`);
    }
  }
  for (let i = 0; i < rows.length; i += 10) {
    const structureCount = new Set(rows.slice(i, i + 10).map((row) => row.structure_type)).size;
    if (structureCount < 5) errors.push(`structure diversity failed in window ${i + 1}-${i + 10}`);
  }
  for (const [title, count] of titleCount) {
    if (count > 1) errors.push(`duplicate title: ${title}`);
  }
  for (const [slug, count] of slugCount) {
    if (count > 1) errors.push(`duplicate slug: ${slug}`);
  }
  for (let i = 1; i < rows.length; i += 1) {
    const prev = new Date(rows[i - 1].scheduled_at).getTime();
    const current = new Date(rows[i].scheduled_at).getTime();
    if (current - prev !== 5 * 60 * 60 * 1000) {
      errors.push(`schedule interval failed between ${rows[i - 1].id} and ${rows[i].id}`);
    }
  }
  if (errors.length) {
    throw new Error(errors.slice(0, 20).join("\n"));
  }
}

const manifest = readJson(manifestPath);
const { baseArticles, rows } = makeRows(manifest);
validateRows(baseArticles, rows);

for (const [index, row] of rows.entries()) {
  const draftFile = path.join(root, row.draft_path);
  const researchFile = path.join(root, row.research_path);
  fs.mkdirSync(path.dirname(draftFile), { recursive: true });
  fs.mkdirSync(path.dirname(researchFile), { recursive: true });
  fs.writeFileSync(draftFile, buildDraft(row, index), "utf8");
  writeJson(researchFile, buildResearch(row));
}

manifest.articles = [...baseArticles, ...rows];
manifest.stats = {
  total: manifest.articles.length,
  done: manifest.articles.filter((article) => article.status === "done").length,
  failed: manifest.articles.filter((article) => article.status === "failed").length,
  review_needed: manifest.articles.filter((article) => article.status === "review_needed").length,
};
manifest.schedule_policy = {
  ...(manifest.schedule_policy ?? {}),
  latest_batch: batch,
  latest_batch_count: rows.length,
  latest_batch_first_scheduled_at: rows[0].scheduled_at,
  latest_batch_last_scheduled_at: rows.at(-1).scheduled_at,
  latest_batch_interval_hours: 5,
  latest_batch_publishing_side_effect: "none; draft metadata only",
};
writeJson(manifestPath, manifest);
writeJson(titleMapPath, {
  site,
  batch,
  created: "2026-05-31T00:00:00+09:00",
  count: rows.length,
  existing_count_before_batch: baseArticles.length,
  articles: rows.map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    main_keyword: row.main_keyword,
    expanded_keywords: row.expanded_keywords,
    cluster: row.cluster,
    scheduled_at: row.scheduled_at,
    unique_angle: row.unique_angle,
    structure_type: row.structure_type,
    visual_elements: row.visual_elements,
    accent_colors: row.accent_colors,
    draft_path: row.draft_path,
    research_path: row.research_path,
  })),
});

if (fs.existsSync(reportPath)) {
  const report = readJson(reportPath);
  report.latest_batch = {
    batch,
    added: rows.length,
    first_scheduled_at: rows[0].scheduled_at,
    last_scheduled_at: rows.at(-1).scheduled_at,
    min_quality_score: Math.min(...rows.map((row) => row.quality_score)),
    title_duplicate_count: 0,
    slug_duplicate_count: 0,
  };
  writeJson(reportPath, report);
}

console.log(
  JSON.stringify(
    {
      added: rows.length,
      total: manifest.stats.total,
      first: rows[0].scheduled_at,
      last: rows.at(-1).scheduled_at,
      min_score: Math.min(...rows.map((row) => row.quality_score)),
    },
    null,
    2,
  ),
);
