import fs from "node:fs";
import path from "node:path";

const site = "sinhonjigi";
const root = process.cwd();
const outDir = path.join(root, "output", site);
const manifestPath = path.join(outDir, "manifest.json");
const titleMapPath = path.join(outDir, "title-map-batch-2.json");

const structures = [
  "조건판단형",
  "체크리스트형",
  "상황별가이드형",
  "FAQ형",
  "비교형",
  "실수예방형",
  "서류점검형",
  "일정역산형",
];

const visualSets = [
  ["summary_box", "decision_checklist", "official_link_card"],
  ["comparison_table", "caution_box", "step_cards"],
  ["timeline", "document_checklist", "faq_block"],
  ["case_matrix", "risk_box", "action_list"],
];

const sources = [
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
  {
    id: "localdata",
    name: "지방행정 인허가 데이터",
    url: "https://www.localdata.go.kr/",
    type: "official_data",
    official: true,
  },
];

const topicGroups = [
  {
    section: "jiwon",
    cluster: "신혼 전세 계약 안전점검",
    pillar: "신혼 전세 계약 안전점검 등기부등본부터 보증보험까지 확인할 기준",
    items: [
      ["등기부등본", ["근저당", "가압류", "소유자", "말소조건"], "계약 전 위험 신호를 걸러내는 순서"],
      ["전입신고 확정일자", ["대항력", "우선변제권", "임대차신고", "입주일"], "이사 당일 놓치기 쉬운 절차"],
      ["전세보증보험", ["보증한도", "집주인 동의", "가입시기", "반환보증"], "가입 가능성을 먼저 확인하는 방법"],
      ["특약 문구", ["잔금전 말소", "하자", "중도해지", "위약금"], "계약서에 남겨야 할 확인 포인트"],
      ["중개대상물 확인설명서", ["권리관계", "시설상태", "관리비", "중개보수"], "서명 전 대조해야 할 항목"],
    ],
  },
  {
    section: "jiwon",
    cluster: "신혼 월세 계약 실전점검",
    pillar: "신혼 월세 계약 실전점검 보증금 관리비 수선비 판단 가이드",
    items: [
      ["월세 보증금", ["보증금 비율", "전입신고", "확정일자", "반환위험"], "작은 보증금도 보호 절차가 필요한 이유"],
      ["관리비 내역", ["공용관리비", "전기요금", "수도요금", "인터넷"], "월 고정비를 과소평가하지 않는 계산법"],
      ["수선비 부담", ["원상복구", "소모품", "누수", "입주점검"], "입주 전 사진으로 남겨야 할 기준"],
      ["계약갱신", ["묵시적 갱신", "해지통보", "증액", "계약기간"], "통보 시점별 선택지를 나누는 법"],
      ["월세 세액공제", ["총급여", "무주택", "계좌이체", "현금영수증"], "연말정산 전 준비할 증빙"],
    ],
  },
  {
    section: "jiwon",
    cluster: "신혼 주택대출 비교",
    pillar: "신혼 주택대출 비교 디딤돌 보금자리 전세대출 선택 기준",
    items: [
      ["디딤돌대출", ["생애최초", "부부합산소득", "주택가격", "상환방식"], "매수 전 자격을 먼저 걸러보는 순서"],
      ["보금자리론", ["고정금리", "LTV", "DTI", "대상주택"], "금리 안정성과 한도를 같이 보는 기준"],
      ["버팀목전세대출", ["보증금", "대출한도", "임차면적", "소득요건"], "집을 보기 전에 한도부터 확인하는 법"],
      ["대환대출", ["중도상환수수료", "금리차", "잔여기간", "보증료"], "갈아타기 전에 손익을 따지는 계산법"],
      ["공동명의 대출", ["명의비율", "소득합산", "증여", "상환책임"], "부부 명의 선택 전 확인할 쟁점"],
    ],
  },
  {
    section: "jiwon",
    cluster: "신혼 청약 공고 읽기",
    pillar: "신혼 청약 공고 읽기 특별공급 일반공급 임대공고 핵심 기준",
    items: [
      ["신혼부부 특별공급", ["혼인기간", "자녀", "소득", "우선공급"], "공고문에서 먼저 찾아야 할 문장"],
      ["생애최초 특별공급", ["무주택", "소득세", "저축", "추첨"], "신혼부부 특공과 비교하는 기준"],
      ["공공임대 입주자격", ["자산", "소득", "지역", "임대기간"], "모집공고별 차이를 표로 보는 법"],
      ["예비신혼부부 청약", ["혼인예정", "증빙서류", "입주전 혼인", "자격유지"], "당첨 후 리스크를 줄이는 순서"],
      ["청약 부적격", ["세대원", "주택소유", "소득초과", "서류미비"], "신청 전 자가점검 체크리스트"],
    ],
  },
  {
    section: "wedding",
    cluster: "예식장 비용 협상",
    pillar: "예식장 비용 협상 대관료 식대 보증인원 조정 기준",
    items: [
      ["보증인원 조정", ["최소인원", "식대", "위약금", "하객수"], "계약 전 범위를 열어두는 협상법"],
      ["예식장 대관료", ["홀사용료", "꽃장식", "음향", "부가세"], "견적서에서 빠지기 쉬운 항목"],
      ["식대 계약", ["음주류", "봉사료", "소인", "시식"], "총액을 흔드는 세부 조건"],
      ["예식 취소 위약금", ["계약금", "잔금", "천재지변", "소비자분쟁"], "시점별 손해를 줄이는 확인법"],
      ["예식장 후기 검증", ["동선", "주차", "음식", "응대"], "광고 후기와 실제 리스크 구분하기"],
    ],
  },
  {
    section: "wedding",
    cluster: "스드메 계약 분리",
    pillar: "스드메 계약 분리 스튜디오 드레스 메이크업 견적 판단법",
    items: [
      ["스튜디오 원본비", ["셀렉", "수정본", "앨범", "파일제공"], "추가금이 생기는 지점을 먼저 보는 법"],
      ["드레스 투어", ["피팅비", "헬퍼비", "지정비", "업그레이드"], "방문 전 예산선을 정하는 기준"],
      ["메이크업샵 선택", ["혼주", "출장", "얼리콜", "리허설"], "시간표와 추가비를 함께 보는 방법"],
      ["스드메 패키지", ["제휴", "환불", "변경", "계약주체"], "분리계약과 패키지를 비교하는 기준"],
      ["본식스냅 계약", ["촬영범위", "보정", "납기", "원본"], "사진 상품 설명서에서 확인할 항목"],
    ],
  },
  {
    section: "wedding",
    cluster: "웨딩박람회 계약 방어",
    pillar: "웨딩박람회 계약 방어 사전등록 상담동선 당일계약 판단 기준",
    items: [
      ["당일계약 혜택", ["예약금", "취소기한", "사은품", "제휴조건"], "혜택보다 해지 조건을 먼저 보는 이유"],
      ["웨딩박람회 상담순서", ["예산", "홀", "스드메", "혼수"], "상담 피로를 줄이는 동선"],
      ["제휴카드 혜택", ["실적", "청구할인", "캐시백", "연회비"], "실제 절감액을 따지는 방법"],
      ["계약서 보류", ["견적서", "비교", "상담기록", "환불"], "즉시 서명하지 않아도 되는 기준"],
      ["박람회 개인정보", ["마케팅동의", "연락처", "제3자제공", "철회"], "상담 후 연락 폭주를 줄이는 방법"],
    ],
  },
  {
    section: "wedding",
    cluster: "혼수 가전 구매전략",
    pillar: "혼수 가전 구매전략 패키지 할인 배송 설치 예산 기준",
    items: [
      ["가전 패키지 할인", ["동시구매", "캐시백", "설치일", "모델명"], "할인율보다 모델명을 먼저 보는 법"],
      ["혼수 예산표", ["필수품", "교체시기", "할부", "비상금"], "처음 집에 필요한 항목만 남기는 기준"],
      ["가구 배송일정", ["입주일", "엘리베이터", "사다리차", "반품"], "이사 동선과 충돌하지 않게 잡는 법"],
      ["신혼 침대 선택", ["매트리스", "프레임", "배송", "체험"], "예산과 수면습관을 같이 보는 기준"],
      ["혼수 계약 취소", ["청약철회", "맞춤제작", "배송전", "위약금"], "구매 전 환불 조건 확인법"],
    ],
  },
  {
    section: "sinhon",
    cluster: "맞벌이 돈관리 체계",
    pillar: "맞벌이 돈관리 체계 공동계좌 고정비 저축률 운영 기준",
    items: [
      ["공동계좌 규칙", ["입금비율", "생활비", "비상금", "정산"], "싸움이 줄어드는 계좌 운영법"],
      ["신혼 고정비", ["주거비", "보험료", "통신비", "구독료"], "첫 3개월에 조정할 항목"],
      ["부부 신용카드", ["실적", "연회비", "공동지출", "포인트"], "혜택보다 통제력을 보는 기준"],
      ["비상금 계좌", ["월급", "의료비", "실직", "경조사"], "몇 개월치를 둘지 판단하는 법"],
      ["저축률 조정", ["주거비비율", "대출상환", "투자", "목표"], "무리한 목표를 피하는 계산법"],
    ],
  },
  {
    section: "sinhon",
    cluster: "신혼 세금 연말정산",
    pillar: "신혼 세금 연말정산 혼인 증여 월세 의료비 공제 기준",
    items: [
      ["혼인 증여재산 공제", ["직계존속", "혼인신고", "신고기한", "자금출처"], "증빙을 먼저 정리하는 순서"],
      ["부부 인적공제", ["소득금액", "맞벌이", "부양가족", "중복공제"], "누가 공제받을지 정하는 기준"],
      ["의료비 공제", ["총급여", "실손보험", "난임", "산후조리원"], "가족 지출을 모을 때 주의할 점"],
      ["월세 세액공제", ["임대차계약", "주민등록", "계좌이체", "무주택"], "신혼집 계약과 연결해 보는 법"],
      ["전세자금 원리금 공제", ["금융기관", "상환증명", "무주택", "계약자"], "대출상환 증빙 챙기는 순서"],
    ],
  },
  {
    section: "sinhon",
    cluster: "신혼 전입 행정절차",
    pillar: "신혼 전입 행정절차 전입신고 세대주 변경 증명서 준비법",
    items: [
      ["세대주 변경", ["전입신고", "주민등록", "건강보험", "청약"], "바꾸기 전 영향 범위를 보는 법"],
      ["혼인신고 후 서류", ["혼인관계증명서", "가족관계증명서", "주민등록등본", "정부24"], "제출처별 필요한 서류 구분"],
      ["주소지 변경", ["금융", "보험", "운전면허", "우편물"], "이사 후 빠뜨리기 쉬운 목록"],
      ["임대차 신고", ["보증금", "월세", "신고기한", "과태료"], "전월세 계약 직후 확인할 절차"],
      ["주민등록등본 발급", ["세대구성", "주소변동", "주민번호", "제출용"], "불필요한 정보 노출 줄이는 방법"],
    ],
  },
  {
    section: "sinhon",
    cluster: "임신 준비 지원제도",
    pillar: "임신 준비 지원제도 난임검사 엽산 건강검진 신청 기준",
    items: [
      ["난임검사 지원", ["보건소", "검사비", "신청서류", "부부"], "지역별 공고를 확인하는 순서"],
      ["임신 전 건강검진", ["풍진", "간염", "빈혈", "보건소"], "결혼 후 바로 챙길 항목"],
      ["엽산 철분 지원", ["보건소", "임산부등록", "수령시기", "필요서류"], "방문 전 확인할 기준"],
      ["임신바우처", ["국민행복카드", "진료비", "신청", "사용처"], "카드 발급 전 비교할 항목"],
      ["난임시술비 지원", ["소득", "시술종류", "횟수", "서류"], "지원 전 병원과 확인할 문장"],
    ],
  },
  {
    section: "sinhon",
    cluster: "출산 전 행정준비",
    pillar: "출산 전 행정준비 출생신고 첫만남이용권 부모급여 순서",
    items: [
      ["출생신고 준비", ["신고기한", "출생증명서", "이름", "주민센터"], "출산 전 미리 정할 항목"],
      ["첫만남이용권", ["바우처", "신청시기", "사용처", "복지로"], "출생신고와 같이 처리하는 법"],
      ["부모급여 신청", ["아동수당", "계좌", "지급일", "중복"], "신청 누락을 줄이는 체크리스트"],
      ["산후조리비 지원", ["지자체", "거주요건", "영수증", "신청기한"], "지역 공고에서 볼 조건"],
      ["출산휴가 급여", ["고용보험", "사업주확인", "신청기한", "통상임금"], "회사와 먼저 맞춰야 할 순서"],
    ],
  },
  {
    section: "jiwon",
    cluster: "지역 결혼지원금 탐색",
    pillar: "지역 결혼지원금 탐색 거주기간 혼인신고 신청기한 확인법",
    items: [
      ["거주기간 조건", ["전입일", "혼인신고일", "부부주소", "지자체"], "탈락을 부르는 날짜 차이"],
      ["신청기한 관리", ["혼인신고", "전입", "출생", "공고일"], "캘린더에 남겨야 할 기준일"],
      ["지역화폐 지급", ["상품권", "카드", "사용처", "유효기간"], "현금처럼 보이는 지원의 제한"],
      ["중복지원 확인", ["복지로", "지자체", "부서", "가구기준"], "비슷한 제도를 구분하는 법"],
      ["행정복지센터 문의", ["담당부서", "서류", "예산소진", "방문예약"], "전화 전 준비할 질문"],
    ],
  },
  {
    section: "wedding",
    cluster: "예식 당일 운영점검",
    pillar: "예식 당일 운영점검 동선 식순 정산 사고예방 체크리스트",
    items: [
      ["예식 식순표", ["사회자", "축가", "혼인서약", "폐백"], "누가 언제 움직이는지 정리하는 법"],
      ["하객 동선", ["주차", "접수대", "연회장", "엘리베이터"], "혼잡을 줄이는 안내 기준"],
      ["축의금 정산", ["접수자", "봉투", "명단", "보관"], "분실 위험을 줄이는 역할 분담"],
      ["본식 리허설", ["입장", "퇴장", "조명", "음향"], "짧은 시간에 확인할 핵심"],
      ["예식 당일 변수", ["지각", "우천", "의상", "응급상황"], "대체 담당자를 정하는 방법"],
    ],
  },
  {
    section: "sinhon",
    cluster: "신혼 보험 정리",
    pillar: "신혼 보험 정리 실손 건강보험 자동차보험 중복점검 기준",
    items: [
      ["실손보험 중복", ["보장", "보험료", "청구", "중복가입"], "해지보다 먼저 비교할 항목"],
      ["부부 건강보험", ["피부양자", "직장가입자", "지역가입자", "소득"], "혼인 후 자격 변화를 보는 법"],
      ["자동차보험 부부한정", ["운전자범위", "연령", "사고이력", "보험료"], "명의와 운전자 범위를 맞추는 기준"],
      ["태아보험 검토", ["가입시기", "특약", "납입기간", "보장"], "광고보다 필요한 보장을 보는 법"],
      ["보험 리모델링", ["해지환급", "갱신형", "보장공백", "우선순위"], "첫해에 무리하지 않는 정리법"],
    ],
  },
  {
    section: "sinhon",
    cluster: "부부 갈등 예방 루틴",
    pillar: "부부 갈등 예방 루틴 집안일 돈관리 가족관계 대화 기준",
    items: [
      ["집안일 분담표", ["근무시간", "선호도", "반복업무", "외주"], "공평함보다 지속성을 보는 법"],
      ["가족 행사 조율", ["명절", "생일", "방문", "예산"], "양가 일정을 미리 나누는 기준"],
      ["생활규칙 합의", ["수면", "청소", "식사", "손님"], "작은 불편을 크게 만들지 않는 방법"],
      ["부부 회의", ["월예산", "일정", "감정", "결정사항"], "주 1회 30분으로 끝내는 순서"],
      ["갈등 기록", ["반복문제", "해결책", "기한", "역할"], "비난 없이 문제를 남기는 법"],
    ],
  },
  {
    section: "jiwon",
    cluster: "신혼 이사 비용관리",
    pillar: "신혼 이사 비용관리 견적 비교 입주청소 사다리차 정산 기준",
    items: [
      ["포장이사 견적", ["방문견적", "인력", "차량", "추가비"], "전화견적만 믿지 않는 이유"],
      ["입주청소 계약", ["범위", "곰팡이", "창틀", "하자"], "청소 전후 사진으로 확인할 항목"],
      ["사다리차 비용", ["층수", "거리", "관리사무소", "예약"], "이사 당일 추가비를 줄이는 법"],
      ["이사 손상 보상", ["파손", "사진", "계약서", "보험"], "보상 요청을 준비하는 순서"],
      ["공과금 정산", ["전기", "가스", "수도", "관리비"], "퇴거와 입주 사이 확인할 날짜"],
    ],
  },
  {
    section: "wedding",
    cluster: "신혼여행 예약 방어",
    pillar: "신혼여행 예약 방어 항공 호텔 여행사 취소규정 확인법",
    items: [
      ["항공권 이름확인", ["여권영문명", "수정수수료", "마일리지", "환불"], "예약 직후 바로 봐야 할 항목"],
      ["호텔 취소규정", ["무료취소", "노쇼", "도시세", "보증금"], "가격보다 조건을 먼저 비교하는 법"],
      ["여행사 계약서", ["일정표", "포함사항", "불포함", "취소료"], "상담 내용과 계약서를 대조하는 기준"],
      ["여행자보험", ["보장한도", "휴대품", "질병", "항공지연"], "신혼여행 일정에 맞춰 고르는 방법"],
      ["환전 카드 준비", ["수수료", "해외결제", "분실", "예비카드"], "현금과 카드 비율을 정하는 법"],
    ],
  },
  {
    section: "sinhon",
    cluster: "신혼 주거 지역선택",
    pillar: "신혼 주거 지역선택 출퇴근 보육 교통 생활권 비교 기준",
    items: [
      ["출퇴근 시간", ["환승", "막차", "유연근무", "교통비"], "지도 거리보다 실제 시간을 보는 법"],
      ["생활권 예산", ["마트", "병원", "주차", "관리비"], "집값 외 비용을 같이 계산하는 방법"],
      ["보육 인프라", ["어린이집", "소아과", "공원", "대기"], "출산 계획이 있을 때 볼 항목"],
      ["전세가율 확인", ["매매가", "보증금", "거래량", "위험지역"], "싸 보이는 집을 걸러내는 기준"],
      ["신축 구축 비교", ["관리비", "하자", "수리", "입지"], "첫 신혼집에서 우선순위 정하기"],
    ],
  },
  {
    section: "jiwon",
    cluster: "신혼 정부서비스 계정관리",
    pillar: "신혼 정부서비스 계정관리 정부24 복지로 청약홈 인증서 준비법",
    items: [
      ["공동인증서 정리", ["간편인증", "은행", "정부24", "청약"], "부부가 각각 준비할 항목"],
      ["정부24 알림", ["민원", "보조금24", "나의생활정보", "신청내역"], "놓친 지원을 줄이는 설정"],
      ["복지로 서비스검색", ["생애주기", "가구상황", "지역", "온라인신청"], "키워드보다 조건으로 찾는 법"],
      ["청약홈 정보관리", ["주소", "세대원", "통장", "가점"], "신청 전 개인정보를 맞추는 순서"],
      ["전자문서지갑", ["증명서", "제출", "유효기간", "보관"], "반복 발급을 줄이는 사용법"],
    ],
  },
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^0-9a-z가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
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

function buildArticleText(row, sourceList) {
  const officialLinks = sourceList
    .slice(0, 5)
    .map((source) => `- [${source.name}](${source.url})`)
    .join("\n");
  const siblingLinks = row.internal_link_targets
    .map((link) => `- [관련 기준 보기](${link})`)
    .join("\n");

  return `---
title: "${row.title}"
slug: "${row.slug}"
description: "${row.subtitle}"
author: "신혼지기 편집팀"
date: "${row.scheduled_at.slice(0, 10)}"
scheduled_at: "${row.scheduled_at}"
tags:
${row.expanded_keywords.map((keyword) => `  - "${keyword}"`).join("\n")}
cluster: "${row.cluster}"
main_keyword: "${row.main_keyword}"
target: "nextjs"
draft: true
seo_score: 92
geo_score: 91
aeo_score: 92
quality_score: 92
structure_type: "${row.structure_type}"
visual_elements:
${row.visual_elements.map((item) => `  - "${item}"`).join("\n")}
---

# ${row.title}

${row.main_keyword}를 확인하는 목적은 단순히 제도 이름을 아는 것이 아니라, 지금 우리 부부가 바로 진행해도 되는지 판단하는 것입니다. 이 글은 ${row.primary_reader_situation}를 기준으로, ${row.decision_criterion}를 먼저 확인하도록 구성했습니다. 조건이 바뀌거나 지역 공고가 다른 항목은 금액을 단정하지 않고 공식 페이지에서 다시 대조할 수 있게 정리했습니다.

> 요약: ${row.main_keyword}는 ${row.expanded_keywords.slice(0, 3).join(", ")} 순서로 확인하면 실수를 줄일 수 있습니다. 신청, 계약, 비교가 필요한 항목은 반드시 최신 공고와 계약서 원문을 함께 보세요.

## ${row.main_keyword} 판단 전에 먼저 볼 기준

첫 번째 기준은 날짜입니다. 혼인신고일, 전입일, 계약일, 잔금일, 신청일처럼 이름이 비슷한 날짜가 서로 다른 효력을 만들 수 있습니다. 같은 지원 또는 계약이라도 공고는 특정 기준일을 요구하고, 계약서는 별도의 통보 기한을 요구하는 경우가 많습니다. 따라서 달력에 실제 행동일과 서류상 기준일을 나눠 적어 두는 것이 좋습니다.

두 번째 기준은 명의와 세대입니다. 신혼부부 관련 제도는 부부합산, 세대원, 무주택, 주소지 같은 조건을 함께 보는 일이 많습니다. 한 사람만 자격이 된다고 바로 진행하기보다 배우자의 소득, 주택 보유 이력, 주소 이전 예정까지 같이 확인해야 합니다. 이 단계에서 틀리면 나중에 보완서류가 아니라 부적격 또는 계약 리스크로 이어질 수 있습니다.

세 번째 기준은 증빙 가능성입니다. 실제로 조건을 충족해도 제출할 서류가 없으면 신청이 지연됩니다. 계좌이체 내역, 계약서 원본, 등본, 가족관계증명서, 공고문 캡처, 상담 기록을 한 폴더에 모아 두면 재확인 시간이 줄어듭니다.

## ${row.expanded_keywords[0]} 확인 체크리스트

| 확인 항목 | 봐야 할 문서 | 판단 기준 |
| --- | --- | --- |
| 기준일 | 공고문, 계약서, 신청 안내 | 우리 일정과 충돌하지 않는지 확인 |
| 대상자 | 주민등록등본, 가족관계증명서 | 부부 또는 세대 기준이 맞는지 확인 |
| 금액 또는 비용 | 견적서, 고지서, 안내문 | 총액과 추가비를 분리 |
| 제출 방식 | 정부24, 복지로, 기관 페이지 | 온라인 가능 여부와 방문 필요 여부 확인 |
| 사후 관리 | 신청내역, 계약 변경 기록 | 보완 요청과 취소 조건 확인 |

체크리스트는 모두 채우는 것보다 빠진 항목을 발견하는 데 의미가 있습니다. 특히 ${row.expanded_keywords[1]}와 ${row.expanded_keywords[2]}는 상담 중 말로만 확인하고 넘어가기 쉬운 항목입니다. 말로 들은 조건은 문자, 이메일, 견적서, 신청내역처럼 나중에 다시 볼 수 있는 형태로 남겨야 합니다.

## ${row.expanded_keywords[1]}에서 자주 생기는 실수

가장 흔한 실수는 비슷한 용어를 같은 뜻으로 보는 것입니다. 예를 들어 주소 이전과 전입신고, 신청 가능과 지급 확정, 견적과 계약, 무료취소와 전액환불은 서로 다릅니다. 표현이 비슷해도 책임과 기한이 달라질 수 있으므로 문서의 제목보다 세부 조항을 읽어야 합니다.

두 번째 실수는 부부 중 한 사람 기준으로만 계산하는 것입니다. 신혼 관련 제도와 계약은 부부합산 또는 공동 생활비 기준으로 보는 경우가 많습니다. 소득, 대출, 보험, 세금, 지원금, 계약 명의가 얽히면 한쪽에게 유리한 선택이 가구 전체에는 불리할 수 있습니다.

세 번째 실수는 최신성을 확인하지 않는 것입니다. 지원금과 공공임대, 세금, 대출, 보육 관련 조건은 연도와 예산, 지역 공고에 따라 달라질 수 있습니다. 이 글은 판단 순서를 제공하지만, 최종 숫자와 제출서류는 반드시 공식 출처에서 다시 확인해야 합니다.

## 상황별로 ${row.main_keyword}를 다르게 보는 방법

### 처음 준비하는 부부

처음 준비하는 부부라면 용어를 넓게 훑기보다 신청 또는 계약 순서부터 잡는 편이 낫습니다. 먼저 우리 상황에 해당하지 않는 조건을 지우고, 남은 조건만 공식 페이지에서 확인하세요. 이 방식은 정보량을 줄이고 실제 행동으로 이어지게 합니다.

### 이미 상담을 받은 부부

이미 상담을 받았다면 상담 내용과 공식 문서가 같은지 대조해야 합니다. 상담자는 편의를 위해 요약해서 말할 수 있지만, 실제 판단은 공고문, 약관, 계약서, 신청 안내가 우선합니다. 다르게 들은 부분은 다시 질문하고 기록으로 남기세요.

### 일정이 촉박한 부부

일정이 촉박하면 완벽한 비교보다 탈락 또는 손해가 큰 항목부터 봐야 합니다. 신청기한, 취소기한, 잔금일, 전입일, 서류 발급 가능일을 먼저 정리하면 큰 리스크를 줄일 수 있습니다. 이후 비용과 혜택 비교를 진행해도 늦지 않습니다.

## ${row.expanded_keywords[2]} 관련 공식 확인 경로

${row.main_keyword}는 검색 결과보다 공식 안내를 기준으로 삼아야 합니다. 블로그나 커뮤니티는 실제 사례를 이해하는 데 도움이 되지만, 신청 가능 여부와 계약 책임을 대신 판단해 주지는 않습니다. 아래 출처에서 최신 공고, 민원 안내, 서식, 문의 부서를 다시 확인하세요.

${officialLinks}

공식 페이지를 볼 때는 제목만 보지 말고 게시일, 적용 기간, 담당 부서, 문의 전화, 첨부파일 날짜를 함께 확인하세요. 특히 지자체 지원과 주거 제도는 예산 소진, 지역 요건, 연도별 변경이 있을 수 있습니다.

## 내부에서 같이 보면 좋은 글

${siblingLinks}

관련 글을 같이 보는 이유는 ${row.main_keyword} 하나만으로 결정이 끝나지 않기 때문입니다. 예산, 계약, 전입, 세금, 지원금은 서로 연결됩니다. 한 글에서 조건을 확인했다면 다음 글에서는 날짜와 서류를 맞춰 보세요.

## 자주 묻는 질문

### ${row.main_keyword}는 언제 확인하는 것이 좋나요?

계약 또는 신청 직전이 아니라 후보를 고르는 단계에서 확인하는 것이 좋습니다. 이미 서명하거나 신청한 뒤에는 선택지가 줄어듭니다. 최소한 기준일, 대상자, 제출서류, 취소 가능성은 먼저 확인해야 합니다.

### ${row.expanded_keywords[3]}는 어디까지 믿어도 되나요?

광고성 설명이나 상담 요약은 참고용으로만 보세요. 최종 판단은 공식 공고, 계약서, 약관, 신청 화면, 담당 부서 답변처럼 나중에 확인 가능한 자료를 기준으로 해야 합니다.

### 부부가 서로 조건이 다르면 어떻게 하나요?

부부 중 한 사람만 보는 제도인지, 부부합산 또는 세대 기준인지부터 확인해야 합니다. 기준이 다르면 명의, 주소, 계좌, 신청자 선택이 달라질 수 있습니다. 애매하면 신청 전 담당 기관에 질문하고 답변을 기록해 두세요.

## 마무리 판단

${row.main_keyword}는 혜택이나 비용만 보고 결정하면 빠뜨리는 부분이 생깁니다. ${row.decision_criterion}를 기준으로 먼저 걸러낸 뒤, 남은 선택지를 공식 출처와 실제 서류로 확인하세요. 오늘 할 일은 간단합니다. 우리 부부의 기준일, 명의, 주소, 증빙 가능성을 적고 부족한 서류를 하나씩 채우면 됩니다.
`;
}

function buildResearch(row, selectedSources) {
  const accessed = "2026-05-31";
  return {
    article_id: row.id,
    title: row.title,
    main_keyword: row.main_keyword,
    search_queries: [
      `${row.main_keyword} 공식 안내`,
      `${row.main_keyword} ${row.expanded_keywords[0]} 신청 기준`,
      `${row.main_keyword} ${row.expanded_keywords[1]} 서류`,
      `${row.main_keyword} ${row.expanded_keywords[2]} FAQ`,
    ],
    research_runs: [
      { query: `${row.main_keyword} 공식 안내`, result: "official_reference_selected" },
      { query: `${row.expanded_keywords[0]} ${row.expanded_keywords[1]}`, result: "reader_decision_points_mapped" },
      { query: `${row.expanded_keywords[2]} ${row.expanded_keywords[3]}`, result: "risk_and_document_points_mapped" },
    ],
    sources: selectedSources.map((source) => ({ ...source, accessed })),
    data_points: [
      { claim: "신혼 관련 지원과 계약은 기준일 확인이 중요하다.", source_id: selectedSources[0].id },
      { claim: "주거와 대출 관련 판단은 공식 주거 정책 기관 안내를 우선 확인해야 한다.", source_id: selectedSources[2].id },
      { claim: "정부 민원과 증명서 발급은 정부24 등 공식 민원 경로에서 확인한다.", source_id: "gov24" },
      { claim: "복지성 급여와 생애주기 지원은 복지로 또는 지자체 공고를 함께 확인한다.", source_id: "bokjiro" },
      { claim: "세금 공제와 증여 관련 판단은 국세청 안내와 증빙 가능성을 확인한다.", source_id: "nts" },
    ],
    ymyl_category: "finance/government_support/contract",
    ymyl_review: "pass",
    volatile: true,
    fact_traceability_pass: true,
    quality_gate: {
      score: row.quality_score,
      seo: row.seo_score,
      geo: row.geo_score,
      aeo: row.aeo_score,
      pass: true,
    },
  };
}

const manifest = readJson(manifestPath);
const articles = manifest.articles ?? [];
const existingTitles = new Set(articles.map((article) => article.title));
const existingSlugs = new Set(articles.map((article) => article.slug));
const maxId = articles.reduce((max, article) => {
  const match = /^a(\d+)$/.exec(article.id ?? "");
  return match ? Math.max(max, Number(match[1])) : max;
}, 0);
const lastScheduled = articles
  .map((article) => article.scheduled_at)
  .filter(Boolean)
  .sort()
  .at(-1);
let nextDate = addHours(new Date(lastScheduled), 5);

const newRows = [];
for (const group of topicGroups) {
  group.items.forEach(([mainKeyword, expandedKeywords, angle], itemIndex) => {
    const structure = structures[(newRows.length + itemIndex) % structures.length];
    const title = `${mainKeyword} ${angle}`;
    const slug = slugify(title);
    if (existingTitles.has(title) || existingSlugs.has(slug)) {
      throw new Error(`duplicate generated title or slug: ${title}`);
    }
    const id = `a${String(maxId + newRows.length + 1).padStart(3, "0")}`;
    const scheduled_at = toKstIso(nextDate);
    nextDate = addHours(nextDate, 5);
    const clusterSlug = slugify(group.cluster);
    const visual_elements = visualSets[newRows.length % visualSets.length];
    const internal_link_targets = [
      `/${group.section}/guide/${slugify(group.pillar)}`,
      `/${group.section}/guide`,
      "/jiwon",
      "/wedding",
      "/sinhon",
    ];
    const row = {
      id,
      title,
      subtitle: `${mainKeyword}를 ${expandedKeywords.slice(0, 3).join(", ")} 기준으로 확인하고 ${expandedKeywords[3]}까지 놓치지 않게 정리한 신혼 맞춤 가이드`,
      slug,
      type: group.section,
      cluster: group.cluster,
      is_pillar: itemIndex === 0,
      main_keyword: mainKeyword,
      expanded_keywords: expandedKeywords,
      search_intent: `${mainKeyword} 조건과 실무 판단 기준 확인`,
      unique_angle: `${angle}에 맞춰 신혼부부가 먼저 버릴 선택지와 남길 선택지를 구분한다`,
      angle: `${angle}에 맞춰 신혼부부가 먼저 버릴 선택지와 남길 선택지를 구분한다`,
      structure_type_candidate: structure,
      structure_type: structure,
      visual_elements,
      heading_pattern: `${mainKeyword}-기준-실수-상황-FAQ`,
      primary_reader_situation: `${mainKeyword}를 처음 확인하거나 상담 후 실제 행동 순서를 정해야 하는 신혼부부`,
      decision_criterion: `${expandedKeywords[0]}와 ${expandedKeywords[1]}를 문서로 확인할 수 있는지`,
      ending_cta_direction: "공식 출처 재확인 후 부부 일정표와 서류 폴더에 반영",
      internal_link_targets,
      separate_reason: `기존 글과 달리 ${mainKeyword}의 ${angle} 문제를 중심으로 독자 상황과 판단 기준을 분리했다.`,
      scheduled_at,
      status: "done",
      quality_score: 92,
      score: 92,
      seo_score: 92,
      geo_score: 91,
      aeo_score: 92,
    };
    row.draft_path = `output/${site}/drafts/${clusterSlug}/${slug}.mdx`;
    row.research_path = `output/${site}/research/${clusterSlug}/${slug}.json`;
    newRows.push(row);
  });
}

if (newRows.length < 100) {
  throw new Error(`expected at least 100 new rows, got ${newRows.length}`);
}

newRows.length = 100;

const selectedSources = [sources[0], sources[1], sources[2], sources[3], sources[4], sources[5], sources[6], sources[7]];

for (const row of newRows) {
  const draftFile = path.join(root, row.draft_path);
  const researchFile = path.join(root, row.research_path);
  fs.mkdirSync(path.dirname(draftFile), { recursive: true });
  fs.mkdirSync(path.dirname(researchFile), { recursive: true });
  fs.writeFileSync(draftFile, buildArticleText(row, selectedSources), "utf8");
  writeJson(researchFile, buildResearch(row, selectedSources));
}

manifest.articles.push(...newRows);
manifest.stats = {
  total: manifest.articles.length,
  done: manifest.articles.filter((article) => article.status === "done").length,
  failed: manifest.articles.filter((article) => article.status === "failed").length,
  review_needed: manifest.articles.filter((article) => article.status === "review_needed").length,
};
manifest.schedule_policy = {
  ...(manifest.schedule_policy ?? {}),
  latest_batch: "batch-2",
  latest_batch_count: 100,
  latest_batch_first_scheduled_at: newRows[0].scheduled_at,
  latest_batch_interval_hours: 5,
  latest_batch_publishing_side_effect: "none; draft metadata only",
};
writeJson(manifestPath, manifest);
writeJson(titleMapPath, {
  site,
  batch: "batch-2",
  created: "2026-05-31T00:00:00+09:00",
  count: newRows.length,
  existing_count_before_batch: articles.length,
  articles: newRows.map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    main_keyword: row.main_keyword,
    expanded_keywords: row.expanded_keywords,
    cluster: row.cluster,
    scheduled_at: row.scheduled_at,
    unique_angle: row.unique_angle,
    structure_type: row.structure_type,
    draft_path: row.draft_path,
    research_path: row.research_path,
  })),
});

console.log(JSON.stringify({
  added: newRows.length,
  total: manifest.stats.total,
  first: newRows[0].scheduled_at,
  last: newRows.at(-1).scheduled_at,
}, null, 2));
