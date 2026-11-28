const seed = {
 projects:[
  {key:'SHOP',name:'E-commerce Web QA',release:'v2.4.0',status:'Active',progress:78,cases:42,bugs:8},
  {key:'MOB',name:'Mobile App Regression',release:'v1.8.2',status:'Active',progress:56,cases:31,bugs:4},
  {key:'ADMIN',name:'Admin Portal',release:'v3.1.0',status:'Review',progress:92,cases:18,bugs:2}
 ],
 cases:[
  {id:'TC-024',title:'회원가입 - 필수 입력값 검증',suite:'회원가입',priority:'High',status:'Pass'},
  {id:'TC-023',title:'로그인 - 잘못된 비밀번호 안내',suite:'로그인',priority:'Medium',status:'Pass'},
  {id:'TC-022',title:'장바구니 - 상품 수량 변경',suite:'장바구니',priority:'High',status:'Fail'},
  {id:'TC-021',title:'상품 검색 - 검색 결과 없음',suite:'검색',priority:'Low',status:'Blocked'},
  {id:'TC-020',title:'주문 - 배송지 입력 및 저장',suite:'주문',priority:'Medium',status:'Pass'}
 ],
 bugs:[
  {id:'BUG-105',title:'장바구니 수량 변경 시 합계 미갱신',project:'SHOP',priority:'High',status:'Open',owner:'QA Tester 01'},
  {id:'BUG-104',title:'검색 결과 페이지네이션 오류',project:'SHOP',priority:'Medium',status:'In Progress',owner:'Dev Sample 02'},
  {id:'BUG-103',title:'앱 재실행 후 필터 초기화',project:'MOB',priority:'Low',status:'Resolved',owner:'Dev Sample 01'},
  {id:'BUG-102',title:'관리자 목록 정렬 기준 오류',project:'ADMIN',priority:'Medium',status:'Open',owner:'QA Tester 01'},
  {id:'BUG-101',title:'비밀번호 안내 문구 오탈자',project:'MOB',priority:'Low',status:'Closed',owner:'Dev Sample 02'}
 ],
 runs:[
  {id:'RUN-008',name:'Sprint 12 · Smoke Test',project:'SHOP',date:'2025-02-18',passed:18,failed:2,blocked:1,status:'In Progress'},
  {id:'RUN-007',name:'Release 1.8 · Regression',project:'MOB',date:'2025-02-17',passed:24,failed:3,blocked:0,status:'Completed'},
  {id:'RUN-006',name:'Admin Portal · Sanity',project:'ADMIN',date:'2025-02-14',passed:16,failed:1,blocked:1,status:'Completed'}
 ]
};
// Invalid local data must never crash the application; do not overwrite it automatically.
let data=JSON.parse(JSON.stringify(seed));
let localDataWarning=false;
try {
 const stored=localStorage.getItem('qaboard-demo');
 if(stored){
  const parsed=JSON.parse(stored);
  if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed)&&['projects','cases','runs','bugs'].every(k=>Array.isArray(parsed[k])))data=parsed;
  else localDataWarning=true;
 }
} catch (_error) {localDataWarning=true;}
let page='dashboard';
let workspaceMode='demo';
let workspaceMenuOpen=false;
let selectedHubEditCaseId=null;
let selectedProjectKey=null;
let selectedCaseId=null;
let selectedRunId=null;
let selectedBugId=null;
let initialCaseStatus='';
let initialBugStatus='';
let bugListView='active';
let initialProjectStatus='';
let projectListFilter='all';
let selectedWorkshopDraftId=null;
let tcHubQuery='';
let tcHubProject='active';
let tcHubFocusedProject='';
let selectedTcCollectionId=null;
let selectedTcCollectionEdit=false;
let analyticsProject='';
let analyticsDrillProject='';
const $=s=>document.querySelector(s);
const save=()=>localStorage.setItem('qaboard-demo',JSON.stringify(data));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const projectLabel=key=>data.projects.find(p=>p.key===key)?.name||'미연결';
const projectStage=key=>{const p=data.projects.find(x=>x.key===key);return p?(p.status==='Completed'?'completed':'active'):'unassigned'};
const matchesProjectStage=(key,stage)=>!stage||(stage==='active'?projectStage(key)==='active':stage==='completed'?projectStage(key)==='completed':true);

// Linked case counts are derived from actual case associations, never from legacy sample counters.
const linkedCasesFor=key=>data.cases.filter(c=>c.project===key).length;
const linkedCaseTotal=()=>data.cases.filter(c=>data.projects.some(p=>p.key===c.project)).length;
const projectOptions=(selected='')=>`<option value="" ${!selected?'selected':''}>프로젝트 미지정</option>`+data.projects.map(p=>`<option value="${esc(p.key)}" ${selected===p.key?'selected':''}>${esc(p.name)} (${esc(p.key)})</option>`).join('');

const statusClass=s=>({'Active':'active','Pass':'pass','Fail':'fail','Blocked':'blocked','Open':'fail','In Progress':'review','Resolved':'pass','Closed':'low','Completed':'pass','Review':'review'}[s]||'low');
const pill=s=>`<span class="status ${statusClass(s)}">${s}</span>`;
function heading(kicker,title,desc,action=''){return `<div class="page-heading"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${desc}</p></div>${action}</div>`}
function stats(items){return `<div class="stats">${items.map(x=>`<div class="stat-card ${x.action?'stat-clickable':''}" ${x.action?`data-stat-action="${x.action}" role="button" tabindex="0" aria-label="${x.label} 상세 보기"`: ''}><div class="stat-top">${x.label}<span class="stat-icon">${x.icon}</span></div><div class="stat-value">${x.value}</div><div class="stat-foot">${x.foot}</div></div>`).join('')}</div>`}
function projectTable(rows=data.projects){return `<div class="panel table-panel"><div class="panel-head"><h3>Project overview</h3><span>${rows.length} projects · 연결된 케이스 기준</span></div><div class="table-wrap"><table><thead><tr><th>PROJECT</th><th>RELEASE</th><th>LINKED TEST CASES</th><th>PROGRESS</th><th>BUGS</th><th>STATUS</th><th>DETAILS</th></tr></thead><tbody>${rows.map(p=>`<tr class="detail-click-row" tabindex="0" role="link" aria-label="${esc(p.name)} 프로젝트 상세 보기" data-row-detail="project" data-row-id="${esc(p.key)}"><td class="project-name">${esc(p.name)}<div class="muted">${esc(p.key)}</div></td><td>${esc(p.release)}</td><td>${linkedCasesFor(p.key)}</td><td><div style="display:flex;align-items:center;gap:8px"><div class="progress-track" style="width:75px"><div class="progress-fill" style="width:${Number(p.progress)||0}%"></div></div>${Number(p.progress)||0}%</div></td><td>${data.bugs.filter(b=>b.project===p.key).length}</td><td>${pill(p.status)}</td><td><button class="btn" data-project-key="${esc(p.key)}">상세 보기 →</button></td></tr>`).join('')}</tbody></table></div></div>`}
function projectDetail(){const p=data.projects.find(x=>x.key===selectedProjectKey);if(!p){selectedProjectKey=null;return projects()}return `${heading('PROJECT DETAILS',esc(p.name),'프로젝트 정보와 진행 상황을 확인하고 수정할 수 있습니다.','<button class="btn primary" data-action="edit-project">✎ Edit project</button>')}<button class="btn" data-action="back-projects" style="margin-bottom:16px">← 프로젝트 목록으로</button><div class="dashboard-grid"><div class="panel"><div class="panel-head"><h3>Project information</h3>${pill(p.status)}</div><div class="detail-row"><span>프로젝트 키</span><strong>${esc(p.key)}</strong></div><div class="detail-row"><span>프로젝트 이름</span><strong>${esc(p.name)}</strong></div><div class="detail-row"><span>릴리즈</span><strong>${esc(p.release)}</strong></div><div class="detail-row"><span>상태</span><strong>${pill(p.status)}</strong></div></div><div class="panel"><div class="panel-head"><h3>QA progress</h3><span>수동 설정 진행률</span></div><div class="stat-value">${Number(p.progress)||0}%</div><div class="progress-track"><div class="progress-fill" style="width:${Number(p.progress)||0}%"></div></div><button type="button" class="detail-row qa-linked-cases-link" data-open-project-suites="${esc(p.key)}" aria-label="${esc(p.name)} 프로젝트의 Test Suite 보기"><span>연결된 테스트 케이스</span><strong>${linkedCasesFor(p.key)}건 <span aria-hidden="true">→</span></strong></button><div class="detail-row"><span>등록된 버그</span><strong>${data.bugs.filter(b=>b.project===p.key).length}</strong></div></div></div>`}
function openEditProject(){const p=data.projects.find(x=>x.key===selectedProjectKey);if(!p)return;$('#modal-root').innerHTML=`<div class="modal-backdrop"><form class="modal" id="edit-project-form"><h2>프로젝트 수정</h2><p>프로젝트 키는 변경하지 않습니다. 가상 프로젝트 정보만 입력하세요.</p><label class="field"><span>프로젝트 키 (변경 불가)</span><input value="${esc(p.key)}" disabled /></label><label class="field"><span>프로젝트 이름</span><input name="name" value="${esc(p.name)}" maxlength="100" required /></label><label class="field"><span>릴리즈</span><input name="release" value="${esc(p.release)}" maxlength="40" required /></label><label class="field"><span>상태</span><select name="status">${['Active','Review','Completed'].map(v=>`<option ${p.status===v?'selected':''}>${v}</option>`).join('')}</select></label><label class="field"><span>진행률 (0–100%)</span><input name="progress" type="number" min="0" max="100" step="1" value="${Number(p.progress)||0}" required /></label><div class="modal-actions"><button type="button" class="btn" data-action="close-modal">취소</button><button type="submit" class="btn primary">변경 저장</button></div></form></div>`;$('#edit-project-form').addEventListener('submit',e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.currentTarget).entries());const progress=Number(v.progress);if(!v.name.trim()||!v.release.trim()||!Number.isInteger(progress)||progress<0||progress>100){toast('입력값을 확인해 주세요.');return}p.name=v.name.trim();p.release=v.release.trim();p.status=v.status;p.progress=progress;save();$('#modal-root').innerHTML='';render();toast('프로젝트 변경 사항을 저장했습니다.')})}

// Stage 6 analytics: use actual case-level Test Run results, not legacy sample counters.
// Legacy Test Runs have only aggregate sample counts, and are deliberately excluded.
function analyticsFor(project=''){
 const cases=data.cases.filter(c=>!project||c.project===project);
 const runs=data.runs.filter(r=>(!project||r.project===project)&&Array.isArray(r.results));
 const legacyRuns=data.runs.filter(r=>(!project||r.project===project)&&!Array.isArray(r.results));
 const bugs=data.bugs.filter(b=>!project||b.project===project);
 const counts={Pass:0,Fail:0,Blocked:0,'Not Run':0};
 for(const r of runs)for(const entry of r.results){
  if(Object.hasOwn(counts,entry.result))counts[entry.result]++;
  else counts['Not Run']++;
 }
 const executed=counts.Pass+counts.Fail+counts.Blocked;
 const passRate=executed>0?Math.round(counts.Pass/executed*100):null;
 const activeBugs=bugs.filter(b=>b.status==='Open'||b.status==='In Progress').length;
 const projects=project?data.projects.filter(p=>p.key===project):data.projects;
 return {cases,runs,legacyRuns,bugs,counts,executed,passRate,activeBugs,projects,totalRuns:data.runs.filter(r=>!project||r.project===project).length};
}
function analyticsSelector(){return `<label class="analytics-selector">프로젝트 <select class="filter" id="analytics-project" aria-label="대시보드 및 리포트 프로젝트 선택"><option value="">전체 프로젝트</option>${data.projects.map(p=>`<option value="${esc(p.key)}" ${analyticsProject===p.key?'selected':''}>${esc(p.name)} (${esc(p.key)})</option>`).join('')}</select></label>`}
function analyticsNote(a){return `<p class="analytics-note">실행 결과는 새 Test Run의 케이스별 결과만 집계합니다. 기존 샘플 Test Run ${a.legacyRuns.length}개는 제외합니다. ${a.executed===0?'아직 결과가 기록된 실행이 없어 Pass rate를 표시하지 않습니다.':'Pass rate = Pass ÷ (Pass + Fail + Blocked). Not Run은 분모에서 제외합니다.'} 프로젝트 진행률은 별도 수동 입력값입니다.</p>`}
function breakdownBars(items,total){return items.map(([name,n,color])=>`<div class="analytics-line"><div class="analytics-line-label"><strong>${esc(name)}</strong><span>${n}건</span></div><div class="progress-track"><div class="analytics-fill" style="width:${total?n/total*100:0}%;background:${color}"></div></div></div>`).join('')}
function analyticsActivity(a){
 const entries=a.runs.slice(0,5);
 return entries.length?entries.map(r=>`<button type="button" class="activity activity-run-link" data-run-id="${esc(r.id)}" aria-label="${esc(r.name)} 테스트 실행 상세 보기"><span class="activity-dot">▷</span><span class="activity-run-text"><strong>${esc(r.id)} · ${esc(r.name)}</strong><small>${esc(projectLabel(r.project))} · ${esc(r.date||'날짜 미기록')} · ${esc(runState(r))}</small></span><span aria-hidden="true" class="activity-arrow">→</span></button>`).join(''):'<div class="empty-note">해당 프로젝트에 기록된 Test Run이 없습니다.</div>';
}
function dashboard(){
 const a=analyticsFor(analyticsProject);
 return `${heading('QUALITY OVERVIEW','QA Dashboard','등록된 데모 프로젝트의 실제 테스트 실행 결과와 버그 현황입니다.',analyticsSelector())}
 ${stats([{label:'모든 프로젝트',value:a.projects.filter(p=>p.status!=='Completed').length,icon:'◫',foot:'완료 전 프로젝트 보기',action:'project-all'},{label:'Test Runs',value:a.totalRuns,icon:'▷',foot:'테스트 실행 목록 보기',action:'dashboard-runs'},{label:'Bug Management',value:a.bugs.length,icon:'⚑',foot:'등록된 버그 보기',action:'dashboard-bugs'},{label:'Reports',value:a.passRate===null?'—':a.passRate+'%',icon:'▥',foot:'품질 리포트 · Pass rate',action:'reports'}])}
 <div class="dashboard-grid"><div class="panel"><div class="panel-head"><h3>Test execution results</h3><span>${a.runs.length} tracked runs</span></div>${breakdownBars([['Pass',a.counts.Pass,'#33956d'],['Fail',a.counts.Fail,'#d65b5b'],['Blocked',a.counts.Blocked,'#e4a64d'],['Not Run',a.counts['Not Run'],'#92a6ba']],a.runs.reduce((sum,r)=>sum+r.results.length,0))}</div><div class="panel"><div class="panel-head"><h3>Bug status</h3><span>${a.bugs.length} bugs</span></div>${breakdownBars(['Open','In Progress','Resolved','Closed'].map((st,i)=>[st,a.bugs.filter(b=>b.status===st).length,['#d65b5b','#e4a64d','#33956d','#92a6ba'][i]]),a.bugs.length)}</div></div>
 <div class="dashboard-grid dashboard-secondary"><div class="panel"><div class="panel-head"><h3>Project coverage</h3><span>진행 중(Active) 프로젝트만 표시</span></div>${a.projects.filter(p=>p.status==='Active').map(p=>`<div class="analytics-project"><strong>${esc(p.name)}</strong><span>${linkedCasesFor(p.key)} cases · ${a.bugs.filter(b=>b.project===p.key).length} bugs</span><button class="btn" data-project-key="${esc(p.key)}">상세 보기 →</button></div>`).join('')||'<p class="empty-note">진행 중인 프로젝트가 없습니다.</p>'}</div><div class="panel"><div class="panel-head"><h3>Recent test runs</h3><span>최근 등록 기준</span></div>${analyticsActivity(a)}</div></div>
 ${analyticsNote(a)}`;
}
function projectVisibilityRows(filter=projectListFilter){
 // Completed projects stay in data and remain accessible from the archive view.
 if(filter==='completed')return data.projects.filter(p=>p.status==='Completed');
 if(filter==='active')return data.projects.filter(p=>p.status==='Active');
 return data.projects.filter(p=>p.status!=='Completed');
}
function projects(){
 const view=initialProjectStatus==='Active'?'active':projectListFilter;
 const visible=projectVisibilityRows(view);
 const currentCount=projectVisibilityRows('all').length;
 const completedCount=projectVisibilityRows('completed').length;
 const activeCount=projectVisibilityRows('active').length;
 const descriptions={all:'전체 프로젝트',active:'진행 중',completed:'완료된 프로젝트'};
 return `${heading('WORKSPACE','Projects','완료된 프로젝트는 삭제하지 않고 보관함에서 따로 확인합니다.','<button class="btn primary" data-action="new-project">＋ New project</button>')}
 ${stats([{label:'All projects',value:currentCount,icon:'◫',foot:'완료 전 프로젝트만 표시',action:'project-all'},{label:'In progress',value:data.projects.filter(p=>p.status==='Active').length,icon:'◷',foot:'Active 프로젝트만 보기',action:'project-active'},{label:'Test cases',value:linkedCaseTotal(),icon:'☷',foot:'연결된 테스트 케이스 목록',action:'project-cases'},{label:'Tracked bugs',value:data.bugs.length,icon:'⚑',foot:'등록된 버그 목록',action:'project-bugs'}])}
 <div class="project-filter-line project-archive-filter"><span>${descriptions[view]||descriptions.all} · ${visible.length}건</span><label class="project-view-label" for="project-view-filter">목록 선택 <select id="project-view-filter" class="filter" aria-label="프로젝트 목록 선택"><option value="all" ${view==='all'?'selected':''}>전체 프로젝트 · ${currentCount}건</option><option value="active" ${view==='active'?'selected':''}>진행 중 · ${activeCount}건</option><option value="completed" ${view==='completed'?'selected':''}>완료된 프로젝트 · ${completedCount}건</option></select></label></div>
 ${visible.length?projectTable(visible):`<div class="panel empty-project-archive"><strong>${view==='completed'?'완료된 프로젝트가 없습니다.':'표시할 프로젝트가 없습니다.'}</strong><p>${view==='completed'?'프로젝트 상세 보기 → Edit project에서 상태를 Completed로 변경하면 이곳에 표시됩니다.':'프로젝트를 새로 만들거나 다른 목록을 선택해 주세요.'}</p></div>`}`;
}

// A TC collection is a named group of detailed test cases under one immutable project.
// Legacy cases stay available inside a virtual "기존 TC" collection for each project.
const tcCollections=()=>Array.isArray(data.tcCollections)?data.tcCollections:(data.tcCollections=[]);
const tcGroups=()=>tcCollections().filter(g=>g&&typeof g.id==='string'&&data.projects.some(p=>p.key===g.project));
const tcGroupById=id=>tcGroups().find(g=>g.id===id);
const legacyGroupId=project=>'legacy:'+(project||'unassigned');
function tcGroupInfo(id){
 if(id?.startsWith('legacy:')){
  const project=id.slice(7);return {id,project:project==='unassigned'?'':project,name:'기존 TC · '+(project==='unassigned'?'프로젝트 미지정':projectLabel(project)),suite:'기존 케이스',legacy:true};
 }
 return tcGroupById(id);
}
function tcCasesInGroup(group){return data.cases.filter(c=>group.legacy?(!c.collectionId&&(c.project||'')===group.project):c.collectionId===group.id)}
function nextTcGroupId(){return 'TCG-'+String(Math.max(0,...tcCollections().map(g=>Number(String(g.id).replace('TCG-',''))||0))+1).padStart(3,'0')}
function allTcGroups(){
 const assigned=tcGroups();
 const legacyProjects=[...new Set(data.cases.filter(c=>!c.collectionId).map(c=>c.project||''))];
 return [...assigned,...legacyProjects.map(p=>tcGroupInfo(legacyGroupId(p)))];
}
function tcHub(){
 const groups=allTcGroups().filter(g=>matchesProjectStage(g.project,tcHubProject)&&(!tcHubFocusedProject||g.project===tcHubFocusedProject)&&[g.id,g.name,g.suite,projectLabel(g.project)].join(' ').toLowerCase().includes(tcHubQuery.toLowerCase()));
 const totalCases=data.cases.length;
 return `${heading('TEST CASE WORKSPACE','Test Case 목록','Test Suite를 선택해 세부 TC를 관리하거나 새 Test Suite를 만드세요.','<button type="button" class="btn primary" data-action="tc-new">＋ Add test case</button>')}
 <div class="tc-hub-toolbar"><input id="tc-hub-search" class="search" placeholder="Test Suite 이름 또는 프로젝트 검색" value="${esc(tcHubQuery)}" aria-label="Test Suite 검색"/><select id="tc-hub-project" class="filter" aria-label="프로젝트 진행 상태 필터"><option value="active" ${tcHubProject==='active'?'selected':''}>진행 중인 프로젝트</option><option value="completed" ${tcHubProject==='completed'?'selected':''}>완료된 프로젝트</option></select>${tcHubFocusedProject?`<button type="button" class="btn tc-focus-clear" data-action="clear-tc-project-focus">${esc(projectLabel(tcHubFocusedProject))} · 선택 해제 ×</button>`:''}<span>${groups.length}개 Suite</span></div>
 <section class="panel tc-sheet"><div class="panel-head"><h3>Test Suite 목록</h3><span>행을 클릭하면 세부 TC 목록이 열립니다</span></div><div class="table-wrap"><table class="tc-sheet-table tc-collection-table"><thead><tr><th>Suite ID</th><th>Test Suite 이름</th><th>프로젝트</th><th>세부 분류</th><th>TC 수</th></tr></thead><tbody>${groups.length?groups.map(g=>`<tr class="tc-suite-row" tabindex="0" role="link" aria-label="${esc(g.name)} 세부 TC 열기" data-tc-group="${esc(g.id)}"><td class="case-id">${esc(g.id)}</td><td class="tc-title-cell">${esc(g.name)}</td><td>${esc(projectLabel(g.project))}</td><td>${esc(g.suite||'—')}</td><td>${tcCasesInGroup(g).length}건</td></tr>`).join(''):'<tr><td colspan="5" class="empty-note">Test Suite가 없습니다. + Add test case로 생성해 보세요.</td></tr>'}</tbody></table></div></section>
 <p class="analytics-note">기존 TC는 ‘기존 TC’ 묶음에서 계속 조회·수정할 수 있습니다. 입력 내용은 현재 브라우저에만 저장되며, 다른 방문자와 자동 공유되지는 않습니다.</p>`;
}
function tcCollectionForm(){
 const existing=selectedTcCollectionEdit?tcGroupById(selectedTcCollectionId):null;
 return `${heading('TEST CASE WORKSPACE',existing?'Test Suite 수정':'새 Test Suite 만들기','Test Suite에 프로젝트를 지정하면 모든 세부 TC가 해당 프로젝트에 연결됩니다.','<button class="btn" data-action="tc-back">← 목록으로</button>')}
 <section class="panel tc-collection-form"><div class="panel-head"><h3>${existing?'Test Suite 수정':'테스트 케이스 추가'}</h3><span>Step 1 / Test Suite 정보</span></div>
 <form id="tc-collection-form" autocomplete="off">
 <label class="field"><span>Test Suite 이름 *</span><input name="name" required maxlength="100" value="${esc(existing?.name||'')}" placeholder="예: 쇼핑몰 결제 테스트"/></label>
 <label class="field"><span>프로젝트 *</span><select name="project" required ${existing?'disabled':''}><option value="">프로젝트 선택</option>${data.projects.filter(p=>existing?.project===p.key||p.status!=='Completed').map(p=>`<option value="${esc(p.key)}" ${p.key===existing?.project?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label>
 <label class="field"><span>세부 분류 (선택)</span><input name="suite" maxlength="80" value="${esc(existing?.suite||'')}" placeholder="예: 결제 / 장바구니"/></label>
 <label class="field"><span>기본 우선순위</span><select name="priority">${['Low','Medium','High'].map(v=>`<option ${v===(existing?.priority||'Medium')?'selected':''}>${v}</option>`).join('')}</select></label>
 <div class="workshop-actions"><button class="btn primary" type="submit">${existing?'Suite 정보 저장':'Test Suite 만들기'}</button><button class="btn" type="button" data-action="tc-back">취소</button></div>
 </form></section>`;
}
function tcCollectionDetail(){
 const group=tcGroupInfo(selectedTcCollectionId);if(!group){selectedTcCollectionId=null;return tcHub()}
 const cases=tcCasesInGroup(group);
 return `${heading('TEST CASE WORKSPACE',esc(group.name),'Test Suite에 속한 세부 테스트 케이스를 관리합니다.','<button class="btn primary" type="button" data-action="tc-add-detail" '+(group.project?'':'disabled title="프로젝트를 먼저 연결해 주세요"')+'>＋ Add detail TC</button>')}
 <div class="tc-collection-banner"><div><small>소속 프로젝트 · 변경 불가</small><strong>${esc(projectLabel(group.project))}</strong><span>${esc(group.suite||'세부 분류 미지정')} · 세부 TC ${cases.length}건</span></div><div class="tc-collection-actions"><button class="btn" data-action="tc-back">← Suite 목록</button>${!group.legacy?'<button class="btn" data-action="tc-edit-group">Test Suite 이름 / 정보 수정</button>':''}</div></div>
 <section class="panel tc-sheet"><div class="panel-head"><h3>세부 TC 목록</h3><span>스프레드시트형 목록 · 프로젝트 고정</span></div><div class="table-wrap"><table class="tc-sheet-table tc-detail-table"><thead><tr><th>TC ID</th><th>제목</th><th>스위트</th><th>우선순위</th><th>사전 조건</th><th>테스트 단계</th><th>예상 결과</th><th>최근 결과</th><th>관리</th></tr></thead><tbody>${cases.length?cases.map(c=>`<tr class="detail-click-row" tabindex="0" role="link" aria-label="${esc(c.id)} 세부 TC 보기와 수정" data-row-detail="tc-detail" data-row-id="${esc(c.id)}"><td class="case-id">${esc(c.id)}</td><td class="tc-title-cell">${esc(c.title)}</td><td>${esc(c.suite)}</td><td>${pill(c.priority)}</td><td class="tc-long-cell">${esc(c.preconditions||'—')}</td><td class="tc-long-cell">${esc(c.steps||'—')}</td><td class="tc-long-cell">${esc(c.expected||'—')}</td><td>${pill(c.status||'Not Run')}</td><td><button type="button" class="btn" data-tc-hub-edit="${esc(c.id)}">보기 / 수정</button></td></tr>`).join(''):'<tr><td class="empty-note" colspan="9">세부 TC가 없습니다. Add detail TC로 첫 항목을 등록해 보세요.</td></tr>'}</tbody></table></div></section>`;
}
function openTcForm(id=null,draftId=null){selectedHubEditCaseId=id;selectedWorkshopDraftId=draftId;page='workshop';render()}
const tcDrafts=()=>Array.isArray(data.tcDrafts)?data.tcDrafts:(data.tcDrafts=[]);
function nextWorkshopId(){return 'DRAFT-'+(Math.max(0,...tcDrafts().map(d=>Number(String(d.id||'').replace('DRAFT-',''))||0))+1)}
// Keep Test Run references in sync when a Test Case identifier is changed.
// Run results remain historical snapshots; only their foreign-key-like caseId changes.
function renameTestCaseId(current,newId){
 const clean=String(newId||'').trim();
 if(!/^[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*$/.test(clean)||clean.length>40)return {ok:false,error:'TC ID는 영문·숫자·-·_만 사용하고 40자 이하여야 합니다.'};
 if(data.cases.some(c=>c!==current&&String(c.id).toLowerCase()===clean.toLowerCase()))return {ok:false,error:'이미 사용 중인 TC ID입니다.'};
 const previous=current.id;
 if(previous===clean)return {ok:true};
 current.id=clean;
 for(const run of data.runs){if(!Array.isArray(run.results))continue;for(const item of run.results){if(item.caseId===previous)item.caseId=clean}}
 if(selectedCaseId===previous)selectedCaseId=clean;
 if(selectedHubEditCaseId===previous)selectedHubEditCaseId=clean;
 return {ok:true};
}
function nextTestCaseId(){return 'TC-'+String(Math.max(24,...data.cases.map(c=>/^TC-\d+$/.test(String(c.id))?Number(String(c.id).slice(3)):0))+1).padStart(3,'0')}
function workshop(){
 const group=tcGroupInfo(selectedTcCollectionId);
 if(!group)return tcHub();
 const draft=(selectedHubEditCaseId?data.cases.find(c=>c.id===selectedHubEditCaseId):tcDrafts().find(d=>d.id===selectedWorkshopDraftId))||{};
 return `${heading('TEST CASE WORKSPACE',selectedHubEditCaseId?'TC 수정':'새 세부 TC 작성','2단계: 선택한 Test Suite에 세부 테스트 케이스를 등록하세요.','<button type="button" class="btn" data-action="tc-back-detail">← 세부 TC 목록</button>')}
 <div class="tc-collection-banner"><div><small>소속 Test Suite</small><strong>${esc(group.name)}</strong><span>프로젝트: ${esc(projectLabel(group.project))} · Suite에서 고정</span></div></div>
 <section class="panel tc-collection-form"><div class="panel-head"><h3>${selectedHubEditCaseId?'세부 테스트 케이스 수정':'새 세부 테스트 케이스 작성'}</h3><span>${esc(draft.id||'Draft / Publish')}</span></div>
 <form id="tc-workshop-form" autocomplete="off">
 ${selectedHubEditCaseId?`<label class="field"><span>TC ID *</span><input name="caseId" maxlength="40" required value="${esc(draft.id||'')}" pattern="[A-Za-z0-9]+([-_][A-Za-z0-9]+)*" title="영문·숫자·하이픈(-)·밑줄(_)만 사용할 수 있습니다"/><small class="tc-edit-help">TC ID를 변경하면 연결된 Test Run의 케이스 참조도 함께 갱신됩니다. 중복 ID는 저장할 수 없습니다.</small></label>`:''}
 <label class="field"><span>프로젝트 (Suite에서 지정)</span><input readonly value="${esc(projectLabel(group.project))}" aria-label="고정 프로젝트" /></label>
 <label class="field"><span>테스트 스위트 *</span><input name="suite" required maxlength="80" value="${esc(draft.suite||group.suite||'')}" placeholder="예: 결제"/></label>
 <label class="field"><span>테스트 케이스 제목 *</span><input name="title" required maxlength="100" value="${esc(draft.title||'')}" placeholder="예: 결제 실패 안내 확인"/></label>
 <label class="field"><span>우선순위</span><select name="priority">${['Low','Medium','High'].map(v=>`<option ${v===(draft.priority||group.priority||'Medium')?'selected':''}>${v}</option>`).join('')}</select></label>
 ${selectedHubEditCaseId?`<label class="field"><span>최근 결과</span><select name="status">${['Not Run','Pass','Fail','Blocked'].map(v=>`<option ${v===(draft.status||'Not Run')?'selected':''}>${v}</option>`).join('')}</select></label>`:''}
 <label class="field"><span>사전 조건</span><textarea name="preconditions" maxlength="1000" rows="3" placeholder="예: 테스트 계정으로 장바구니에 가상 상품이 있다">${esc(draft.preconditions||'')}</textarea></label>
 <label class="field"><span>테스트 단계 *</span><textarea name="steps" maxlength="2000" rows="5" required placeholder="1. 장바구니 열기&#10;2. 수량 변경">${esc(draft.steps||'')}</textarea></label>
 <label class="field"><span>예상 결과 *</span><textarea name="expected" maxlength="1000" rows="3" required placeholder="합계가 수량에 맞게 갱신된다">${esc(draft.expected||'')}</textarea></label>
 <div class="workshop-actions">${selectedHubEditCaseId?'':'<button type="button" class="btn" data-workshop-action="save">임시 저장</button>'}<button type="button" class="btn primary" data-workshop-action="publish">${selectedHubEditCaseId?'수정 내용 저장':'세부 TC 등록하기'}</button><button class="btn" type="button" data-action="tc-back-detail">취소</button></div>
 </form></section>
 ${!selectedHubEditCaseId&&tcDrafts().some(d=>d.collectionId===group.id)?`<section class="panel table-panel"><div class="panel-head"><h3>이 묶음의 임시 저장</h3></div>${tcDrafts().filter(d=>d.collectionId===group.id).map(d=>`<div class="tc-draft-row"><strong>${esc(d.title)}</strong><button class="btn" data-workshop-edit="${esc(d.id)}">이어 작성</button></div>`).join('')}</section>`:''}`;
}
function workshopSubmit(mode){
 const form=$('#tc-workshop-form');if(!form||!form.reportValidity())return;
 const group=tcGroupInfo(selectedTcCollectionId);if(!group){toast('Test Suite를 먼저 선택하세요.');return}
 if(!group.project&&!selectedHubEditCaseId){toast('프로젝트가 지정된 묶음에서 작성해 주세요.');return}
 const v=Object.fromEntries(new FormData(form).entries());
 for(const k of ['suite','title','preconditions','steps','expected'])v[k]=String(v[k]||'').trim();
 if(!v.suite||!v.title||!v.steps||!v.expected){toast('필수 항목을 입력해 주세요.');return}
 v.project=group.project;
 if(mode==='publish'){
  if(selectedHubEditCaseId){
   const current=data.cases.find(c=>c.id===selectedHubEditCaseId&&tcCasesInGroup(group).some(item=>item.id===c.id));
   if(!current){toast('수정할 TC를 찾을 수 없습니다.');return}
   const rename=renameTestCaseId(current,v.caseId);
   if(!rename.ok){toast(rename.error);return}
   delete v.caseId;
   Object.assign(current,v);save();selectedHubEditCaseId=null;page='tc-collection';render();toast('세부 TC를 수정했습니다.');return;
  }
  const item={id:nextTestCaseId(),...v,status:'Not Run',collectionId:group.legacy?undefined:group.id};
  data.cases.unshift(item);
  if(selectedWorkshopDraftId)data.tcDrafts=tcDrafts().filter(d=>d.id!==selectedWorkshopDraftId);
  selectedWorkshopDraftId=null;save();page='tc-collection';render();toast(item.id+' 등록 완료');return;
 }
 const drafts=tcDrafts();let d=drafts.find(x=>x.id===selectedWorkshopDraftId);
 if(d)Object.assign(d,v);else{d={id:nextWorkshopId(),collectionId:group.id,...v};drafts.push(d)}
 selectedWorkshopDraftId=d.id;save();render();toast('이 묶음에 임시 저장했습니다.');
}
function cases(){return `${heading('TEST MANAGEMENT','Test Cases','테스트 시나리오와 실행 기준을 관리합니다.','<button class="btn primary" data-action="new-case">＋ Add test case</button>')}<div class="toolbar"><input class="search" id="case-search" placeholder="⌕  테스트 케이스 검색..." /><select class="filter" id="case-filter"><option value="">All status</option><option ${initialCaseStatus==='Pass'?'selected':''}>Pass</option><option>Fail</option><option>Blocked</option></select><select class="filter" id="case-project-filter" aria-label="프로젝트 진행 상태 필터"><option value="active">진행 중인 프로젝트</option><option value="completed">완료된 프로젝트</option></select></div><div class="panel"><div class="table-wrap"><table><thead><tr><th>CASE ID</th><th>TITLE</th><th>PROJECT</th><th>TEST SUITE</th><th>PRIORITY</th><th>LAST RESULT</th><th>DETAILS</th></tr></thead><tbody id="case-rows">${caseRows(data.cases.filter(c=>matchesProjectStage(c.project,'active')&&(!initialCaseStatus||c.status===initialCaseStatus)&&(!analyticsDrillProject||c.project===analyticsDrillProject)))}</tbody></table></div></div>`}
function caseRows(rows){return rows.length?rows.map(c=>`<tr class="detail-click-row" tabindex="0" role="link" aria-label="${esc(c.id)} 테스트 케이스 상세 보기" data-row-detail="case" data-row-id="${esc(c.id)}"><td class="case-id">${esc(c.id)}</td><td class="project-name">${esc(c.title)}</td><td>${esc(projectLabel(c.project))}</td><td>${esc(c.suite)}</td><td>${pill(c.priority)}</td><td>${pill(c.status)}</td><td><button type="button" class="btn" data-case-id="${esc(c.id)}">상세 보기 →</button></td></tr>`).join(''):'<tr><td colspan="7" class="empty-note">검색 결과가 없습니다.</td></tr>'}
function caseDetail(){
 const c=data.cases.find(x=>x.id===selectedCaseId);
 if(!c){selectedCaseId=null;return cases()}
 return `${heading('TEST CASE DETAILS',esc(c.id)+' · '+esc(c.title),'테스트 조건과 예상 결과를 확인하고 수정하세요.','<button class="btn primary" data-action="edit-case">✎ Edit test case</button>')}
 <button type="button" class="btn" data-action="back-cases" style="margin-bottom:16px">← 테스트 케이스 목록으로</button>
 <div class="dashboard-grid"><div class="panel"><div class="panel-head"><h3>Test case information</h3>${pill(c.status)}</div>
 <div class="detail-row"><span>케이스 ID</span><strong>${esc(c.id)}</strong></div>
 <div class="detail-row"><span>이름</span><strong>${esc(c.title)}</strong></div>
 <div class="detail-row"><span>프로젝트</span><strong>${esc(projectLabel(c.project))}</strong></div>
 <div class="detail-row"><span>Test suite</span><strong>${esc(c.suite)}</strong></div>
 <div class="detail-row"><span>Priority</span><strong>${pill(c.priority)}</strong></div>
 <div class="detail-row"><span>Last result</span><strong>${pill(c.status)}</strong></div></div>
 <div class="panel"><div class="panel-head"><h3>Test procedure</h3><span>Demo</span></div>
 <div class="case-section-label">사전 조건</div><div class="case-notes">${esc(c.preconditions||'미작성')}</div>
 <div class="case-section-label">테스트 단계</div><div class="case-notes">${esc(c.steps||'미작성')}</div>
 <div class="case-section-label">예상 결과</div><div class="case-notes">${esc(c.expected||'미작성')}</div></div></div>`;
}
function openEditCase(){
 const c=data.cases.find(x=>x.id===selectedCaseId);if(!c)return;
 $('#modal-root').innerHTML=`<div class="modal-backdrop"><form class="modal" id="edit-case-form">
 <h2>테스트 케이스 수정</h2><p>${esc(c.id)} · 가상의 테스트 시나리오만 입력해 주세요.</p>
 <label class="field"><span>TC ID *</span><input name="caseId" value="${esc(c.id)}" required maxlength="40" pattern="[A-Za-z0-9]+([-_][A-Za-z0-9]+)*" /></label>
 <label class="field"><span>제목</span><input name="title" value="${esc(c.title)}" maxlength="100" required /></label>
 <label class="field"><span>프로젝트</span><select name="project">${projectOptions(c.project)}</select></label>
 <label class="field"><span>Test suite</span><input name="suite" value="${esc(c.suite)}" maxlength="80" required /></label>
 <label class="field"><span>우선순위</span><select name="priority">${['Low','Medium','High'].map(v=>`<option ${c.priority===v?'selected':''}>${v}</option>`).join('')}</select></label>
 <label class="field"><span>사전 조건</span><textarea name="preconditions" maxlength="1000" rows="2">${esc(c.preconditions||'')}</textarea></label>
 <label class="field"><span>테스트 단계</span><textarea name="steps" maxlength="2000" rows="3">${esc(c.steps||'')}</textarea></label>
 <label class="field"><span>예상 결과</span><textarea name="expected" maxlength="1000" rows="2">${esc(c.expected||'')}</textarea></label>
 <div class="modal-actions"><button type="button" class="btn" data-action="close-modal">취소</button><button type="submit" class="btn primary">변경 저장</button></div></form></div>`;
 $('#edit-case-form').addEventListener('submit',e=>{
  e.preventDefault();const v=Object.fromEntries(new FormData(e.currentTarget).entries());
  if(!v.title.trim()||!v.suite.trim()){toast('제목과 테스트 스위트를 입력하세요.');return}
  if(v.project&&!data.projects.some(p=>p.key===v.project)){toast('유효한 프로젝트를 선택해 주세요.');return}
  const rename=renameTestCaseId(c,v.caseId);
  if(!rename.ok){toast(rename.error);return}
  c.title=v.title.trim();c.suite=v.suite.trim();c.priority=v.priority;c.project=v.project;
  c.preconditions=v.preconditions.trim();c.steps=v.steps.trim();c.expected=v.expected.trim();
  save();$('#modal-root').replaceChildren();render();toast('테스트 케이스 수정 내용을 저장했습니다.');
 });
}

// v0.4.0: test-run results are snapshots of linked cases at run creation time.
// Historical sample runs without `results` remain visible as read-only legacy summaries.
const runCounts=run=>Array.isArray(run.results)?{
 passed:run.results.filter(x=>x.result==='Pass').length,
 failed:run.results.filter(x=>x.result==='Fail').length,
 blocked:run.results.filter(x=>x.result==='Blocked').length,
 notRun:run.results.filter(x=>x.result==='Not Run').length
}:{passed:run.passed||0,failed:run.failed||0,blocked:run.blocked||0,notRun:null};
const runState=run=>!Array.isArray(run.results)?run.status:
 (run.results.length>0&&run.results.every(x=>x.result!=='Not Run')?'Completed':'In Progress');
// The run lifecycle (In Progress / Completed) is different from its test outcome.
// Incomplete runs can already contain failures or blocked cases.
const runOutcome=run=>{
 if(!Array.isArray(run.results))return 'Legacy';
 const n=runCounts(run);
 if(n.failed>0)return 'Fail';
 if(n.blocked>0)return 'Blocked';
 if(n.notRun===0&&n.passed>0)return 'Pass';
 if(n.passed>0)return 'Partial';
 return 'Not Run';
};
const outcomePill=run=>{
 const o=runOutcome(run);
 if(o==='Legacy')return '<span class="status low">Sample</span>';
 return pill(o);
};
function runs(){return `${heading('TEST MANAGEMENT','Test Runs','프로젝트별 테스트 실행을 생성하고 각 케이스의 결과를 기록합니다.','<button class="btn primary" data-action="new-run">＋ Create test run</button>')}
 ${stats([{label:'Total runs',value:data.runs.length,icon:'▷',foot:'등록된 테스트 실행'},{label:'Completed',value:data.runs.filter(r=>runState(r)==='Completed').length,icon:'✓',foot:'완료된 실행'},{label:'Passed checks',value:data.runs.reduce((a,r)=>a+runCounts(r).passed,0),icon:'◉',foot:'누적 통과 건수'},{label:'Failed checks',value:data.runs.reduce((a,r)=>a+runCounts(r).failed,0),icon:'!',foot:'누적 실패 건수'}])}
 <div class="panel"><p class="muted" style="padding:0 16px;font-size:11px">QA RESULT는 케이스 결과 요약(Pass / Fail / Blocked / Partial / Not Run), RUN STATUS는 실행 진행 상태(In Progress / Completed)입니다. 이전 샘플 실행은 Sample로 표시합니다.</p><div class="table-wrap"><table><thead><tr><th>RUN ID</th><th>TEST RUN</th><th>PROJECT</th><th>DATE</th><th>PASS / FAIL / BLOCKED</th><th>QA RESULT</th><th>RUN STATUS</th><th>DETAILS</th></tr></thead><tbody>${data.runs.map(r=>{const n=runCounts(r);return `<tr class="detail-click-row" tabindex="0" role="link" aria-label="${esc(r.id)} 테스트 실행 상세 보기" data-row-detail="run" data-row-id="${esc(r.id)}"><td class="case-id">${esc(r.id)}</td><td class="project-name">${esc(r.name)}</td><td><strong>${esc(projectLabel(r.project))}</strong><div class="muted">${esc(r.project)}</div></td><td>${esc(r.date)}</td><td><span class="positive">${n.passed}</span> / <span style="color:#c85c5c">${n.failed}</span> / ${n.blocked}</td><td>${outcomePill(r)}</td><td>${pill(runState(r))}</td><td><button class="btn" data-run-id="${esc(r.id)}">상세 보기 →</button></td></tr>`}).join('')}</tbody></table></div></div>`}
function runDetail(){
 const run=data.runs.find(r=>r.id===selectedRunId);
 if(!run){selectedRunId=null;return runs()}
 const n=runCounts(run),isLegacy=!Array.isArray(run.results);
 return `${heading('TEST RUN DETAILS',esc(run.id)+' · '+esc(run.name),'선택한 테스트 실행의 케이스별 결과를 확인하고 기록합니다.')}
 <button class="btn" data-action="back-runs" style="margin-bottom:16px">← 테스트 실행 목록으로</button>
 <div class="panel" style="margin-bottom:16px"><div class="panel-head"><h3>Run information</h3>${pill(runState(run))}</div>
 <div class="detail-row"><span>프로젝트</span><strong>${esc(projectLabel(run.project))} (${esc(run.project)})</strong></div>
 <div class="detail-row"><span>실행 날짜</span><strong>${esc(run.date)}</strong></div>
 <div class="detail-row"><span>Pass / Fail / Blocked</span><strong>${n.passed} / ${n.failed} / ${n.blocked}</strong></div>
 ${!isLegacy?`<div class="detail-row"><span>Not Run</span><strong>${n.notRun}</strong></div>`:''}<div class="detail-row"><span>QA 결과 (집계)</span><strong>${outcomePill(run)}</strong></div></div>
 ${isLegacy?`<div class="panel"><h3>이전 버전 샘플 실행</h3><p class="muted">이 실행은 기존 샘플 통계만 있고 케이스별 결과 기록이 없습니다. 원본 통계를 보존하기 위해 읽기 전용으로 표시해요. 케이스별 기록은 새 Test Run을 만들어 시작해 주세요.</p></div>`:
 `<div class="panel"><div class="panel-head"><h3>Test results</h3><span>${run.results.length} cases · 프로젝트 연결 당시의 목록</span></div><div class="table-wrap"><table><thead><tr><th>CASE ID</th><th>TEST CASE</th><th>RESULT</th><th>CHANGE RESULT</th><th>LINKED BUG</th></tr></thead><tbody>${run.results.map(r=>{const linked=data.bugs.find(b=>b.id===r.bugId);return `<tr><td class="case-id">${esc(r.caseId)}</td><td class="project-name">${esc(r.title)}</td><td>${r.result==='Not Run'?'<span class="status low">Not Run</span>':pill(r.result)}</td><td><select class="filter run-result" data-run-id="${esc(run.id)}" data-case-id="${esc(r.caseId)}" aria-label="${esc(r.caseId)} 결과 변경">${['Not Run','Pass','Fail','Blocked'].map(v=>`<option value="${v}" ${r.result===v?'selected':''}>${v}</option>`).join('')}</select></td><td>${linked?`<button type="button" class="btn" data-linked-bug="${esc(linked.id)}">${esc(linked.id)} 상세 →</button> <button type="button" class="btn" data-unlink-bug="${esc(run.id)}" data-unlink-case="${esc(r.caseId)}">연결 해제</button>`:r.result==='Fail'?`<button type="button" class="btn" data-link-bug="${esc(run.id)}" data-link-case="${esc(r.caseId)}">＋ 버그 연결</button>`:'<span class="muted">—</span>'}</td></tr>`}).join('')}</tbody></table></div></div>`}`;
}
// Link a failed run result to a defect. Existing results and bug records are kept intact.
function openLinkBug(runId,caseId){
 const run=data.runs.find(r=>r.id===runId);
 const result=run?.results?.find(r=>r.caseId===caseId);
 if(!result||result.result!=='Fail'){toast('Fail 결과만 버그에 연결할 수 있습니다.');return}
 const matches=data.bugs.filter(b=>b.project===run.project);
 $('#modal-root').innerHTML=`<div class="modal-backdrop"><form class="modal" id="link-bug-form"><h2>실패한 테스트와 버그 연결</h2><p>${esc(caseId)} · ${esc(result.title)}<br>기존 버그를 선택하거나 새 버그 제목을 작성하세요. 가상 데이터만 입력하세요.</p><label class="field"><span>기존 버그 연결</span><select name="existing"><option value="">선택하지 않음</option>${matches.map(b=>`<option value="${esc(b.id)}">${esc(b.id)} · ${esc(b.title)}</option>`).join('')}</select></label><label class="field"><span>새 버그 생성 (제목 입력 시 기존 선택보다 우선)</span><input name="title" maxlength="100" placeholder="예: 장바구니 수량 변경 오류" /></label><label class="field"><span>새 버그 우선순위</span><select name="priority"><option>Medium</option><option>High</option><option>Low</option></select></label><div class="modal-actions"><button type="button" class="btn" data-action="close-modal">취소</button><button type="submit" class="btn primary">연결 저장</button></div></form></div>`;
 $('#link-bug-form').addEventListener('submit',e=>{
  e.preventDefault();const v=Object.fromEntries(new FormData(e.currentTarget).entries());const title=v.title.trim();let bugId=v.existing;
  if(title){bugId=nextBugId();const b={id:bugId,title,project:run.project,priority:v.priority,status:'Open',owner:'QA Tester 01',description:'',steps:''};recordBugChange(b,'실패 테스트 '+runId+' / '+caseId+'에서 생성');data.bugs.unshift(b);}
  else if(!matches.some(b=>b.id===bugId)){toast('기존 버그를 선택하거나 새 버그 제목을 입력해 주세요.');return}
  result.bugId=bugId;const linkedBug=data.bugs.find(b=>b.id===bugId);if(linkedBug)recordBugChange(linkedBug,'테스트 연결: '+runId+' / '+caseId);save();$('#modal-root').replaceChildren();render();toast(bugId+' 버그 연결 완료');
 });
}
// Stage 5 completion: all audit entries use a demo actor; no personal details are collected.
const BUG_STATES=['Open','In Progress','Resolved','Closed'];
const BUG_PRIORITIES=['Low','Medium','High'];
const DEMO_OWNERS=['QA Tester 01','Dev Sample 01','Dev Sample 02'];
const nextBugId=()=> 'BUG-'+(Math.max(105,...data.bugs.map(b=>Number(String(b.id).replace('BUG-',''))||0))+1);
const bugLinks=id=>data.runs.flatMap(run=>Array.isArray(run.results)?run.results.filter(r=>r.bugId===id).map(r=>({runId:run.id,runName:run.name,caseId:r.caseId,title:r.title,result:r.result})):[]);
function recordBugChange(b,description){
 if(!Array.isArray(b.history))b.history=[];
 b.history.push({at:new Date().toISOString(),actor:'QA Tester 01',description});
}
function updateBugStatus(b,next){
 if(!BUG_STATES.includes(next)||b.status===next)return false;
 const previous=b.status;b.status=next;recordBugChange(b,`상태: ${previous} → ${next}`);return true;
}
function deleteBugConfirmed(id){
 const index=data.bugs.findIndex(b=>b.id===id);if(index<0)return;
 // Remove only references to the deleted bug. Historical test results remain intact.
 for(const run of data.runs){if(!Array.isArray(run.results))continue;
  for(const result of run.results)if(result.bugId===id)delete result.bugId;
 }
 data.bugs.splice(index,1);selectedBugId=null;save();render();toast(id+' 버그가 삭제되었습니다.');
}
function openDeleteBug(){
 const b=data.bugs.find(x=>x.id===selectedBugId);if(!b)return;
 const n=bugLinks(b.id).length;
 $('#modal-root').innerHTML=`<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="delete-bug-title"><h2 id="delete-bug-title">버그 삭제 · ${esc(b.id)}</h2><p>정말 삭제할까요? 삭제된 버그는 복구할 수 없습니다. 연결된 ${n}개 테스트 결과의 버그 연결도 해제되지만 테스트 결과 자체는 유지됩니다.</p><div class="modal-actions"><button type="button" class="btn" data-action="close-modal">취소</button><button type="button" class="btn danger" data-confirm-delete-bug="${esc(b.id)}">버그 삭제 확인</button></div></div></div>`;
}
function bugVisibilityRows(view=bugListView){
 if(view==='completed')return data.bugs.filter(b=>['Resolved','Closed'].includes(b.status));
 if(view==='all')return data.bugs;
 return data.bugs.filter(b=>['Open','In Progress'].includes(b.status));
}
function bugs(){
 const active=bugVisibilityRows('active').length,closed=bugVisibilityRows('completed').length;
 const visible=bugVisibilityRows();
 const filtered=visible.filter(b=>matchesProjectStage(b.project,'active')&&(!analyticsDrillProject||b.project===analyticsDrillProject)&&(!initialBugStatus|| (initialBugStatus==='active'?['Open','In Progress'].includes(b.status):b.status===initialBugStatus)));
 return `${heading('ISSUE TRACKING','Bug Management','진행 중인 버그와 완료된 버그를 분리해 관리합니다.','<button class="btn primary" data-action="new-bug">＋ Create bug</button>')}
 ${stats([{label:'Total bugs',value:data.bugs.length,icon:'⚑',foot:'등록된 버그'},{label:'Open / In Progress',value:active,icon:'◷',foot:'조치가 필요한 버그'},{label:'Resolved / Closed',value:closed,icon:'✓',foot:'처리된 버그'},{label:'Linked test results',value:data.runs.reduce((sum,r)=>sum+(Array.isArray(r.results)?r.results.filter(x=>x.bugId&&data.bugs.some(b=>b.id===x.bugId)).length:0),0),icon:'☷',foot:'Test Run에서 연결된 결과'}])}
 <div class="project-filter-line project-archive-filter"><span>${bugListView==='completed'?'완료된 버그':bugListView==='all'?'전체 버그':'진행 중인 버그'} · ${visible.length}건</span><label class="project-view-label" for="bug-view-filter">목록 선택 <select id="bug-view-filter" class="filter" aria-label="버그 목록 선택"><option value="active" ${bugListView==='active'?'selected':''}>진행 중 · ${active}건</option><option value="completed" ${bugListView==='completed'?'selected':''}>완료된 버그 · ${closed}건</option><option value="all" ${bugListView==='all'?'selected':''}>전체 버그 · ${data.bugs.length}건</option></select></label></div>
 <div class="toolbar bug-toolbar"><input class="search" id="bug-search" aria-label="버그 검색" placeholder="⌕  ID·제목·설명·담당자 검색..." />
 <select class="filter" id="bug-filter" aria-label="버그 상태 필터"><option value="">모든 상태</option><option ${initialBugStatus==='active'?'selected':''} value="active">Open + In Progress</option>${BUG_STATES.map(x=>`<option value="${x}">${x}</option>`).join('')}</select>
 <select class="filter" id="bug-priority-filter" aria-label="우선순위 필터"><option value="">모든 우선순위</option>${BUG_PRIORITIES.map(x=>`<option>${x}</option>`).join('')}</select>
 <select class="filter" id="bug-project-filter" aria-label="프로젝트 진행 상태 필터"><option value="active">진행 중인 프로젝트</option><option value="completed">완료된 프로젝트</option></select></div>
 <div class="panel"><div class="panel-head"><h3>Bug list</h3><span id="bug-result-count">${filtered.length} bugs</span></div><div class="table-wrap"><table><thead><tr><th>BUG ID</th><th>SUMMARY</th><th>PROJECT</th><th>PRIORITY</th><th>ASSIGNEE</th><th>STATUS</th><th>LINKED TESTS</th><th>CHANGE</th><th>DETAILS</th></tr></thead><tbody id="bug-rows">${bugRows(filtered)}</tbody></table></div></div>`;
}
function bugRows(rows){return rows.length?rows.map(b=>`<tr class="detail-click-row" tabindex="0" role="link" aria-label="${esc(b.id)} 버그 상세 보기" data-row-detail="bug" data-row-id="${esc(b.id)}"><td class="bug-id">${esc(b.id)}</td><td class="project-name">${esc(b.title)}</td><td><strong>${esc(projectLabel(b.project))}</strong><div class="muted">${esc(b.project)}</div></td><td>${pill(b.priority)}</td><td>${esc(b.owner)}</td><td>${pill(b.status)}</td><td>${bugLinks(b.id).length}</td><td><select class="filter bug-status" data-id="${esc(b.id)}" aria-label="${esc(b.id)} 상태 변경">${BUG_STATES.map(state=>`<option ${state===b.status?'selected':''}>${state}</option>`).join('')}</select></td><td><button type="button" class="btn" data-bug-id="${esc(b.id)}">상세 보기 →</button></td></tr>`).join(''):'<tr><td colspan="9" class="empty-note">조건에 맞는 버그가 없습니다.</td></tr>'}

function bugDetail(){
 const b=data.bugs.find(x=>x.id===selectedBugId);
 if(!b){selectedBugId=null;return bugs()}
 const links=bugLinks(b.id),history=Array.isArray(b.history)?b.history:[];
 return `${heading('BUG DETAILS',esc(b.id),'버그 정보, 연결된 실패 테스트, 변경 이력을 확인합니다.', '<div class="header-buttons"><button class="btn" data-action="delete-bug">삭제</button><button class="btn primary" data-action="edit-bug">✎ Edit bug</button></div>')}
 <button class="btn" data-action="back-bugs" style="margin-bottom:16px">← 버그 목록으로</button>
 <div class="dashboard-grid"><div class="panel"><div class="panel-head"><h3>Bug information</h3>${pill(b.status)}</div><div class="detail-row"><span>버그 ID</span><strong>${esc(b.id)}</strong></div><div class="detail-row"><span>제목</span><strong>${esc(b.title)}</strong></div><div class="detail-row"><span>프로젝트</span><strong>${esc(projectLabel(b.project))} (${esc(b.project)})</strong></div><div class="detail-row"><span>우선순위</span><strong>${pill(b.priority)}</strong></div><div class="detail-row"><span>상태</span><strong>${pill(b.status)}</strong></div><div class="detail-row"><span>담당자 (가상)</span><strong>${esc(b.owner)}</strong></div></div>
 <div class="panel"><div class="panel-head"><h3>Reproduction details</h3><span>데모 정보</span></div><div class="detail-row"><span>설명</span><strong class="multiline-detail">${esc(b.description||'아직 작성되지 않음')}</strong></div><div class="detail-row"><span>재현 단계</span><strong class="multiline-detail">${esc(b.steps||'아직 작성되지 않음')}</strong></div></div></div>
 <div class="panel table-panel"><div class="panel-head"><h3>Linked test results</h3><span>${links.length}개 연결</span></div>${links.length?`<div class="table-wrap"><table><thead><tr><th>TEST RUN</th><th>CASE</th><th>RESULT</th><th>GO TO RUN</th></tr></thead><tbody>${links.map(l=>`<tr><td>${esc(l.runName)} (${esc(l.runId)})</td><td>${esc(l.caseId)} · ${esc(l.title)}</td><td>${pill(l.result)}</td><td><button class="btn" data-run-id="${esc(l.runId)}">실행 상세 →</button></td></tr>`).join('')}</tbody></table></div>`:'<p class="empty-note">연결된 테스트 실행 결과가 없습니다. Test Runs에서 Fail 결과를 연결할 수 있습니다.</p>'}</div>
 <div class="panel table-panel"><div class="panel-head"><h3>Change history</h3><span>${history.length} events</span></div>${history.length?`<div class="history-list">${[...history].reverse().map(h=>`<div class="history-item"><div><strong>${esc(h.description)}</strong><small>${esc(h.actor||'QA Tester 01')} · ${esc(h.at?new Date(h.at).toLocaleString('ko-KR'):'')}</small></div></div>`).join('')}</div>`:'<p class="empty-note">기존 샘플 버그에는 변경 이력이 없습니다. 이후 변경부터 기록됩니다.</p>'}</div>`;
}

function openEditBug(){
 const b=data.bugs.find(x=>x.id===selectedBugId);if(!b)return;
 $('#modal-root').innerHTML=`<div class="modal-backdrop"><form class="modal" id="edit-bug-form"><h2>버그 수정 · ${esc(b.id)}</h2><p>실제 고객정보나 개인정보를 입력하지 마세요. 버그 ID는 변경할 수 없습니다.</p><label class="field"><span>버그 제목</span><input name="title" maxlength="100" required value="${esc(b.title)}" /></label><label class="field"><span>프로젝트</span><select name="project" required>${data.projects.map(p=>`<option value="${esc(p.key)}" ${p.key===b.project?'selected':''}>${esc(p.name)} (${esc(p.key)})</option>`).join('')}</select></label><label class="field"><span>우선순위</span><select name="priority">${BUG_PRIORITIES.map(v=>`<option ${v===b.priority?'selected':''}>${v}</option>`).join('')}</select></label><label class="field"><span>상태</span><select name="status">${BUG_STATES.map(v=>`<option ${v===b.status?'selected':''}>${v}</option>`).join('')}</select></label><label class="field"><span>담당자 (가상 별칭)</span><select name="owner">${[...new Set([...DEMO_OWNERS,b.owner])].map(v=>`<option ${v===b.owner?'selected':''}>${esc(v)}</option>`).join('')}</select></label><label class="field"><span>버그 설명 (선택)</span><textarea name="description" rows="3" maxlength="1000" placeholder="예: 장바구니 수량이 변경되어도 금액이 갱신되지 않음">${esc(b.description||'')}</textarea></label><label class="field"><span>재현 단계 (선택)</span><textarea name="steps" rows="3" maxlength="1000" placeholder="1. 장바구니 열기  2. 수량 변경">${esc(b.steps||'')}</textarea></label><div class="modal-actions"><button type="button" class="btn" data-action="close-modal">취소</button><button type="submit" class="btn primary">변경 저장</button></div></form></div>`;
 $('#edit-bug-form').addEventListener('submit',e=>{
 e.preventDefault();const v=Object.fromEntries(new FormData(e.currentTarget).entries());
 if(!v.title.trim()||!data.projects.some(p=>p.key===v.project)||!BUG_PRIORITIES.includes(v.priority)||!BUG_STATES.includes(v.status)||!v.owner){toast('입력값을 확인해 주세요.');return}
 const changed=[];
 for(const [key,label] of [['title','제목'],['project','프로젝트'],['priority','우선순위'],['owner','담당자'],['description','설명'],['steps','재현 단계']]){
  const next=typeof v[key]==='string'?v[key].trim():'';
  if((b[key]||'')!==next){changed.push(label);b[key]=next}
 }
 if(b.status!==v.status){const old=b.status;updateBugStatus(b,v.status);changed.push(`상태 ${old} → ${v.status}`)}
 if(changed.length){recordBugChange(b,'정보 수정: '+changed.join(', '));save()}
 $('#modal-root').replaceChildren();render();toast(changed.length?'버그 변경 사항을 저장했습니다.':'변경된 내용이 없습니다.');
 });
}

function reports(){
 const a=analyticsFor(analyticsProject);
 const total=a.counts.Pass+a.counts.Fail+a.counts.Blocked+a.counts['Not Run'];
 return `${heading('QUALITY REPORTS','Reports','선택한 프로젝트의 테스트 실행·버그 분포를 분석합니다.',analyticsSelector())}
 ${stats([{label:'Executed checks',value:a.executed,icon:'▷',foot:'Not Run 제외'},{label:'Pass rate',value:a.passRate===null?'—':a.passRate+'%',icon:'✓',foot:'실행 결과 기준'},{label:'Failed checks',value:a.counts.Fail,icon:'!',foot:'테스트 실행 Fail 결과'},{label:'Open bugs',value:a.activeBugs,icon:'⚑',foot:'미해결 버그'}])}
 <div class="dashboard-grid"><div class="panel"><div class="panel-head"><h3>Test result distribution</h3><span>총 ${total} case executions</span></div>${breakdownBars([['Pass',a.counts.Pass,'#33956d'],['Fail',a.counts.Fail,'#d65b5b'],['Blocked',a.counts.Blocked,'#e4a64d'],['Not Run',a.counts['Not Run'],'#92a6ba']],total)}</div><div class="panel"><div class="panel-head"><h3>Bug lifecycle</h3><span>총 ${a.bugs.length} bugs</span></div>${breakdownBars(['Open','In Progress','Resolved','Closed'].map((st,i)=>[st,a.bugs.filter(b=>b.status===st).length,['#d65b5b','#e4a64d','#33956d','#92a6ba'][i]]),a.bugs.length)}</div></div>
 <div class="panel table-panel"><div class="panel-head"><h3>Project quality breakdown</h3><span>실제 저장된 데이터만 사용</span></div><div class="table-wrap"><table><thead><tr><th>PROJECT</th><th>TEST CASES</th><th>RUNS (TRACKED)</th><th>PASS</th><th>FAIL</th><th>BLOCKED</th><th>NOT RUN</th><th>PASS RATE</th><th>OPEN BUGS</th></tr></thead><tbody>${a.projects.map(p=>{const x=analyticsFor(p.key);return `<tr><td class="project-name">${esc(p.name)}</td><td>${x.cases.length}</td><td>${x.runs.length}</td><td>${x.counts.Pass}</td><td>${x.counts.Fail}</td><td>${x.counts.Blocked}</td><td>${x.counts['Not Run']}</td><td>${x.passRate===null?'—':x.passRate+'%'}</td><td>${x.activeBugs}</td></tr>`}).join('')||'<tr><td colspan="9" class="empty-note">프로젝트가 없습니다.</td></tr>'}</tbody></table></div></div>
 <div class="report-actions"><button type="button" class="btn primary" data-action="export-report">↓ Export report CSV</button><span>CSV는 현재 브라우저에서 생성됩니다. 개인정보를 입력하지 마세요.</span></div>${analyticsNote(a)}`;
}
function reportRows(){const a=analyticsFor(analyticsProject);return a.projects.map(p=>{const x=analyticsFor(p.key);return [p.key,p.name,x.cases.length,x.runs.length,x.counts.Pass,x.counts.Fail,x.counts.Blocked,x.counts['Not Run'],x.passRate===null?'N/A':x.passRate+'%',x.activeBugs]})}
function csvValue(value){let s=String(value??'');if(/^[\s]*[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
function reportCSV(){const head=['project_key','project_name','test_cases','tracked_runs','pass','fail','blocked','not_run','pass_rate','open_bugs'];return [head,...reportRows()].map(r=>r.map(csvValue).join(',')).join('\r\n')+'\r\n'}
function exportReport(){const blob=new Blob(['\uFEFF',reportCSV()],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='qaboard-quality-report.csv';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);toast('CSV 리포트를 저장했습니다.')}
// Stage 7: local-only backup and restore. No data is uploaded to a server.
const BACKUP_FORMAT='qaboard-backup';
const BACKUP_VERSION=1;
function validateBackup(payload){
 if(!payload||typeof payload!=='object'||Array.isArray(payload)||payload.format!==BACKUP_FORMAT||payload.version!==BACKUP_VERSION)return {ok:false,why:'지원하지 않는 백업 형식입니다.'};
 const d=payload.data;
 if(!d||typeof d!=='object'||Array.isArray(d))return {ok:false,why:'백업 데이터 구조가 올바르지 않습니다.'};
 const keys=['projects','cases','runs','bugs'];
 if(!keys.every(k=>Array.isArray(d[k])&&d[k].length<=50000&&d[k].every(x=>x&&typeof x==='object'&&!Array.isArray(x))))return {ok:false,why:'프로젝트/테스트/버그 배열을 확인해 주세요.'};
 const hasUnique=(items,key)=>items.every(item=>typeof item[key]==='string'&&item[key].length>0&&item[key].length<=100)&&new Set(items.map(item=>item[key])).size===items.length;
 if(!hasUnique(d.projects,'key')||!hasUnique(d.cases,'id')||!hasUnique(d.runs,'id')||!hasUnique(d.bugs,'id'))return {ok:false,why:'필수 ID가 없거나 중복되었습니다.'};
 if(d.runs.some(r=>r.results!==undefined&&(!Array.isArray(r.results)||r.results.length>50000||r.results.some(x=>!x||typeof x.caseId!=='string'||!['Not Run','Pass','Fail','Blocked'].includes(x.result)))))return {ok:false,why:'테스트 실행 결과 형식이 올바르지 않습니다.'};
 if(d.projects.some(p=>typeof p.name!=='string')||d.cases.some(c=>typeof c.title!=='string')||d.bugs.some(b=>typeof b.title!=='string'))return {ok:false,why:'필수 이름/제목 값이 올바르지 않습니다.'};
 return {ok:true,counts:keys.map(k=>d[k].length)};
}
function backupPayload(){return {format:BACKUP_FORMAT,version:BACKUP_VERSION,exportedAt:new Date().toISOString(),data};}
function backupDownload(){
 const body=JSON.stringify(backupPayload(),null,2);
 const url=URL.createObjectURL(new Blob([body],{type:'application/json;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='qaboard-backup-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
 toast('JSON 백업 파일을 다운로드했습니다.');
}
function openRestoreDialog(payload){
 const checked=validateBackup(payload);
 if(!checked.ok){toast(checked.why);return}
 const counts=checked.counts;
 $('#modal-root').innerHTML=`<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true" aria-label="백업 복원 확인"><h2>백업을 복원할까요?</h2><p>현재 브라우저의 모든 QABoard 데이터가 백업 내용으로 교체됩니다. 복원 전에 현재 데이터를 먼저 백업해 주세요.</p><p>프로젝트 ${counts[0]} · 케이스 ${counts[1]} · 실행 ${counts[2]} · 버그 ${counts[3]}</p><div class="modal-actions"><button class="btn" type="button" data-action="close-modal">취소</button><button class="btn primary" type="button" data-action="confirm-restore">백업으로 교체</button></div></div></div>`;
 const btn=$('[data-action="confirm-restore"]');
 btn.addEventListener('click',()=>{
  try{localStorage.setItem('qaboard-demo',JSON.stringify(payload.data));}
  catch(_e){toast('저장 공간 부족 또는 브라우저 제한으로 복원하지 못했습니다.');return;}
  data=payload.data;localDataWarning=false;
  page='dashboard';selectedProjectKey=null;selectedCaseId=null;selectedRunId=null;selectedBugId=null;analyticsProject='';analyticsDrillProject='';
  $('#modal-root').replaceChildren();render();toast('백업을 복원했습니다.');
 });
}
async function restoreFromFile(file){
 if(!file)return;
 if(file.size>5*1024*1024){toast('백업 파일은 5MB 이하여야 합니다.');return;}
 try{const parsed=JSON.parse(await file.text());openRestoreDialog(parsed);}
 catch(_e){toast('JSON 파일을 읽을 수 없습니다.');}
}
function settings(){
 const counts=[data.projects.length,data.cases.length,data.runs.length,data.bugs.length];
 return `${heading('DEMO DATA & PRIVACY','Settings & Backup','내 브라우저의 데모 데이터를 관리하고 안전하게 내보내거나 복원합니다.')}
 <div class="dashboard-grid"><div class="panel"><div class="panel-head"><h3>Local data backup</h3><span>JSON · 로컬 처리</span></div>
 <p class="settings-copy">현재 프로젝트 ${counts[0]}개 · 테스트 케이스 ${counts[1]}개 · 테스트 실행 ${counts[2]}개 · 버그 ${counts[3]}개</p>
 <p class="settings-copy">전체 데이터를 JSON 파일로 저장할 수 있어요. CSV 품질 리포트와 달리 나중에 QABoard로 복원할 수 있습니다.</p>
 <div class="settings-actions"><button type="button" class="btn primary" data-action="backup-export">↓ Backup JSON</button><button type="button" class="btn" data-action="backup-import">↑ Restore JSON</button></div></div>
 <div class="panel"><div class="panel-head"><h3>Privacy & limitations</h3><span>Portfolio demo</span></div>
 <p class="settings-copy">별도의 로그인·서버 DB·파일 업로드 API는 없습니다. 작성 내용은 사용 중인 브라우저의 localStorage에 저장됩니다.</p>
 <p class="settings-copy">실제 이름, 이메일, 전화번호, 주문 내역, 고객정보, 비밀키 등은 입력하지 마세요. 내보낸 백업에는 입력한 텍스트가 그대로 포함됩니다.</p>
 <p class="settings-copy">브라우저 저장 데이터는 기기 또는 브라우저가 달라지면 공유되지 않으며, 삭제될 수 있습니다. 중요한 데모 작업은 JSON 백업을 보관하세요.</p></div></div>
 <div class="panel table-panel"><div class="panel-head"><h3>Reset demo data</h3><span>되돌릴 수 없는 작업</span></div><p class="settings-copy">현재 브라우저 데이터를 최초 예시 데이터로 되돌립니다. 백업하지 않은 수정 내역은 사라집니다.</p><button type="button" class="btn danger-outline" data-action="reset-demo">데모 데이터 초기화</button></div>
 ${localDataWarning?'<p class="settings-warning">기존 저장 데이터가 손상되어 기본 데모로 표시 중입니다. 초기화하기 전 브라우저 저장 데이터를 별도로 확인해 주세요.</p>':''}`;
}
function resetConfirm(){
 $('#modal-root').innerHTML=`<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true" aria-label="데모 초기화 확인"><h2>정말 초기화할까요?</h2><p>모든 프로젝트, 테스트 케이스, 실행 결과 및 버그가 최초 샘플 데이터로 바뀝니다. 먼저 JSON 백업을 내려받는 것을 권장합니다.</p><div class="modal-actions"><button class="btn" data-action="close-modal">취소</button><button class="btn danger-outline" data-action="confirm-reset">모든 데이터 초기화</button></div></div></div>`;
}
function resetDemo(){
 try{localStorage.removeItem('qaboard-demo');}catch(_e){toast('브라우저 저장 데이터에 접근할 수 없습니다.');return}
 data=JSON.parse(JSON.stringify(seed));localDataWarning=false;page='dashboard';selectedProjectKey=null;selectedCaseId=null;selectedRunId=null;selectedBugId=null;analyticsProject='';analyticsDrillProject='';
 $('#modal-root').replaceChildren();render();toast('최초 데모 데이터로 초기화했습니다.');
}
function updateNavigationCounts(){
 const ids=[['#nav-project-count',data.projects.length],['#nav-case-count',data.cases.length],['#nav-bug-count',data.bugs.length]];
 for(const [id,n] of ids){const node=$(id);if(node)node.textContent=String(n)}
}
function render(){const pages={dashboard,projects,cases,runs,bugs,reports,settings,workshop,'tc-hub':tcHub,'tc-group-new':tcCollectionForm,'tc-collection':tcCollectionDetail};$('#demo-navigation').hidden=workspaceMode!=='demo';$('#tc-navigation').hidden=workspaceMode!=='tc';document.body?.classList?.toggle('tc-mode',workspaceMode==='tc');
 const workspaceLabel=$('#workspace-current');if(workspaceLabel)workspaceLabel.textContent=workspaceMode==='tc'?'Test Case':'Workspace';
 const workspaceTrigger=$('#workspace-trigger');const workspaceOptions=$('#workspace-options');
 if(workspaceTrigger)workspaceTrigger?.setAttribute?.('aria-expanded',String(workspaceMenuOpen));
 if(workspaceOptions)workspaceOptions.hidden=!workspaceMenuOpen;
 document.querySelectorAll('.workspace-option').forEach(opt=>opt.setAttribute('aria-selected',String(opt.dataset.workspace===workspaceMode)));$('#page-content').innerHTML=page==='projects'&&selectedProjectKey?projectDetail():page==='cases'&&selectedCaseId?caseDetail():page==='runs'&&selectedRunId?runDetail():page==='bugs'&&selectedBugId?bugDetail():pages[page]();$('#crumb').textContent=({dashboard:'Dashboard',projects:'Projects',cases:'Test Cases',runs:'Test Runs',bugs:'Bug Management',reports:'Reports',settings:'Settings & Backup',workshop:'세부 TC 작성','tc-hub':'Test Suites','tc-group-new':'Test Suite 만들기','tc-collection':'세부 TC 목록'})[page];document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));const tcCount=$('#nav-tc-hub-count');if(tcCount)tcCount.textContent=String(allTcGroups().length);updateNavigationCounts();bindPage()}
function toast(msg){let t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function openModal(type){let cfg={
 project:{title:'새 프로젝트 만들기',desc:'가상의 QA 프로젝트를 추가합니다.',fields:[['name','프로젝트 이름','text','예: Payment Web QA'],['key','프로젝트 키','text','예: PAY'],['release','릴리즈','text','예: v1.0.0']]},
 case:{title:'테스트 케이스 추가',desc:'개인정보가 아닌 가상 테스트 시나리오만 입력하세요.',fields:[['title','테스트 케이스 제목','text','예: 결제 실패 안내 확인'],['project','프로젝트','project',null],['suite','테스트 스위트','text','예: 결제'],['priority','우선순위','select',['Low','Medium','High']]]},
 bug:{title:'새 버그 등록',desc:'가상의 버그와 재현 정보만 입력하세요. 실제 고객정보는 금지됩니다.',fields:[['title','버그 제목','text','예: 결제 완료 후 화면 멈춤'],['project','프로젝트','select',data.projects.map(p=>p.key)],['priority','우선순위','select',['Low','Medium','High']]]},
 run:{title:'테스트 실행 생성',desc:'프로젝트의 테스트 실행 기록을 만듭니다.',fields:[['name','실행 이름','text','예: Sprint 13 Regression'],['project','프로젝트','select',data.projects.map(p=>p.key)]]}
 }[type];
 $('#modal-root').innerHTML=`<div class="modal-backdrop"><form class="modal" id="create-form"><h2>${cfg.title}</h2><p>${cfg.desc}</p>${cfg.fields.map(([id,label,kind,opts])=>`<label class="field"><span>${label}</span>${kind==='project'?`<select name="project">${projectOptions()}</select>`:kind==='select'?`<select name="${id}">${opts.map(o=>`<option>${o}</option>`).join('')}</select>`:`<input name="${id}" type="text" placeholder="${opts}" required maxlength="100" />`}</label>`).join('')}${type==='bug'?`<label class="field"><span>담당자 (가상 별칭)</span><select name="owner">${DEMO_OWNERS.map(x=>`<option>${x}</option>`).join('')}</select></label><label class="field"><span>버그 설명 (선택)</span><textarea name="description" maxlength="1000" rows="3" placeholder="발생한 증상을 입력하세요"></textarea></label><label class="field"><span>재현 단계 (선택)</span><textarea name="steps" maxlength="1000" rows="3" placeholder="1. 화면 열기  2. 버튼 클릭"></textarea></label>`:''}<div class="modal-actions"><button type="button" class="btn" data-action="close-modal">취소</button><button class="btn primary" type="submit">등록하기</button></div></form></div>`;
 $('#create-form').addEventListener('submit',e=>{e.preventDefault();let fd=new FormData(e.target),v=Object.fromEntries(fd.entries());if(type==='project'){let key=v.key.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);if(data.projects.some(p=>p.key===key)){toast('이미 사용 중인 프로젝트 키입니다.');return}data.projects.unshift({key,name:v.name,release:v.release,status:'Active',progress:0,cases:0,bugs:0})}if(type==='case'){if(v.project&&!data.projects.some(p=>p.key===v.project)){toast('유효한 프로젝트를 선택해 주세요.');return}data.cases.unshift({id:'TC-'+String(Math.max(24,...data.cases.map(c=>Number(c.id.replace('TC-',''))||0))+1).padStart(3,'0'),title:v.title,suite:v.suite,priority:v.priority,project:v.project,status:'Blocked'})};if(type==='bug'){if(!v.title.trim()||!data.projects.some(p=>p.key===v.project)){toast('버그 제목과 프로젝트를 확인하세요.');return}const bug={id:nextBugId(),title:v.title.trim(),project:v.project,priority:v.priority,status:'Open',owner:v.owner||DEMO_OWNERS[0],description:(v.description||'').trim(),steps:(v.steps||'').trim()};recordBugChange(bug,'버그 생성');data.bugs.unshift(bug)}if(type==='run'){
 const linked=data.cases.filter(c=>c.project===v.project);
 if(linked.length===0){toast('선택한 프로젝트에 연결된 테스트 케이스가 없습니다. Test Cases에서 먼저 연결해 주세요.');return}
 const next=Math.max(8,...data.runs.map(r=>Number(String(r.id).replace('RUN-',''))||0))+1;
 const run={id:'RUN-'+String(next).padStart(3,'0'),name:v.name.trim(),project:v.project,date:new Date().toISOString().slice(0,10),results:linked.map(c=>({caseId:c.id,title:c.title,result:'Not Run'}))};
 data.runs.unshift(run);
 selectedRunId=run.id;
 }save();$('#modal-root').innerHTML='';render();toast('데모 데이터가 추가되었습니다.')});
}
function bindPage(){
 const collectionForm=$('#tc-collection-form');
 if(collectionForm)collectionForm.addEventListener('submit',e=>{
  e.preventDefault();const values=Object.fromEntries(new FormData(e.currentTarget).entries());
  const existing=selectedTcCollectionEdit?tcGroupById(selectedTcCollectionId):null;
  const project=existing?.project||values.project;
  if(!String(values.name||'').trim()||!data.projects.some(p=>p.key===project)){toast('묶음 이름과 프로젝트를 확인하세요.');return}
  if(existing){existing.name=values.name.trim();existing.suite=String(values.suite||'').trim();existing.priority=values.priority;}
  else{const created={id:nextTcGroupId(),name:values.name.trim(),project,suite:String(values.suite||'').trim(),priority:values.priority};tcCollections().push(created);selectedTcCollectionId=created.id;}
  selectedTcCollectionEdit=false;save();page='tc-collection';render();toast('Test Suite를 저장했습니다.');
 });
 const w=$('#tc-workshop-form');if(w)w.addEventListener('submit',e=>{e.preventDefault();workshopSubmit('publish')});
 const hubSearch=$('#tc-hub-search');if(hubSearch)hubSearch.addEventListener('input',e=>{const pos=e.target.selectionStart;tcHubQuery=e.target.value;render();const next=$('#tc-hub-search');next?.focus();next?.setSelectionRange(pos,pos)});
 const hubFilter=$('#tc-hub-project');if(hubFilter)hubFilter.addEventListener('change',e=>{tcHubProject=e.target.value;tcHubFocusedProject='';render()});
 let cs=$('#case-search');if(cs)cs.addEventListener('input',filterCases);
 let cf=$('#case-filter');if(cf)cf.addEventListener('change',filterCases);
 let ap=$('#analytics-project');if(ap)ap.addEventListener('change',e=>{analyticsProject=e.target.value;render()});
 let cpf=$('#case-project-filter');if(cpf)cpf.addEventListener('change',filterCases);
 let projectView=$('#project-view-filter');if(projectView)projectView.addEventListener('change',e=>{projectListFilter=e.target.value;initialProjectStatus='';selectedProjectKey=null;render()});
 let bview=$('#bug-view-filter');if(bview)bview.addEventListener('change',e=>{bugListView=e.target.value;initialBugStatus='';render()});
 let bs=$('#bug-search');if(bs)bs.addEventListener('input',filterBugs);
 let bf=$('#bug-filter');if(bf)bf.addEventListener('change',filterBugs);
 for(const id of ['bug-priority-filter','bug-project-filter']){const el=$('#'+id);if(el)el.addEventListener('change',filterBugs)}
}
function openStats(action){
 selectedProjectKey=null;selectedCaseId=null;selectedBugId=null;
 initialCaseStatus='';initialBugStatus='';initialProjectStatus='';analyticsDrillProject=analyticsProject;
 if(action==='project-all'){page='projects';projectListFilter='all';analyticsDrillProject=''}
 else if(action==='project-active'){page='projects';projectListFilter='active';analyticsDrillProject=''}
 else if(action==='project-cases'){activateWorkspace('tc');return}
 else if(action==='project-bugs'){page='bugs';bugListView='active';analyticsDrillProject=''}
 else if(action==='dashboard-runs'){page='runs';selectedRunId=null;analyticsDrillProject=''}
 else if(action==='dashboard-bugs'){page='bugs';bugListView='active';selectedBugId=null;analyticsDrillProject=''}
 else if(action==='cases'){activateWorkspace('tc');tcHubProject=analyticsProject;render();return}
 else if(action==='passed-cases'){page='cases';initialCaseStatus='Pass'}
 else if(action==='open-bugs'){page='bugs';initialBugStatus='active'}
 else if(action==='active-projects'){page='projects';projectListFilter='active';initialProjectStatus=''}
 else if(action==='reports'){page='reports'}
 render();
}
// All overview rows with a detail destination can be opened by clicking anywhere in the row.
// Ignore real controls (selects/buttons/links) to preserve dropdowns and actions.
function openDetailRow(row){
 const kind=row?.dataset.rowDetail,id=row?.dataset.rowId;
 if(!id)return;
 if(kind==='project'){selectedProjectKey=id;page='projects';initialProjectStatus='';analyticsDrillProject='';}
 else if(kind==='case'){selectedCaseId=id;page='cases';}
 else if(kind==='run'){selectedRunId=id;page='runs';}
 else if(kind==='bug'){selectedBugId=id;page='bugs';}
 else if(kind==='tc-detail'){openTcForm(id);return;}
 else return;
 render();
}
document.addEventListener('click',event=>{
 if(event.target.closest('button,a,input,select,textarea,label,[role="button"]'))return;
 const row=event.target.closest('.detail-click-row[data-row-detail]');
 if(row)openDetailRow(row);
});
document.addEventListener('keydown',event=>{
 if(event.key!=='Enter'&&event.key!==' ')return;
 if(event.target.matches('button,a,input,select,textarea'))return;
 const row=event.target.closest('.detail-click-row[data-row-detail]');
 if(!row)return;
 event.preventDefault();openDetailRow(row);
});
// Suite table rows open on click, Enter, or Space for keyboard accessibility.
document.addEventListener('keydown',event=>{
 const row=event.target.closest?.('.tc-suite-row[data-tc-group]');
 if(!row || (event.key!=='Enter' && event.key!==' '))return;
 event.preventDefault();
 selectedTcCollectionId=row.dataset.tcGroup;
 selectedTcCollectionEdit=false;
 page='tc-collection';render();
});
// One delegated handler works for buttons added AFTER the page was rendered.
document.addEventListener('click',e=>{
 const suiteJump=e.target.closest('[data-open-project-suites]');
 if(suiteJump){const key=suiteJump.dataset.openProjectSuites;const project=data.projects.find(p=>p.key===key);if(!project)return;workspaceMode='tc';workspaceMenuOpen=false;tcHubProject=project.status==='Completed'?'completed':'active';tcHubFocusedProject=key;tcHubQuery='';selectedProjectKey=null;selectedTcCollectionId=null;page='tc-hub';render();return}
 const tcGroupButton=e.target.closest('[data-tc-group]');
 if(tcGroupButton){selectedTcCollectionId=tcGroupButton.dataset.tcGroup;selectedTcCollectionEdit=false;page='tc-collection';render();return}
 const tcEdit=e.target.closest('[data-tc-hub-edit]');if(tcEdit){openTcForm(tcEdit.dataset.tcHubEdit);return}
 const workshopAction=e.target.closest('[data-workshop-action]');
 if(workshopAction){if(workshopAction.dataset.workshopAction==='clear'){selectedWorkshopDraftId=null;selectedHubEditCaseId=null;render()}else workshopSubmit(workshopAction.dataset.workshopAction);return}
 const editDraft=e.target.closest('[data-workshop-edit]');if(editDraft){openTcForm(null,editDraft.dataset.workshopEdit);return}
 const deleteDraft=e.target.closest('[data-workshop-delete]');if(deleteDraft){data.tcDrafts=tcDrafts().filter(d=>d.id!==deleteDraft.dataset.workshopDelete);if(selectedWorkshopDraftId===deleteDraft.dataset.workshopDelete)selectedWorkshopDraftId=null;save();render();toast('임시 저장 TC를 삭제했습니다.');return}
 const stat=e.target.closest('[data-stat-action]');if(stat){openStats(stat.dataset.statAction);return}
 const linkedBug=e.target.closest('button[data-linked-bug]');
 if(linkedBug){selectedBugId=linkedBug.dataset.linkedBug;selectedRunId=null;page='bugs';render();return}
 const unlink=e.target.closest('button[data-unlink-bug]');
 if(unlink){const r=data.runs.find(x=>x.id===unlink.dataset.unlinkBug);const item=r?.results?.find(x=>x.caseId===unlink.dataset.unlinkCase);if(item){const previous=data.bugs.find(b=>b.id===item.bugId);if(previous)recordBugChange(previous,'테스트 연결 해제: '+r.id+' / '+item.caseId);delete item.bugId;save();render();toast('버그 연결이 해제되었습니다.')}return}
 const link=e.target.closest('button[data-link-bug]');
 if(link){openLinkBug(link.dataset.linkBug,link.dataset.linkCase);return}
 const confirmedDelete=e.target.closest('button[data-confirm-delete-bug]');
 if(confirmedDelete){const id=confirmedDelete.dataset.confirmDeleteBug;$('#modal-root').replaceChildren();deleteBugConfirmed(id);return}
 const bugButton=e.target.closest('button[data-bug-id]');
 if(bugButton){selectedBugId=bugButton.dataset.bugId;page='bugs';render();return}
 const caseButton=e.target.closest('button[data-case-id]');
 if(caseButton){selectedCaseId=caseButton.dataset.caseId;page='cases';render();return}
 const runButton=e.target.closest('button[data-run-id]:not(.run-result)');
 if(runButton){selectedRunId=runButton.dataset.runId;page='runs';render();return}
 const project=e.target.closest('[data-project-key]');
 if(project){selectedProjectKey=project.dataset.projectKey;page='projects';initialProjectStatus='';analyticsDrillProject='';render();return}
 const action=e.target.closest('[data-action]');
 if(action){const a=action.dataset.action;
  if(a==='close-modal'){$('#modal-root').replaceChildren();return}
  if(a==='clear-tc-project-focus'){tcHubFocusedProject='';render();return}
  if(a==='tc-new'){selectedTcCollectionId=null;selectedTcCollectionEdit=false;page='tc-group-new';render();return}
  if(a==='tc-add-detail'){if(!tcGroupInfo(selectedTcCollectionId)?.project){toast('프로젝트를 먼저 연결해 주세요.');return}openTcForm();return}
  if(a==='tc-edit-group'){selectedTcCollectionEdit=true;page='tc-group-new';render();return}
  if(a==='tc-back-detail'){selectedHubEditCaseId=null;selectedWorkshopDraftId=null;page='tc-collection';render();return}
  if(a==='tc-back'){selectedHubEditCaseId=null;selectedWorkshopDraftId=null;selectedTcCollectionId=null;selectedTcCollectionEdit=false;page='tc-hub';render();return}
  if(a==='clear-project-filter'){projectListFilter='all';initialProjectStatus='';render();return}
  if(a==='export-report'){exportReport();return}
  if(a==='backup-export'){backupDownload();return}
  if(a==='backup-import'){$('#backup-file').value='';$('#backup-file').click();return}
  if(a==='reset-demo'){resetConfirm();return}
  if(a==='confirm-reset'){resetDemo();return}
  if(a==='edit-project'){openEditProject();return}
  if(a==='edit-bug'){openEditBug();return}
  if(a==='delete-bug'){openDeleteBug();return}
  if(a==='back-bugs'){selectedBugId=null;render();return}
  if(a==='edit-case'){openEditCase();return}
  if(a==='back-cases'){selectedCaseId=null;render();return}
  if(a==='back-runs'){selectedRunId=null;render();return}
  if(a==='back-projects'){selectedProjectKey=null;render();return}
  if(a.startsWith('new-')){if(a==='new-run')selectedRunId=null;openModal(a.slice(4));return}
 }
});
document.querySelector('#backup-file').addEventListener('change',e=>restoreFromFile(e.target.files?.[0]));
document.addEventListener('keydown',e=>{
 if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-stat-action]')){e.preventDefault();openStats(e.target.dataset.statAction)}
 if(e.key==='Escape'&&$('#modal-root').children.length){$('#modal-root').replaceChildren()}
});
document.addEventListener('change',e=>{
 const runSelect=e.target.closest('select.run-result');
 if(runSelect){
  const run=data.runs.find(r=>r.id===runSelect.dataset.runId);
  const entry=run?.results?.find(r=>r.caseId===runSelect.dataset.caseId);
  if(!entry||!['Not Run','Pass','Fail','Blocked'].includes(runSelect.value))return;
  entry.result=runSelect.value;
  save();render();toast('테스트 실행 결과가 저장되었습니다.');return;
 }
 const select=e.target.closest('.bug-status');if(!select)return;
 const b=data.bugs.find(x=>x.id===select.dataset.id);
 if(!b)return;
 if(updateBugStatus(b,select.value)){save();render();toast(`${b.id} 상태가 변경되었습니다.`)}
});
function filterCases(){let q=$('#case-search').value.toLowerCase(),s=$('#case-filter').value,project=$('#case-project-filter').value;$('#case-rows').innerHTML=caseRows(data.cases.filter(c=>(c.id+c.title+c.suite+projectLabel(c.project)).toLowerCase().includes(q)&&(!s||c.status===s)&&matchesProjectStage(c.project,project)))}
function filterBugs(){
 const q=$('#bug-search').value.trim().toLocaleLowerCase(),status=$('#bug-filter').value,priority=$('#bug-priority-filter').value,project=$('#bug-project-filter').value;
 const filtered=bugVisibilityRows().filter(b=>[b.id,b.title,b.project,projectLabel(b.project),b.description||'',b.steps||'',b.owner].some(v=>String(v).toLocaleLowerCase().includes(q))&&(!status||(status==='active'?['Open','In Progress'].includes(b.status):b.status===status))&&(!priority||b.priority===priority)&&matchesProjectStage(b.project,project));
 $('#bug-rows').innerHTML=bugRows(filtered);$('#bug-result-count').textContent=filtered.length+' bugs';
}

function closeWorkspaceMenu(){workspaceMenuOpen=false;$('#workspace-options').hidden=true;$('#workspace-trigger').setAttribute('aria-expanded','false')}
function activateWorkspace(mode){
 workspaceMode=mode==='tc'?'tc':'demo';workspaceMenuOpen=false;
 page=workspaceMode==='tc'?'tc-hub':'dashboard';
 selectedTcCollectionId=null;selectedTcCollectionEdit=false;tcHubFocusedProject='';tcHubProject='active';
 selectedHubEditCaseId=null;selectedWorkshopDraftId=null;selectedProjectKey=null;selectedCaseId=null;selectedRunId=null;selectedBugId=null;render();
}
$('#workspace-trigger').addEventListener('click',()=>{workspaceMenuOpen=!workspaceMenuOpen;$('#workspace-options').hidden=!workspaceMenuOpen;$('#workspace-trigger').setAttribute('aria-expanded',String(workspaceMenuOpen))});
$('#workspace-options').addEventListener('click',e=>{const choice=e.target.closest('[data-workspace]');if(choice)activateWorkspace(choice.dataset.workspace)});
document.addEventListener('click',e=>{if(workspaceMenuOpen&&!e.target.closest('#workspace-switch'))closeWorkspaceMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&workspaceMenuOpen){closeWorkspaceMenu();$('#workspace-trigger').focus()}if(workspaceMenuOpen&&['ArrowDown','ArrowUp'].includes(e.key)&&e.target.closest('#workspace-switch')){e.preventDefault();const options=[...document.querySelectorAll('.workspace-option')];const i=options.indexOf(document.activeElement);options[(i+(e.key==='ArrowDown'?1:-1)+options.length)%options.length]?.focus()}if(workspaceMenuOpen&&(e.key==='Enter'||e.key===' ')&&e.target.id==='workspace-trigger'){e.preventDefault();document.querySelector('.workspace-option[aria-selected="true"]')?.focus()}});
$('#tc-nav').addEventListener('click',e=>{const btn=e.target.closest('[data-page]');if(!btn)return;if(btn.dataset.page==='workshop')openTcForm();else{selectedHubEditCaseId=null;selectedWorkshopDraftId=null;page='tc-hub';render()}});
// Route ALL Demo Workspace navigation buttons, including Reports and Settings & Backup.
// These two buttons are siblings of #navigation, but children of #demo-navigation.
$('#demo-navigation').addEventListener('click',e=>{
 const button=e.target.closest('button.nav-item[data-page]');
 if(!button||!e.currentTarget.contains(button))return;
 const nextPage=button.dataset.page;
 if(!['dashboard','projects','cases','runs','bugs','reports','settings'].includes(nextPage))return;
 page=nextPage;
 selectedProjectKey=null;selectedCaseId=null;selectedRunId=null;selectedBugId=null;
 initialCaseStatus='';initialBugStatus='';initialProjectStatus='';analyticsDrillProject='';
 render();
});
render();
