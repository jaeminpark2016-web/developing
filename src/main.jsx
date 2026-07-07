import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AlertTriangle, BarChart3, Bookmark, Bot, Building2, CheckCircle2, ChevronRight,
  Database, Download, FileText, Flag, Globe2, Handshake, Info, Layers, Leaf,
  LineChart, MapPin, Search, Share2, ShieldCheck, Sun, Target, Users, WalletCards,
  X, Zap
} from 'lucide-react';
import './styles.css';

const techs38 = [
  '태양광 기술','태양열 기술','풍력 기술','해양에너지 기술','수력 기술','수열 기술','지열 기술','바이오에너지 기술','수소·암모니아 발전 기술','석탄액화·가스화 기술',
  '원자력 기술','핵융합에너지 기술','수소 기술','바이오매스 기술','폐자원 기술','발전효율 기술','산업효율 기술','수송효율 기술','건물효율 기술','이산화탄소 포집·저장·활용 기술',
  '메탄(CH4) 처리 기술','기타 온실가스 처리 및 대체 기술','탄소흡수원 기술','전력통합 기술','열 통합 기술','전력-비전력 부문 간 결합 기술','기후변화 감시 및 진단 기술','기후변화 예측 기술','기후변화 영향 평가 기술','기후변화 취약성 및 위험성 평가 기술',
  '건강 부문 기술','물 부문 기술','국토·연안 부문 기술','농축수산 부문 기술','산림·생태계 부문 기술','산업·에너지 부문 기술','적응조치의 효과평가 기술','기후변화 적응기반 기술'
];

const countries = [
  { id:'vietnam', name:'베트남', flag:'🇻🇳', iso:'VN', center:[15.8,106.3], zoom:5, priority:'높음', readiness:'높음', demand:'높음', data:'충분', cps:'CPS', article6:'체결', score:74.99,
    techs:['태양광 기술','전력통합 기술','산업효율 기술'], regions:['하노이','호치민','닌투언'], basis:['CPS','ODA 협력 이력','현지 파트너 기반'], risks:['인허가','재원조달','전력망 연계'],
    summary:'정책 수요와 시장성이 높고 협력 기반이 축적된 우선 검토국입니다. 기업 해외진출형 태양광·전력통합·산업효율 분야를 우선 확인할 수 있습니다.',
    finance:['GCF Readiness','ADB 에너지전환 프로그램','KOICA/EDCF ODA 연계','민관 공동투자'], partners:['EVNHCMC','MONRE','MOIT','QUATEST3','현지 EPC/O&M 기업'], evidence:['PDP8 및 재생에너지 확대계획','NDC·BTR 관련 자료','World Bank WDI/CCKP','CTCN TA 요청 이력'],
    info:{country:['GDP·산업구조·인구 통계','전력 접근률 및 송배전 손실률','한-베트남 MOU·ODA 협력 이력'], climate:['태풍·홍수·폭염 리스크','태양광 발전 잠재량','지역별 에너지 수급 여건'], policy:['NDC·PDP8·재생에너지 확대계획','인허가·환경영향평가 체계','Article 6.2 이행 기반'], market:['전력수요 증가와 산업단지 수요','지붕형 태양광·ESS 시장성','현지 EPC·O&M 파트너 존재'], execution:['EVNHCMC 계통연계 협의','MONRE 환경영향평가','QUATEST3 인증 경로']},
    points:[{name:'하노이',lat:21.0285,lng:105.8542,desc:'정책·재원 조정 및 기술역량 거점'}, {name:'호치민',lat:10.8231,lng:106.6297,desc:'상업·물류시설 및 산업수요 집중'}, {name:'닌투언',lat:11.6739,lng:108.8629,desc:'태양광 발전잠재량 우수'}] },
  { id:'bangladesh', name:'방글라데시', flag:'🇧🇩', iso:'BD', center:[23.7,90.4], zoom:7, priority:'높음', readiness:'중간', demand:'매우 높음', data:'보통', cps:'CPS', article6:'확인필요', score:82.53,
    techs:['물 부문 기술','기후변화 감시 및 진단 기술','건강 부문 기술'], regions:['다카','치타공','쿨나'], basis:['CPS','기후취약성 높음','ODA 협력 이력'], risks:['홍수·해수면 상승','도시 인프라','행정역량'], summary:'적응·물관리·보건 분야의 개발협력 수요가 매우 높은 후보국입니다.', finance:['KOICA/EDCF','GCF 적응재원','World Bank 회복력 사업','ADB 도시 인프라 재원'], partners:['MoEFCC','BWDB','LGED','현지 대학·NGO'], evidence:['NAP/NDC','ND-GAIN','INFORM Risk','CPS'], info:{country:['GDP·도시화·빈곤 지표','전력·인터넷 접근률','한국 ODA 협력 이력'], climate:['연안 침수·홍수 리스크','델타 지역 기후취약성','물 스트레스'], policy:['NAP·NDC 적응 우선순위','재난위험관리 정책','수자원 관리 제도'], market:['도시 인프라 수요','수처리·보건 서비스 수요','MDB 프로젝트 파이프라인'], execution:['BWDB·LGED 협력 가능성','GCF 적응재원 연계','현지 NGO 네트워크']}, points:[{name:'다카',lat:23.8103,lng:90.4125,desc:'도시·정책 수요 집중'}, {name:'치타공',lat:22.3569,lng:91.7832,desc:'연안·항만 리스크'}, {name:'쿨나',lat:22.8456,lng:89.5403,desc:'델타·홍수 적응 수요'}] },
  { id:'philippines', name:'필리핀', flag:'🇵🇭', iso:'PH', center:[12.5,122.7], zoom:5, priority:'높음', readiness:'중간', demand:'매우 높음', data:'보통', cps:'CPS', article6:'미체결', score:72.97,
    techs:['기후변화 감시 및 진단 기술','건강 부문 기술','물 부문 기술'], regions:['마닐라','세부','다바오'], basis:['CPS','재난위험 높음','ODA 협력 이력'], risks:['태풍·홍수','전력 안정성','지방정부 역량 편차'], summary:'적응·재난대응 중심의 사회적 기여형 협력에 적합합니다.', finance:['KOICA 적응사업','GCF Readiness','ADB 회복력 사업','World Bank 재난위험관리'], partners:['DENR','DOE','PAGASA','LGU 네트워크'], evidence:['NAP/NDC','INFORM Risk','ND-GAIN 취약성'], info:{country:['도서국가 전력·교통 여건','취약 인구 및 도시 집중','한국 개발협력 기반'], climate:['태풍·홍수·폭염 리스크','연안 취약성','재난대응 수요'], policy:['NDC·재난위험관리 정책','지방정부 실행계획','적응계획'], market:['재난예측·보건·물관리 수요','도시 인프라 보강 수요','분산형 에너지 수요'], execution:['PAGASA 데이터 협력','LGU 기반 파일럿','GCF·ADB 재원 연계']}, points:[{name:'마닐라',lat:14.5995,lng:120.9842,desc:'정책·도시 리스크 집중'}, {name:'세부',lat:10.3157,lng:123.8854,desc:'중부 협력 거점'}, {name:'다바오',lat:7.1907,lng:125.4553,desc:'남부 협력 거점'}] },
  { id:'cambodia', name:'캄보디아', flag:'🇰🇭', iso:'KH', center:[12.5,104.9], zoom:7, priority:'중상', readiness:'중간', demand:'높음', data:'보통', cps:'CPS', article6:'체결', score:75.21,
    techs:['태양광 기술','물 부문 기술','농축수산 부문 기술'], regions:['프놈펜','시엠립','캄퐁참'], basis:['CPS','한-메콩 협력','ODA 협력 기반'], risks:['전력망 안정성','홍수·가뭄','인허가·토지'], summary:'메콩 지역의 물·농업·태양광 수요와 개발협력 기반이 결합된 후보국입니다.', finance:['KOICA/EDCF','ADB 농업·물관리 사업','GCF 적응재원'], partners:['MME','MOE','MOWRAM','EDC','현지 농업·수자원 기관'], evidence:['NDC','CPS','Mekong 협력자료','World Bank WDI'], info:{country:['농업·관광 중심 산업구조','전력망·농촌 전력화 수준','한-메콩 협력 기반'], climate:['홍수·가뭄 리스크','수자원 변동성','태양광 잠재량'], policy:['NDC·재생에너지 정책','수자원 정책','PPP·조달 체계'], market:['태양광·농업 물관리 수요','관광지역 물관리 수요','전력 접근성 개선 수요'], execution:['EDC 전력 협력','MOWRAM 물관리 협력','ADB/GCF 연계']}, points:[{name:'프놈펜',lat:11.5564,lng:104.9282,desc:'정책·전력수요 중심'}, {name:'시엠립',lat:13.3671,lng:103.8448,desc:'관광·물관리 수요'}, {name:'캄퐁참',lat:12.0000,lng:105.4500,desc:'농업·홍수 적응 수요'}] },
  { id:'indonesia', name:'인도네시아', flag:'🇮🇩', iso:'ID', center:[-2.5,118.0], zoom:4, priority:'매우 높음', readiness:'높음', demand:'높음', data:'충분', cps:'CPS', article6:'체결', score:62.02,
    techs:['전력통합 기술','지열 기술','태양광 기술'], regions:['자카르타','자바','술라웨시'], basis:['CPS','GCF 수혜','지역사무소 기반'], risks:['도서지역 전력망','토지·인허가','사업지 분산'], summary:'대규모 감축 잠재력과 에너지전환 수요가 큰 후보국입니다.', finance:['MDB 재원','Article 6 연계 검토','PPP','JETP 연계 검토'], partners:['MEMR','PLN','BAPPENAS','현지 전력·인프라 기업'], evidence:['NDC 강화계획','에너지전환 파트너십 자료','World Bank PPI'], info:{country:['도서국가 전력망 구조','대규모 에너지 수요','한국 기관 지역사무소'], climate:['재생에너지·지열 잠재량','산림·연안 리스크','전력망 취약성'], policy:['NDC·에너지전환 계획','전력부문 탈탄소 정책','PPP 제도'], market:['전력망·지열·태양광 시장','산업단지 수요','JETP 연계 가능성'], execution:['PLN 전력망 협력','BAPPENAS 정책 협의','MDB·PPP 재원 연계']}, points:[{name:'자카르타',lat:-6.2088,lng:106.8456,desc:'정책·재원 조정 거점'}, {name:'자바',lat:-7.5361,lng:112.2384,desc:'전력수요 및 산업 밀집'}, {name:'술라웨시',lat:-2.5489,lng:120.0149,desc:'재생·지열 잠재력'}] },
  { id:'laos', name:'라오스', flag:'🇱🇦', iso:'LA', center:[18.2,103.8], zoom:6, priority:'중상', readiness:'중간', demand:'중상', data:'보통', cps:'CPS', article6:'체결', score:63.63, techs:['수력 기술','전력통합 기술','물 부문 기술'], regions:['비엔티안','루앙프라방','참파삭'], basis:['CPS','한-메콩 협력','전력·수자원 협력 수요'], risks:['수자원 변동성','송전망 연계','재원조달'], summary:'수력·전력망·물관리 수요가 결합되어 메콩권 협력 거점으로 검토 가능한 후보국입니다.', finance:['EDCF','ADB 전력망 사업','Mekong 지역협력 재원'], partners:['MEM','EDL','MONRE','Mekong 관련 기관'], evidence:['NDC','CPS','Mekong 협력자료','전력수출·수력계획'], info:{country:['수력 중심 전력구조','농촌 전력화 수요','한-메콩 협력 기반'], climate:['수자원 변동성','홍수·가뭄 리스크','산악지역 접근성'], policy:['수력·전력수출 정책','NDC','수자원 관리제도'], market:['수력·송전망 협력수요','농촌 전력화','물관리 기술 수요'], execution:['EDL 전력망 협력','ADB 재원 연계','메콩 협력채널']}, points:[{name:'비엔티안',lat:17.9757,lng:102.6331,desc:'정책·전력망 거점'}, {name:'루앙프라방',lat:19.8834,lng:102.1347,desc:'수자원·관광 리스크'}, {name:'참파삭',lat:14.9,lng:105.86,desc:'남부 수력·농업 수요'}] },
  { id:'srilanka', name:'스리랑카', flag:'🇱🇰', iso:'LK', center:[7.8,80.7], zoom:7, priority:'중상', readiness:'중간', demand:'중상', data:'보통', cps:'CPS', article6:'확인필요', score:50.58, techs:['태양광 기술','풍력 기술','물 부문 기술'], regions:['콜롬보','함반토타','트링코말리'], basis:['CPS','인도양 협력 거점','재생에너지 수요'], risks:['재정·환율 리스크','전력망 안정성','해안 재해'], summary:'재생에너지와 물관리 수요가 높고, 인도양 협력 거점으로 활용 가능한 후보국입니다.', finance:['ADB 에너지 사업','World Bank 회복력 재원','KOICA/EDCF 검토'], partners:['Ministry of Power and Energy','CEB','BOI','현지 항만·수자원 기관'], evidence:['NDC','전력개발계획','CPS','World Bank WDI'], info:{country:['인도양 물류거점','전력수급·재생에너지 수요','한국 협력 여건'], climate:['해안재해·홍수 리스크','태양광·풍력 잠재량','물관리 수요'], policy:['전력개발계획','NDC','투자유치 제도'], market:['태양광·풍력 시장','항만·물류시설 에너지 수요','물관리 인프라 수요'], execution:['CEB 전력 협력','BOI 투자등록','ADB·WB 재원 연계']}, points:[{name:'콜롬보',lat:6.9271,lng:79.8612,desc:'정책·시장·항만 중심'}, {name:'함반토타',lat:6.1429,lng:81.1212,desc:'태양광·항만 연계'}, {name:'트링코말리',lat:8.5874,lng:81.2152,desc:'풍력·항만 잠재력'}] },
  { id:'india', name:'인도', flag:'🇮🇳', iso:'IN', center:[22.6,79.0], zoom:4, priority:'매우 높음', readiness:'높음', demand:'매우 높음', data:'충분', cps:'CPS', article6:'미체결', score:37.75, techs:['태양광 기술','전력통합 기술','물 부문 기술'], regions:['뉴델리','구자라트','마하라슈트라'], basis:['CPS','대규모 시장','기후기술 수출 기반'], risks:['주별 인허가 차이','전력망 연계','현지 경쟁 심화'], summary:'대규모 시장성과 감축 잠재력이 큰 후보국이나, 탄소시장·제도 조건은 별도 검토가 필요합니다.', finance:['World Bank/ADB 재원','GCF·GEF 연계','민관 공동투자','현지 주정부 사업'], partners:['MNRE','MoEFCC','NTPC','SECI','주정부 에너지공사'], evidence:['NDC 및 장기 저탄소 전략','World Bank WDI','기후기술 수출규모','CPS 검토자료'], info:{country:['대규모 시장·전력수요','주별 산업구조 차이','한국 기후기술 수출 기반'], climate:['폭염·물 스트레스','태양광 잠재량','도시·농촌 리스크 차이'], policy:['NDC·재생에너지 목표','주별 인허가 제도','탄소시장 제도 검토'], market:['태양광·전력통합 시장','수처리·도시 인프라','민간투자 기회'], execution:['SECI·NTPC 협력 가능성','주정부 파일럿','MDB·민간재원 연계']}, points:[{name:'뉴델리',lat:28.6139,lng:77.2090,desc:'정책·재원 조정 거점'}, {name:'구자라트',lat:22.2587,lng:71.1924,desc:'태양광·산업 수요'}, {name:'마하라슈트라',lat:19.7515,lng:75.7139,desc:'산업·전력수요 집중'}] },
  { id:'malaysia', name:'말레이시아', flag:'🇲🇾', iso:'MY', center:[4.2,108.0], zoom:5, priority:'중상', readiness:'높음', demand:'중상', data:'충분', cps:'비CPS', article6:'체결', score:58.27, techs:['태양광 기술','산업효율 기술','전력통합 기술'], regions:['쿠알라룸푸르','조호르','사라왁'], basis:['시장성','기후기술 수출 기반','민간협력 가능성'], risks:['경쟁국 선점','정책 인센티브 변동','주별 규제 차이'], summary:'시장·산업 기반이 양호하여 기업 해외진출형 협력 검토에 적합합니다.', finance:['민간투자','MDB 보증','녹색금융'], partners:['NRECC','SEDA','TNB','주정부 기관'], evidence:['재생에너지 로드맵','기후기술 수출규모','WDI/IRENA'], info:{country:['제조업·전력수요 기반','민간시장 성숙도','한국 수출·기업 연계'], climate:['재생에너지 잠재량','홍수 리스크','산업단지 에너지 수요'], policy:['재생에너지 로드맵','녹색금융 정책','주별 규제'], market:['태양광·산업효율 시장','기업 고객 수요','전력통합 수요'], execution:['TNB·SEDA 협력','민간투자 구조','녹색금융 연계']}, points:[{name:'쿠알라룸푸르',lat:3.1390,lng:101.6869,desc:'시장·정책 거점'}, {name:'조호르',lat:1.4854,lng:103.7618,desc:'산업·전력 수요'}, {name:'사라왁',lat:1.5533,lng:110.3592,desc:'재생·수력 연계'}] },
  { id:'egypt', name:'이집트', flag:'🇪🇬', iso:'EG', center:[27.0,30.0], zoom:5, priority:'중상', readiness:'중간', demand:'중상', data:'보통', cps:'CPS', article6:'체결', score:50.78, techs:['태양광 기술','풍력 기술','물 부문 기술'], regions:['카이로','수에즈','아스완'], basis:['CPS','에너지·물관리 협력','시장 확대'], risks:['환율·재원조달','물 부족','제도 리스크'], summary:'에너지와 물관리 협력 수요가 함께 존재하는 북아프리카 거점 후보국입니다.', finance:['EDCF','MDB 인프라 재원','PPP'], partners:['MOERE','EEHC','NREA','현지 수처리 기관'], evidence:['NDC','CPS 중점협력분야','재생에너지 계획'], info:{country:['북아프리카 거점시장','전력·물관리 수요','한국 협력 기반'], climate:['물 부족·폭염 리스크','태양광·풍력 잠재량','나일강 수자원 의존'], policy:['NDC·재생에너지 계획','물관리 정책','투자·PPP 제도'], market:['태양광·풍력·수처리 시장','산업·도시 인프라 수요','MDB 프로젝트'], execution:['NREA·EEHC 협력','EDCF·MDB 연계','PPP 구조 검토']}, points:[{name:'카이로',lat:30.0444,lng:31.2357,desc:'정책·시장 중심'}, {name:'수에즈',lat:29.9668,lng:32.5498,desc:'산업·물류 거점'}, {name:'아스완',lat:24.0889,lng:32.8998,desc:'태양광·수자원 연계'}] }
];

const infoGroups = [
  {key:'country', title:'국가·협력 환경', icon:<Globe2/>},
  {key:'climate', title:'기후환경·리스크', icon:<AlertTriangle/>},
  {key:'policy', title:'정책·제도 기반', icon:<ShieldCheck/>},
  {key:'market', title:'시장·산업·재원', icon:<BarChart3/>},
  {key:'execution', title:'협력·실행 기반', icon:<Handshake/>}
];



function scoreToNum(v){ return v==='매우 높음'?92:v==='높음'?78:v==='중상'?66:v==='중간'?55:v==='보통'?50:42; }
function metricSet(country){
  return [
    {label:'정책 정합성', value:scoreToNum(country.priority), note:country.cps},
    {label:'시장·산업 수요', value:scoreToNum(country.demand), note:country.techs[0]},
    {label:'협력 실행기반', value:scoreToNum(country.readiness), note:country.basis[0]},
    {label:'데이터 확보성', value:country.data==='충분'?85:country.data==='보통'?65:52, note:country.data}
  ];
}

function climateScores(country){
  const base = scoreToNum(country.demand);
  return [
    {label:'홍수·침수', value:Math.min(95, base+10)},
    {label:'폭염·가뭄', value:Math.max(45, base-4)},
    {label:'인프라 취약성', value:Math.min(92, scoreToNum(country.readiness)+8)},
    {label:'에너지 수요압력', value:Math.min(92, scoreToNum(country.priority)+5)}
  ];
}

function policyStages(country){
  const state = country.article6 === '체결' ? '완료' : country.article6 === '확인필요' ? '검토' : '미체결';
  return [
    {label:'전략문서', detail:'NDC·중장기 전략', state:'완료'},
    {label:'부문정책', detail:'재생에너지·적응 정책', state:'진행'},
    {label:'Article 6.2', detail:country.article6, state},
    {label:'사업화 준비', detail:'인허가·조달·표준', state:country.readiness==='높음'?'진행':'검토'}
  ];
}

function fundingMix(country){
  return [
    {label:'공공 ODA', value:28},
    {label:'MDB/기후재원', value:34},
    {label:'민간투자', value:22},
    {label:'탄소시장', value:16}
  ];
}

function executionNodes(country){
  return [
    {id:'hub', label:'K-기후기술', x:190, y:110, type:'hub'},
    {id:'p1', label:country.partners[0] || '주무부처', x:60, y:36},
    {id:'p2', label:country.partners[1] || '전력기관', x:320, y:36},
    {id:'p3', label:country.partners[2] || '규제기관', x:58, y:182},
    {id:'p4', label:country.partners[3] || '인증기관', x:320, y:184},
    {id:'p5', label:country.partners[4] || '민간 파트너', x:190, y:22}
  ];
}

function getRegionProfiles(country, tech){
  const presets = [
    {
      role:'정책·제도 및 재원 조정 거점',
      opportunity:`${tech} 관련 정책 협의, 사업 구조화, 재원 연계 검토에 적합`,
      focus:'정부 부처 협의, MDB·ODA 연계, 제도 정합성 검토',
      action:['관계부처·전력기관 협의체 구성','정책·인허가 체크리스트 점검','초기 재원조달 및 사업구조 검토']
    },
    {
      role:'시장 수요 및 수요처 발굴 거점',
      opportunity:`산업단지·도시 인프라 기반의 ${tech} 수요 확인에 유리`,
      focus:'수요처 발굴, 민간 파트너링, EPC/O&M 협력',
      action:['수요처 인터뷰 및 파이프라인 확보','현지 민간기업·운영기관 발굴','실증 후보지 경제성 검토']
    },
    {
      role:'실증·확산 및 자원 잠재력 거점',
      opportunity:`자원 잠재량과 지역 실행여건을 바탕으로 ${tech} 실증사업 추진에 적합`,
      focus:'실증사업, 성능검증, 성과확산',
      action:['실증후보지 기술 타당성 확인','운영·유지관리 체계 설계','성과확산 및 후속사업 로드맵 작성']
    }
  ];
  return country.points.map((p, idx)=>({
    ...p,
    rank: idx+1,
    role: presets[idx]?.role || '협력 거점',
    opportunity: presets[idx]?.opportunity || `${tech} 협력 가능성 검토`,
    focus: presets[idx]?.focus || '정책·시장·실행여건 검토',
    action: presets[idx]?.action || ['기초 조사','파트너 협의','사업구조 검토'],
    partner: country.partners[idx] || country.partners[0],
    risk: country.risks[idx] || country.risks[0],
    evidence: country.evidence[idx] || country.evidence[0],
    marketScore: Math.max(55, scoreToNum(country.demand) - idx*6),
    policyScore: Math.max(50, scoreToNum(country.priority) - idx*4),
    executionScore: Math.max(48, scoreToNum(country.readiness) - idx*5)
  }));
}

function getStrategySteps(country, tech, purpose, selectedRegion){
  const regionName = selectedRegion?.name || country.points[0]?.name || country.name;
  return [
    {
      key:'survey', title:'1단계 조사', objective:`${regionName} 중심 ${tech} 협력수요와 정책·시장 환경 진단`, period:'1~2개월',
      tasks:['국가·지역별 수요 및 정책자료 검토','핵심 이해관계자 및 담당기관 인터뷰','기술·사업 후보군 1차 도출'],
      outputs:['기초진단 메모','우선 후보사업 Long-list','리스크 매핑'], lead:'NIGT / 주무부처 / 현지기관'
    },
    {
      key:'enable', title:'2단계 기반조성', objective:'제도·재원·파트너 기반을 구체화하고 실행조건을 정렬', period:'2~4개월',
      tasks:['인허가·조달·표준 및 인증체계 확인','재원조달 구조와 공공·민간 역할 설계','현지 파트너 MOU 및 실무협의체 구성'],
      outputs:['사업구조안','재원조달 시나리오','협력기관 역할분담표'], lead:'주무부처 / MDB / KOICA·EDCF / 민간 파트너'
    },
    {
      key:'pilot', title:'3단계 본사업', objective:`${purpose==='전체'?'우선 협력목적':purpose}을 반영한 실증 또는 본사업 착수`, period:'6~18개월',
      tasks:['실증·본사업 상세설계 및 조달','현장 구축 및 운영계획 수립','성과지표(KPI)와 MRV 체계 구축'],
      outputs:['실증/본사업 착수','현장 운영계획','KPI·MRV 프레임'], lead:'사업주체 / 시공·운영사 / 현지정부'
    },
    {
      key:'scale', title:'4단계 성과확산', objective:'후속투자와 타 지역 확산이 가능한 협력모델로 정착', period:'12개월+',
      tasks:['성과평가 및 lessons learned 정리','후속투자·확산지역 발굴','정책환류 및 표준모델화'],
      outputs:['성과평가 보고서','확산 로드맵','후속 투자제안서'], lead:'NIGT / 협력기관 / 투자자'
    }
  ];
}

function markerIcon(label, active=false){
  return L.divIcon({ html:`<div class="map-pin ${active?'active':''}"><div></div><span>${label}</span></div>`, className:'pin-wrap', iconSize:[98,52], iconAnchor:[49,48] });
}

function MiniMap({ country, selectedPoint, onPointClick, compact=false }){
  const el=useRef(null), mapRef=useRef(null), layerRef=useRef(null);
  useEffect(()=>{
    if(!el.current || mapRef.current) return;
    const map=L.map(el.current,{zoomControl:true,scrollWheelZoom:true, dragging:true}).setView(country.center,country.zoom);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:19, attribution:'&copy; OpenStreetMap &copy; CARTO'}).addTo(map);
    layerRef.current=L.layerGroup().addTo(map);
    mapRef.current=map;
    setTimeout(()=>map.invalidateSize(),180);
  },[]);

  useEffect(()=>{
    const map=mapRef.current, layer=layerRef.current;
    if(!map || !layer) return;
    map.setView(country.center, compact ? Math.max(country.zoom-1,4) : country.zoom);
    layer.clearLayers();

    const heatPalette=['#ff4f5e','#ff8f3c','#ffd166'];
    country.points.forEach((p, i)=>{
      const active = p.name===selectedPoint;
      const core = compact ? 26000 : 34000;
      const multipliers = [2.4, 1.6, 0.9];
      multipliers.forEach((m, idx)=>{
        L.circle([p.lat,p.lng],{
          radius: core*m + i*5000,
          stroke:false,
          fillColor:heatPalette[idx],
          fillOpacity: active ? 0.26-(idx*0.04) : 0.18-(idx*0.03)
        }).addTo(layer);
      });
      const demandCircle = L.circle([p.lat,p.lng],{
        radius: compact ? 42000 : 56000,
        color:'#2078d4', weight: active?2.5:1.5, opacity:0.85, fill:false, dashArray:'5 7'
      }).addTo(layer);
      demandCircle.bindTooltip(`${p.name} 잠재수요권`,{direction:'top'});
      const marker = L.marker([p.lat,p.lng],{icon:markerIcon(p.name, active)}).addTo(layer);
      marker.on('click', ()=>onPointClick?.(p.name));
      marker.bindTooltip(`${p.name}: ${p.desc}`,{direction:'top'});
    });

    if(country.points.length>1){
      const corridor = country.points.map(p=>[p.lat,p.lng]);
      L.polyline(corridor,{color:'#0a63bf', weight:3, opacity:.75, dashArray:'7 7'}).addTo(layer)
        .bindTooltip('협력 연계축 예시');
    }
  },[country, selectedPoint, compact, onPointClick]);

  useEffect(()=>{ setTimeout(()=>mapRef.current?.invalidateSize(),160); },[country, selectedPoint, compact]);
  return <div className={`mini-map ${compact?'compact':''}`} ref={el}/>;
}

function makeAiAnswer(country, tech, purpose, query, regionProfile, selectedStep){
  return {
    summary:`${country.name}의 ${tech} 협력은 ${country.summary} 현재 협력목적은 '${purpose}'이며, ${regionProfile?.name || country.regions[0]}를 우선 검토지역으로 두고 ${selectedStep?.title || '단계별 협력전략'} 기준으로 재원·파트너·리스크를 함께 확인하는 것이 적절합니다.`,
    items:[
      `우선지역: ${country.regions.join(', ')}`,
      `핵심 파트너: ${country.partners.slice(0,3).join(', ')}`,
      `재원 후보: ${country.finance.slice(0,3).join(', ')}`,
      `주요 리스크: ${country.risks.join(', ')}`
    ],
    followUp:[
      `${regionProfile?.name || country.regions[0]} 지역의 ${tech} 수요처와 인허가 조건 확인`,
      `${selectedStep?.title || '기반조성 단계'} 기준 재원조달 구조와 역할분담안 정리`,
      `근거자료(${country.evidence[0]})와 국가 전략문서 교차검증`
    ]
  };
}

function AiSearch({ country, tech, purpose, regionProfile, selectedStep, compact=false }){
  const [q,setQ]=useState('');
  const [answer,setAnswer]=useState(null);
  const run=(text=q)=>{
    const query=(text||'').trim(); if(!query) return;
    setQ(query);
    setAnswer(makeAiAnswer(country, tech, purpose, query, regionProfile, selectedStep));
  };
  return <div className={compact?'ai compact':'ai'}>
    <div className="ai-head"><Bot size={18}/><b>AI 통합검색</b><span>플랫폼 탑재 데이터 기반 질의 예시</span></div>
    <div className="ai-input"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&run()} placeholder={`${country.name} ${tech} 재원·파트너·리스크 요약`} /><button onClick={()=>run()}>검색</button></div>
    <div className="prompt-row">{['재원과 파트너 요약','우선지역별 포인트 비교','주요 리스크와 대응전략','보고서 문장으로 정리'].map(p=><button key={p} onClick={()=>run(`${country.name} ${tech} ${p}`)}>{p}</button>)}</div>
    {answer && <div className="ai-answer"><h4><Bot size={17}/> 검색 결과 요약</h4><p>{answer.summary}</p><b>추천 확인 항목</b><ul>{answer.items.map((x,i)=><li key={i}>{x}</li>)}</ul><b>후속 검토</b><ul>{answer.followUp.map((x,i)=><li key={i}>{x}</li>)}</ul></div>}
  </div>;
}

function ReportButton({ country, tech, purpose, regionProfile, selectedStep }){
  const download=()=>{
    const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${country.name}_${tech}_요약보고서</title><style>body{font-family:Arial,'Malgun Gothic',sans-serif;margin:32px;color:#12243a;line-height:1.6}h1{color:#063a75;border-bottom:3px solid #0b70d7;padding-bottom:12px}h2{color:#074f9c;margin-top:26px}.meta{background:#eef7ff;border:1px solid #bfd8f0;padding:14px;border-radius:8px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.card{border:1px solid #d8e6f4;border-radius:8px;padding:14px;background:#fff}li{margin:6px 0}table{border-collapse:collapse;width:100%}td,th{border:1px solid #d7e2ef;padding:10px;text-align:left}th{background:#eef7ff}.small{color:#58708a;font-size:13px}</style></head><body><h1>기후기술 분야 국제협력 전략지도 요약보고서</h1><div class="meta"><b>대상국</b> ${country.name} / <b>검토 기술</b> ${tech} / <b>협력목적</b> ${purpose} / <b>우선 검토지역</b> ${regionProfile?.name || country.regions[0]} / <b>작성일</b> ${new Date().toLocaleDateString('ko-KR')}</div><h2>1. 종합 판단</h2><p>${country.summary}</p><h2>2. 핵심 지표</h2><table><tr><th>협력 우선도</th><td>${country.priority}</td><th>수요 수준</th><td>${country.demand}</td></tr><tr><th>CPS</th><td>${country.cps}</td><th>Article 6.2</th><td>${country.article6}</td></tr><tr><th>데이터 상태</th><td>${country.data}</td><th>우선지역</th><td>${country.regions.join(', ')}</td></tr></table><h2>3. 우선지역별 포인트</h2><table><tr><th>지역</th><th>역할</th><th>핵심 포인트</th></tr>${getRegionProfiles(country, tech).map(r=>`<tr><td>${r.name}</td><td>${r.role}</td><td>${r.desc}</td></tr>`).join('')}</table><h2>4. 단계별 협력전략</h2><div class="card"><b>${selectedStep?.title || '1단계 조사'}</b><p>${selectedStep?.objective || ''}</p><ul>${(selectedStep?.tasks || []).map(t=>`<li>${t}</li>`).join('')}</ul><div class="small">예상기간: ${selectedStep?.period || ''} / 주관: ${selectedStep?.lead || ''}</div></div><h2>5. 전략정보 모듈별 검토</h2><div class="grid">${infoGroups.map(g=>`<div class="card"><b>${g.title}</b><ul>${country.info[g.key].map(v=>`<li>${v}</li>`).join('')}</ul></div>`).join('')}</div><h2>6. 재원·파트너·리스크</h2><table><tr><th>재원 후보</th><td>${country.finance.join(', ')}</td></tr><tr><th>파트너 후보</th><td>${country.partners.join(', ')}</td></tr><tr><th>주요 리스크</th><td>${country.risks.join(', ')}</td></tr><tr><th>근거자료</th><td>${country.evidence.join(', ')}</td></tr></table><h2>7. 후속 검토사항</h2><ul><li>${regionProfile?.name || country.regions[0]} 지역 수요처와 인허가 조건 확인</li><li>재원 구조와 파트너 역할분담안 구체화</li><li>원자료 기반 지표 검증 및 후속 실증사업 후보 도출</li></ul></body></html>`;
    const blob = new Blob([html], {type:'text/html;charset=utf-8'});
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = `기후기술_국제협력_전략지도_${country.name}_${tech}_요약보고서.html`;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 500);
  };
  return <button className="primary" onClick={download}><Download size={17}/> 요약보고서 다운로드</button>;
}

function BarChartSvg({ items, height=180 }){
  const width=320, max = Math.max(...items.map(i=>i.value), 100);
  return <svg className="bar-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
    <line x1="60" y1={height-28} x2={width-10} y2={height-28} stroke="#c9d9ea" strokeWidth="1.5"/>
    {items.map((item, idx)=>{
      const y = 20 + idx*34;
      const w = ((width-110) * item.value) / max;
      return <g key={item.label}>
        <text x="8" y={y+14} fontSize="12" fill="#35506d">{item.label}</text>
        <rect x="68" y={y} width={width-110} height="18" rx="9" fill="#eef4fb"/>
        <rect x="68" y={y} width={w} height="18" rx="9" fill={['#2b8df0','#4a6cf7','#22b8cf','#7d5cf5'][idx%4]}/>
        <text x={72+w} y={y+14} fontSize="12" fontWeight="700" fill="#0b58ad">{item.value}</text>
      </g>
    })}
  </svg>;
}

function DonutSvg({ value, label, color='#0b63bd', size=112 }){
  const r=40, c=2*Math.PI*r, pct=Math.min(Math.max(value,0),100), off = c*(1-pct/100);
  return <div className="donut-svg-wrap"><svg width={size} height={size} viewBox="0 0 100 100" className="donut-svg">
    <circle cx="50" cy="50" r={r} stroke="#e5eef8" strokeWidth="12" fill="none"/>
    <circle cx="50" cy="50" r={r} stroke={color} strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 50 50)"/>
    <text x="50" y="48" textAnchor="middle" className="donut-value">{pct}</text>
    <text x="50" y="63" textAnchor="middle" className="donut-unit">/100</text>
  </svg><b>{label}</b></div>;
}

function RiskHeatChart({ country }){
  const scores = climateScores(country);
  return <div className="risk-heat">
    <div className="heat-grid">
      {scores.map((s, idx)=><div key={s.label} className={`heat-cell h${idx}`}><b>{s.label}</b><span>{s.value}</span></div>)}
    </div>
    <div className="heat-scale"><i/> 위험도 낮음 <span/> 위험도 높음</div>
  </div>;
}

function PolicyPipeline({ country, large=false }){
  const stages = policyStages(country);
  return <div className={`policy-pipeline ${large?'large':''}`}>
    {stages.map((s, idx)=><div key={s.label} className={`policy-stage ${s.state}`}>
      <div className="stage-num">{idx+1}</div>
      <b>{s.label}</b>
      <small>{s.detail}</small>
      <em>{s.state}</em>
    </div>)}
  </div>;
}

function MarketMix({ country, large=false }){
  const mix = fundingMix(country);
  return <div className={`market-mix ${large?'large':''}`}>
    <div className="donut-pair">
      <DonutSvg value={scoreToNum(country.demand)} label="시장수요" color="#0b72dc" size={large?130:104}/>
      <DonutSvg value={scoreToNum(country.readiness)} label="실행기반" color="#16a085" size={large?130:104}/>
    </div>
    <div className="stack-bars">{mix.map((m,idx)=><div className="stack-row" key={m.label}><span>{m.label}</span><div><i style={{width:`${m.value}%`, background:['#0b72dc','#16a085','#f39c12','#8e44ad'][idx]}}/></div><b>{m.value}%</b></div>)}</div>
  </div>;
}

function NetworkSvg({ country, large=false }){
  const nodes = executionNodes(country);
  const hub = nodes[0], others = nodes.slice(1);
  return <div className={`network-svg-wrap ${large?'large':''}`}><svg className="network-svg" viewBox="0 0 380 220">
    {others.map(n=><line key={`l-${n.id}`} x1={hub.x} y1={hub.y} x2={n.x} y2={n.y} stroke="#9fc6eb" strokeWidth="2.5" strokeDasharray="4 5"/>) }
    {nodes.map(n=><g key={n.id}><circle cx={n.x} cy={n.y} r={n.type==='hub'?34:22} fill={n.type==='hub'?'#0b63bd':'#fff'} stroke={n.type==='hub'?'#0b63bd':'#8db6df'} strokeWidth="2.5"/><text x={n.x} y={n.y+(n.type==='hub'?3:2)} textAnchor="middle" className={n.type==='hub'?'node-label hub':'node-label'}>{n.label.length>12?`${n.label.slice(0,12)}…`:n.label}</text></g>)}
  </svg></div>;
}

function VisualCard({ group, country, onOpen }){
  const items=country.info[group.key];
  let viz = null;
  if(group.key==='country') viz = <BarChartSvg items={metricSet(country)} />;
  if(group.key==='climate') viz = <RiskHeatChart country={country} />;
  if(group.key==='policy') viz = <PolicyPipeline country={country} />;
  if(group.key==='market') viz = <MarketMix country={country} />;
  if(group.key==='execution') viz = <NetworkSvg country={country} />;
  return <button className="visual-card rich" onClick={()=>onOpen(group)}>
    <div className="visual-head">{group.icon}<b>{group.title}</b><em>상세 보기</em></div>
    <div className="viz-wrap">{viz}</div>
    <ul>{items.slice(0,2).map(x=><li key={x}>{x}</li>)}</ul>
  </button>;
}

function DetailModal({ group, country, onClose }){
  if(!group) return null;
  const items=country.info[group.key];
  const body = group.key==='country' ? <BarChartSvg items={metricSet(country)} height={220} />
    : group.key==='climate' ? <RiskHeatChart country={country} />
    : group.key==='policy' ? <PolicyPipeline country={country} large />
    : group.key==='market' ? <MarketMix country={country} large />
    : <NetworkSvg country={country} large />;
  return <div className="modal-back" onClick={onClose}><section className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={onClose}><X size={20}/></button>
    <h2>{group.icon}{country.name} — {group.title}</h2>
    <p className="modal-sub">플랫폼에 탑재될 데이터 특성에 맞춰 실제 구현 가능한 시각화 유형을 예시로 구성했습니다.</p>
    <div className="modal-grid wide">
      <div className="modal-viz">{body}</div>
      <div>
        <h3>주요 데이터 요소</h3>
        <ul className="modal-list">{items.map(x=><li key={x}>{x}</li>)}</ul>
        <h3>활용 시나리오</h3>
        <ul className="modal-list">
          <li>국가·기술·협력목적별 핵심 판단 근거를 한 화면에서 비교</li>
          <li>우선지역, 파트너, 재원, 리스크를 교차 조회하여 사업성 검토</li>
          <li>요약보고서, AI 질의응답, 원자료 링크와 연계하여 의사결정 지원</li>
        </ul>
      </div>
    </div>
  </section></div>;
}

function GisInsight({ country, selectedPoint, setSelectedPoint, compact=false }){
  const selected = country.points.find(p=>p.name===selectedPoint) || country.points[0];
  return <section className="gis-card card">
    <div className="card-title"><MapPin/> GIS 기반 우선지역 분석 <small>기후 리스크 히트존 · 잠재수요권 · 협력 연계축</small></div>
    <MiniMap country={country} selectedPoint={selectedPoint} onPointClick={setSelectedPoint} compact={compact} />
    <div className="legend"><span><i className="l-hot"/> 기후리스크 히트존</span><span><i className="l-ring"/> 잠재 수요권</span><span><i className="l-line"/> 협력 연계축</span></div>
    <div className="gis-note"><b>{selected?.name}</b> {selected?.desc}</div>
  </section>;
}

function RegionInsight({ profile }){
  if(!profile) return null;
  const bars = [
    {label:'정책 적합성', value:profile.policyScore},
    {label:'시장 수요', value:profile.marketScore},
    {label:'실행 가능성', value:profile.executionScore}
  ];
  return <div className="region-detail">
    <div className="region-header"><b>{profile.rank}. {profile.name}</b><span>{profile.role}</span></div>
    <p className="region-desc">{profile.opportunity}</p>
    <div className="region-meta"><span><b>핵심 포인트</b>{profile.focus}</span><span><b>주요 파트너</b>{profile.partner}</span><span><b>주요 리스크</b>{profile.risk}</span><span><b>근거자료</b>{profile.evidence}</span></div>
    <BarChartSvg items={bars} height={150} />
    <div className="region-actions"><b>권고 액션</b><ul>{profile.action.map(a=><li key={a}>{a}</li>)}</ul></div>
  </div>;
}

function StrategyPlanner({ country, tech, purpose, selectedRegion }){
  const steps = getStrategySteps(country, tech, purpose, selectedRegion);
  const [active, setActive] = useState(0);
  useEffect(()=>setActive(0), [country.id, tech, purpose, selectedRegion?.name]);
  const step = steps[active];
  return <section className="card planner-card">
    <h3><Layers/> 단계별 협력전략</h3>
    <div className="step-buttons">{steps.map((s, idx)=><button key={s.key} className={idx===active?'on':''} onClick={()=>setActive(idx)}>{s.title}</button>)}</div>
    <div className="step-detail">
      <div className="step-head"><b>{step.objective}</b><span>예상기간 {step.period}</span></div>
      <div className="step-grid">
        <div><h4>주요 작업</h4><ul>{step.tasks.map(t=><li key={t}>{t}</li>)}</ul></div>
        <div><h4>예상 산출물</h4><ul>{step.outputs.map(o=><li key={o}>{o}</li>)}</ul></div>
      </div>
      <div className="step-foot"><b>주관·협력 주체</b><span>{step.lead}</span></div>
    </div>
  </section>;
}

function Summary({ country, tech, regionProfile }){
  return <div className="summary">
    <p><b>주요 협력목적</b><span>국내기업 해외진출 / 국외감축 / 사회적 기여</span></p>
    <p><b>유망 세부기술</b><span>{country.techs.includes(tech) ? tech : country.techs[0]}</span></p>
    <p><b>우선지역</b><span>{country.regions.join(', ')}</span></p>
    <p><b>선정 지역 포인트</b><span>{regionProfile?.name} - {regionProfile?.role}</span></p>
    <p><b>협력기반</b><span>{country.basis.join(', ')}</span></p>
    <p><b>주요 리스크</b><span>{country.risks.join(', ')}</span></p>
  </div>;
}

function List({ title, icon, items }){
  return <div><h3 className="list-title">{icon}{title}</h3><div className="listbox">{items.map((x,i)=><div className="listrow" key={x}><CheckCircle2 size={16}/><span>{x}</span><em>{i+1}</em></div>)}</div></div>;
}

function Start({ country, setCountryId, tech, setTech, purpose, setPurpose, onStart }){
  const [modal,setModal]=useState(null);
  const [point,setPoint]=useState(country.points[0]?.name);
  useEffect(()=>setPoint(country.points[0]?.name), [country]);
  return <div className="start-screen"><header className="hero"><h1>기후기술 분야 국제협력 전략지도</h1><p>국가·기술·지역·재원·파트너 정보를 통합 검토하는 데이터 기반 의사결정 지원 플랫폼</p></header>
    <main className="start-grid v13">
      <section className="card control-card"><div className="section-title"><Globe2/> 통합 검토 조건</div>
        <div className="select-grid">
          <label><b>대상 국가</b><select value={country.id} onChange={e=>setCountryId(e.target.value)}>{countries.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <label><b>기후기술</b><select value={tech} onChange={e=>setTech(e.target.value)}>{techs38.map(t=><option key={t}>{t}</option>)}</select></label>
          <label><b>협력목적</b><select value={purpose} onChange={e=>setPurpose(e.target.value)}>{['전체','국내기업 해외진출','국외감축','사회적 기여'].map(x=><option key={x}>{x}</option>)}</select></label>
        </div>
        <div className="country-hero"><span>{country.flag}</span><b>{country.name}</b><em>{country.iso}</em></div>
        <div className="metric-row"><span>협력 우선도 <b>{country.priority}</b></span><span>수요 수준 <b>{country.demand}</b></span><span>데이터 <b>{country.data}</b></span></div>
        <button className="start-btn" onClick={onStart}>정보 기반 통합 검토 시작 <ChevronRight size={20}/></button>
      </section>
      <section className="card overview-card"><div className="section-title"><Database/> 전략정보 대시보드</div><p className="lead">{country.summary}</p><div className="preview-grid">{infoGroups.map(g=><VisualCard key={g.key} group={g} country={country} onOpen={setModal} />)}</div></section>
      <section className="right-stack"><GisInsight country={country} selectedPoint={point} setSelectedPoint={setPoint} compact /><section className="card ai-card"><AiSearch country={country} tech={tech} purpose={purpose} compact regionProfile={getRegionProfiles(country, tech)[0]} selectedStep={getStrategySteps(country, tech, purpose, getRegionProfiles(country, tech)[0])[0]} /></section></section>
    </main><DetailModal group={modal} country={country} onClose={()=>setModal(null)} /></div>;
}

function Dashboard({ country, setCountryId, tech, setTech, purpose, setPurpose, onHome }){
  const [tab,setTab]=useState('summary');
  const [point,setPoint]=useState(country.points[0]?.name);
  const [modal,setModal]=useState(null);
  useEffect(()=>setPoint(country.points[0]?.name), [country]);
  const profiles = useMemo(()=>getRegionProfiles(country, tech), [country, tech]);
  const regionProfile = profiles.find(p=>p.name===point) || profiles[0];
  const strategySteps = getStrategySteps(country, tech, purpose, regionProfile);
  const [activeStep, setActiveStep] = useState(0);
  useEffect(()=>setActiveStep(0), [country.id, tech, purpose, point]);
  const selectedStep = strategySteps[activeStep];

  return <div className="dashboard"><header className="topbar"><button onClick={onHome}>초기 화면</button><h1>기후기술 분야 국제협력 전략지도</h1><span>통합 정보 대시보드</span></header>
    <div className="layout v13">
      <aside className="left"><h3><Target/> 검토 조건</h3>
        <label>대상 국가<select value={country.id} onChange={e=>setCountryId(e.target.value)}>{countries.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <label>기후기술<select value={tech} onChange={e=>setTech(e.target.value)}>{techs38.map(t=><option key={t}>{t}</option>)}</select></label>
        <label>협력목적<select value={purpose} onChange={e=>setPurpose(e.target.value)}>{['전체','국내기업 해외진출','국외감축','사회적 기여'].map(x=><option key={x}>{x}</option>)}</select></label>
        <div className="quick"><b>빠른 비교</b><button onClick={()=>setTab('summary')}>개요</button><button onClick={()=>setTab('finance')}>재원</button><button onClick={()=>setTab('risk')}>리스크</button></div>
        <button className="side-btn"><Bookmark size={16}/> 관심 후보 보관</button>
        <button className="side-btn" onClick={()=>setTab('ai')}><Bot size={16}/> AI 검색</button>
      </aside>
      <main className="content"><section className="decision-card"><span className="tag">{country.cps}</span><span className="tag">Article 6.2: {country.article6}</span><span className="tag">우선구축국</span><h2>{country.name} - {tech} 통합 검토</h2><p>{country.summary}</p><div className="kpi">{metricSet(country).map(m=><span key={m.label}>{m.label}<b>{m.value}</b><small>{m.note}</small></span>)}</div></section>
        <div className="main-grid v13"><section className="info-matrix card"><h3><Database/> 전략정보 대시보드</h3><div className="visual-grid">{infoGroups.map(g=><VisualCard key={g.key} group={g} country={country} onOpen={setModal} />)}</div></section><GisInsight country={country} selectedPoint={point} setSelectedPoint={setPoint} /></div>
        <div className="bottom-grid v13"><section className="card"><h3><MapPin/> 우선지역별 포인트</h3><div className="regions">{profiles.map(p=><button key={p.name} onClick={()=>setPoint(p.name)} className={p.name===point?'on':''}><b>{p.name}</b><em>{p.desc}</em></button>)}</div><RegionInsight profile={regionProfile} /></section>
          <section className="card planner-card"><h3><Layers/> 단계별 협력전략</h3><div className="step-buttons">{strategySteps.map((s, idx)=><button key={s.key} className={idx===activeStep?'on':''} onClick={()=>setActiveStep(idx)}>{s.title}</button>)}</div><div className="step-detail"><div className="step-head"><b>{selectedStep.objective}</b><span>예상기간 {selectedStep.period}</span></div><div className="step-grid"><div><h4>주요 작업</h4><ul>{selectedStep.tasks.map(t=><li key={t}>{t}</li>)}</ul></div><div><h4>예상 산출물</h4><ul>{selectedStep.outputs.map(o=><li key={o}>{o}</li>)}</ul></div></div><div className="step-foot"><b>주관·협력 주체</b><span>{selectedStep.lead}</span></div></div></section>
        </div>
      </main>
      <aside className="right"><div className="right-head"><span>{country.name} - {tech}</span><b>협력 상세 검토</b></div><div className="tabs">{[['summary','개요'],['finance','재원'],['partner','파트너'],['risk','리스크'],['evidence','근거'],['ai','AI 검색']].map(([k,v])=><button key={k} onClick={()=>setTab(k)} className={tab===k?'on':''}>{v}</button>)}</div><div className="right-body">{tab==='summary'&&<Summary country={country} tech={tech} regionProfile={regionProfile} />} {tab==='finance'&&<List title="재원 후보" icon={<WalletCards/>} items={country.finance} />} {tab==='partner'&&<List title="파트너 후보" icon={<Users/>} items={country.partners} />} {tab==='risk'&&<List title="주요 리스크" icon={<AlertTriangle/>} items={country.risks} />} {tab==='evidence'&&<List title="근거자료" icon={<FileText/>} items={country.evidence} />} {tab==='ai'&&<AiSearch country={country} tech={tech} purpose={purpose} regionProfile={regionProfile} selectedStep={selectedStep} />}</div><div className="right-actions"><ReportButton country={country} tech={tech} purpose={purpose} regionProfile={regionProfile} selectedStep={selectedStep} /></div></aside>
    </div><DetailModal group={modal} country={country} onClose={()=>setModal(null)} /></div>;
}

function App(){
  const [screen,setScreen]=useState('start');
  const [countryId,setCountryId]=useState('vietnam');
  const [tech,setTech]=useState('태양광 기술');
  const [purpose,setPurpose]=useState('전체');
  const country = useMemo(()=>countries.find(c=>c.id===countryId) || countries[0], [countryId]);
  return screen==='start'
    ? <Start country={country} setCountryId={setCountryId} tech={tech} setTech={setTech} purpose={purpose} setPurpose={setPurpose} onStart={()=>setScreen('dashboard')} />
    : <Dashboard country={country} setCountryId={setCountryId} tech={tech} setTech={setTech} purpose={purpose} setPurpose={setPurpose} onHome={()=>setScreen('start')} />;
}

createRoot(document.getElementById('root')).render(<App/>);
