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
let data = JSON.parse(localStorage.getItem('qaboard-demo')||'null') || seed;
let page='dashboard';
let selectedProjectKey=null;
let selectedCaseId=null;
let selectedRunId=null;
let selectedBugId=null;
let initialCaseStatus='';
let initialBugStatus='';
let initialProjectStatus='';
const $=s=>document.querySelector(s);
const save=()=>localStorage.setItem('qaboard-demo',JSON.stringify(data));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const projectLabel=key=>data.projects.find(p=>p.key===key)?.name||'미연결';
// Linked case counts are derived from actual case associations, never from legacy sample counters.
const linkedCasesFor=key=>data.cases.filter(c=>c.project===key).length;
const linkedCaseTotal=()=>data.cases.filter(c=>data.projects.some(p=>p.key===c.project)).length;
const projectOptions=(selected='')=>`<option value="" ${!selected?'selected':''}>프로젝트 미지정</option>`+data.projects.map(p=>`<option value="${esc(p.key)}" ${selected===p.key?'selected':''}>${esc(p.name)} (${esc(p.key)})</option>`).join('');

const statusClass=s=>({'Active':'active','Pass':'pass','Fail':'fail','Blocked':'blocked','Open':'fail','In Progress':'review','Resolved':'pass','Closed':'low','Completed':'pass','Review':'review'}[s]||'low');
const pill=s=>`<span class="status ${statusClass(s)}">${s}</span>`;
function heading(kicker,title,desc,action=''){return `<div class="page-heading"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${desc}</p></div>${action}</div>`}
function stats(items){return `<div class="stats">${items.map(x=>`<div class="stat-card ${x.action?'stat-clickable':''}" ${x.action?`data-stat-action="${x.action}" role="button" tabindex="0" aria-label="${x.label} 상세 보기"`: ''}><div class="stat-top">${x.label}<span class="stat-icon">${x.icon}</span></div><div class="stat-value">${x.value}</div><div class="stat-foot">${x.foot}</div></div>`).join('')}</div>`}
function projectTable(rows=data.projects){return `<div class="panel table-panel"><div class="panel-head"><h3>Project overview</h3><span>${rows.length} projects · 연결된 케이스 기준</span></div><div class="table-wrap"><table><thead><tr><th>PROJECT</th><th>RELEASE</th><th>LINKED TEST CASES</th><th>PROGRESS</th><th>BUGS</th><th>STATUS</th><th>DETAILS</th></tr></thead><tbody>${rows.map(p=>`<tr><td class="project-name">${esc(p.name)}<div class="muted">${esc(p.key)}</div></td><td>${esc(p.release)}</td><td>${linkedCasesFor(p.key)}</td><td><div style="display:flex;align-items:center;gap:8px"><div class="progress-track" style="width:75px"><div class="progress-fill" style="width:${Number(p.progress)||0}%"></div></div>${Number(p.progress)||0}%</div></td><td>${data.bugs.filter(b=>b.project===p.key).length}</td><td>${pill(p.status)}</td><td><button class="btn" data-project-key="${esc(p.key)}">상세 보기 →</button></td></tr>`).join('')}</tbody></table></div></div>`}
function projectDetail(){const p=data.projects.find(x=>x.key===selectedProjectKey);if(!p){selectedProjectKey=null;return projects()}return `${heading('PROJECT DETAILS',esc(p.name),'프로젝트 정보와 진행 상황을 확인하고 수정할 수 있습니다.','<button class="btn primary" data-action="edit-project">✎ Edit project</button>')}<button class="btn" data-action="back-projects" style="margin-bottom:16px">← 프로젝트 목록으로</button><div class="dashboard-grid"><div class="panel"><div class="panel-head"><h3>Project information</h3>${pill(p.status)}</div><div class="detail-row"><span>프로젝트 키</span><strong>${esc(p.key)}</strong></div><div class="detail-row"><span>프로젝트 이름</span><strong>${esc(p.name)}</strong></div><div class="detail-row"><span>릴리즈</span><strong>${esc(p.release)}</strong></div><div class="detail-row"><span>상태</span><strong>${pill(p.status)}</strong></div></div><div class="panel"><div class="panel-head"><h3>QA progress</h3><span>수동 설정 진행률</span></div><div class="stat-value">${Number(p.progress)||0}%</div><div class="progress-track"><div class="progress-fill" style="width:${Number(p.progress)||0}%"></div></div><div class="detail-row"><span>연결된 테스트 케이스</span><strong>${linkedCasesFor(p.key)}</strong></div><div class="detail-row"><span>등록된 버그</span><strong>${data.bugs.filter(b=>b.project===p.key).length}</strong></div></div></div>`}
function openEditProject(){const p=data.projects.find(x=>x.key===selectedProjectKey);if(!p)return;$('#modal-root').innerHTML=`<div class="modal-backdrop"><form class="modal" id="edit-project-form"><h2>프로젝트 수정</h2><p>프로젝트 키는 변경하지 않습니다. 가상 프로젝트 정보만 입력하세요.</p><label class="field"><span>프로젝트 키 (변경 불가)</span><input value="${esc(p.key)}" disabled /></label><label class="field"><span>프로젝트 이름</span><input name="name" value="${esc(p.name)}" maxlength="100" required /></label><label class="field"><span>릴리즈</span><input name="release" value="${esc(p.release)}" maxlength="40" required /></label><label class="field"><span>상태</span><select name="status">${['Active','Review','Completed'].map(v=>`<option ${p.status===v?'selected':''}>${v}</option>`).join('')}</select></label><label class="field"><span>진행률 (0–100%)</span><input name="progress" type="number" min="0" max="100" step="1" value="${Number(p.progress)||0}" required /></label><div class="modal-actions"><button type="button" class="btn" data-action="close-modal">취소</button><button type="submit" class="btn primary">변경 저장</button></div></form></div>`;$('#edit-project-form').addEventListener('submit',e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.currentTarget).entries());const progress=Number(v.progress);if(!v.name.trim()||!v.release.trim()||!Number.isInteger(progress)||progress<0||progress>100){toast('입력값을 확인해 주세요.');return}p.name=v.name.trim();p.release=v.release.trim();p.status=v.status;p.progress=progress;save();$('#modal-root').innerHTML='';render();toast('프로젝트 변경 사항을 저장했습니다.')})}

function dashboard(){let total=data.cases.length,pass=data.cases.filter(x=>x.status==='Pass').length,open=data.bugs.filter(x=>x.status==='Open'||x.status==='In Progress').length;return `${heading('OVERVIEW','Good morning, QA Tester 👋','프로젝트 품질 현황을 한눈에 확인하세요.','<button class="btn primary" data-action="new-bug">＋ Create bug</button>')}${stats([{label:'Total test cases',value:total,icon:'☷',foot:'등록된 샘플 테스트 케이스',action:'cases'},{label:'Pass rate',value:Math.round(pass/Math.max(total,1)*100)+'%',icon:'✓',foot:'현재 테스트 케이스 기준',action:'passed-cases'},{label:'Open bugs',value:open,icon:'⚑',foot:'확인 및 조치가 필요한 버그',action:'open-bugs'},{label:'Active projects',value:data.projects.filter(x=>x.status==='Active').length,icon:'◫',foot:'진행 중인 프로젝트',action:'active-projects'}])}<div class="dashboard-grid"><div class="panel"><div class="panel-head"><h3>Project test progress</h3><span>All projects</span></div>${data.projects.map(p=>`<div class="progress-row"><strong>${p.key}</strong><div class="progress-track"><div class="progress-fill" style="width:${p.progress}%"></div></div><em>${p.progress}%</em></div>`).join('')}<div class="legend"><span><i style="background:#4eaa85"></i>Completed</span><span><i style="background:#edf1ef"></i>Remaining</span></div></div><div class="panel"><div class="panel-head"><h3>Recent activity</h3><span>Latest updates</span></div><div class="activity"><div class="activity-dot">✓</div><div><strong>TC-024 테스트 통과</strong><small>E-commerce Web QA · 방금 전</small></div></div><div class="activity"><div class="activity-dot">⚑</div><div><strong>BUG-105 신규 등록</strong><small>장바구니 수량 변경 이슈 · 1시간 전</small></div></div><div class="activity"><div class="activity-dot">▷</div><div><strong>RUN-008 테스트 실행 중</strong><small>Sprint 12 Smoke Test · 어제</small></div></div></div></div>${projectTable()}`}
function projects(){return `${heading('WORKSPACE','Projects','프로젝트와 릴리즈별 QA 진행 상황을 관리합니다.','<button class="btn primary" data-action="new-project">＋ New project</button>')}${stats([{label:'All projects',value:data.projects.length,icon:'◫',foot:'전체 데모 프로젝트'},{label:'In progress',value:data.projects.filter(p=>p.status==='Active').length,icon:'◷',foot:'진행 중인 프로젝트'},{label:'Test cases',value:linkedCaseTotal(),icon:'☷',foot:'실제로 프로젝트에 연결된 케이스'},{label:'Tracked bugs',value:data.bugs.length,icon:'⚑',foot:'프로젝트별 버그 합계'}])}${projectTable(initialProjectStatus?data.projects.filter(p=>p.status===initialProjectStatus):data.projects)}`}
function cases(){return `${heading('TEST MANAGEMENT','Test Cases','테스트 시나리오와 실행 기준을 관리합니다.','<button class="btn primary" data-action="new-case">＋ Add test case</button>')}<div class="toolbar"><input class="search" id="case-search" placeholder="⌕  테스트 케이스 검색..." /><select class="filter" id="case-filter"><option value="">All status</option><option ${initialCaseStatus==='Pass'?'selected':''}>Pass</option><option>Fail</option><option>Blocked</option></select><select class="filter" id="case-project-filter"><option value="">모든 프로젝트</option><option value="unassigned">미연결 케이스</option>${data.projects.map(p=>`<option value="${esc(p.key)}">${esc(p.name)} (${esc(p.key)})</option>`).join('')}</select></div><div class="panel"><div class="table-wrap"><table><thead><tr><th>CASE ID</th><th>TITLE</th><th>PROJECT</th><th>TEST SUITE</th><th>PRIORITY</th><th>LAST RESULT</th><th>DETAILS</th></tr></thead><tbody id="case-rows">${caseRows(initialCaseStatus?data.cases.filter(c=>c.status===initialCaseStatus):data.cases)}</tbody></table></div></div>`}
function caseRows(rows){return rows.length?rows.map(c=>`<tr><td class="case-id">${esc(c.id)}</td><td class="project-name">${esc(c.title)}</td><td>${esc(projectLabel(c.project))}</td><td>${esc(c.suite)}</td><td>${pill(c.priority)}</td><td>${pill(c.status)}</td><td><button type="button" class="btn" data-case-id="${esc(c.id)}">상세 보기 →</button></td></tr>`).join(''):'<tr><td colspan="7" class="empty-note">검색 결과가 없습니다.</td></tr>'}
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
 <div class="panel"><p class="muted" style="padding:0 16px;font-size:11px">QA RESULT는 케이스 결과 요약(Pass / Fail / Blocked / Partial / Not Run), RUN STATUS는 실행 진행 상태(In Progress / Completed)입니다. 이전 샘플 실행은 Sample로 표시합니다.</p><div class="table-wrap"><table><thead><tr><th>RUN ID</th><th>TEST RUN</th><th>PROJECT</th><th>DATE</th><th>PASS / FAIL / BLOCKED</th><th>QA RESULT</th><th>RUN STATUS</th><th>DETAILS</th></tr></thead><tbody>${data.runs.map(r=>{const n=runCounts(r);return `<tr><td class="case-id">${esc(r.id)}</td><td class="project-name">${esc(r.name)}</td><td>${esc(r.project)}</td><td>${esc(r.date)}</td><td><span class="positive">${n.passed}</span> / <span style="color:#c85c5c">${n.failed}</span> / ${n.blocked}</td><td>${outcomePill(r)}</td><td>${pill(runState(r))}</td><td><button class="btn" data-run-id="${esc(r.id)}">상세 보기 →</button></td></tr>`}).join('')}</tbody></table></div></div>`}
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
function bugs(){
 const active=data.bugs.filter(b=>['Open','In Progress'].includes(b.status)).length;
 return `${heading('ISSUE TRACKING','Bug Management','버그 등록, 수정, 상태 추적 및 실패 테스트 연결을 관리합니다.','<button class="btn primary" data-action="new-bug">＋ Create bug</button>')}
 ${stats([{label:'Total bugs',value:data.bugs.length,icon:'⚑',foot:'등록된 버그'},{label:'Open / In Progress',value:active,icon:'◷',foot:'조치가 필요한 버그'},{label:'Resolved / Closed',value:data.bugs.length-active,icon:'✓',foot:'처리된 버그'},{label:'Linked test results',value:data.runs.reduce((sum,r)=>sum+(Array.isArray(r.results)?r.results.filter(x=>x.bugId&&data.bugs.some(b=>b.id===x.bugId)).length:0),0),icon:'☷',foot:'Test Run에서 연결된 결과'}])}
 <div class="toolbar bug-toolbar"><input class="search" id="bug-search" aria-label="버그 검색" placeholder="⌕  ID·제목·설명·담당자 검색..." />
 <select class="filter" id="bug-filter" aria-label="버그 상태 필터"><option value="">모든 상태</option><option ${initialBugStatus==='active'?'selected':''} value="active">Open + In Progress</option>${BUG_STATES.map(x=>`<option value="${x}">${x}</option>`).join('')}</select>
 <select class="filter" id="bug-priority-filter" aria-label="우선순위 필터"><option value="">모든 우선순위</option>${BUG_PRIORITIES.map(x=>`<option>${x}</option>`).join('')}</select>
 <select class="filter" id="bug-project-filter" aria-label="프로젝트 필터"><option value="">모든 프로젝트</option>${data.projects.map(p=>`<option value="${esc(p.key)}">${esc(p.name)} (${esc(p.key)})</option>`).join('')}</select></div>
 <div class="panel"><div class="panel-head"><h3>Bug list</h3><span id="bug-result-count">${data.bugs.length} bugs</span></div><div class="table-wrap"><table><thead><tr><th>BUG ID</th><th>SUMMARY</th><th>PROJECT</th><th>PRIORITY</th><th>ASSIGNEE</th><th>STATUS</th><th>LINKED TESTS</th><th>CHANGE</th><th>DETAILS</th></tr></thead><tbody id="bug-rows">${bugRows(initialBugStatus==='active'?data.bugs.filter(b=>['Open','In Progress'].includes(b.status)):data.bugs)}</tbody></table></div></div>`;
}
function bugRows(rows){return rows.length?rows.map(b=>`<tr><td class="bug-id">${esc(b.id)}</td><td class="project-name">${esc(b.title)}</td><td>${esc(b.project)}</td><td>${pill(b.priority)}</td><td>${esc(b.owner)}</td><td>${pill(b.status)}</td><td>${bugLinks(b.id).length}</td><td><select class="filter bug-status" data-id="${esc(b.id)}" aria-label="${esc(b.id)} 상태 변경">${BUG_STATES.map(state=>`<option ${state===b.status?'selected':''}>${state}</option>`).join('')}</select></td><td><button type="button" class="btn" data-bug-id="${esc(b.id)}">상세 보기 →</button></td></tr>`).join(''):'<tr><td colspan="9" class="empty-note">조건에 맞는 버그가 없습니다.</td></tr>'}

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

function reports(){let passed=data.cases.filter(c=>c.status==='Pass').length,failed=data.cases.filter(c=>c.status==='Fail').length,blocked=data.cases.filter(c=>c.status==='Blocked').length;return `${heading('INSIGHTS','Reports','테스트 결과와 버그 현황을 요약합니다.')} ${stats([{label:'Pass',value:passed,icon:'✓',foot:'통과한 테스트 케이스'},{label:'Fail',value:failed,icon:'!',foot:'실패한 테스트 케이스'},{label:'Blocked',value:blocked,icon:'Ⅱ',foot:'실행이 차단된 케이스'},{label:'Pass rate',value:Math.round(passed/Math.max(data.cases.length,1)*100)+'%',icon:'◉',foot:'전체 케이스 대비 통과율'}])}<div class="dashboard-grid"><div class="panel"><div class="panel-head"><h3>Test result distribution</h3><span>Sample data</span></div><div class="chart-bars">${[['Pass',passed],['Fail',failed],['Blocked',blocked]].map(([n,v])=>`<div class="chart-col"><em>${v}</em><div class="chart-bar" style="height:${Math.max(5,v/Math.max(data.cases.length,1)*100)}%"></div><small>${n}</small></div>`).join('')}</div></div><div class="panel"><div class="panel-head"><h3>Bug status summary</h3><span>All projects</span></div>${['Open','In Progress','Resolved','Closed'].map(s=>`<div class="progress-row"><strong>${s}</strong><div class="progress-track"><div class="progress-fill" style="width:${data.bugs.filter(b=>b.status===s).length/Math.max(data.bugs.length,1)*100}%"></div></div><em>${data.bugs.filter(b=>b.status===s).length}</em></div>`).join('')}</div></div>`}
function render(){const pages={dashboard,projects,cases,runs,bugs,reports};$('#page-content').innerHTML=page==='projects'&&selectedProjectKey?projectDetail():page==='cases'&&selectedCaseId?caseDetail():page==='runs'&&selectedRunId?runDetail():page==='bugs'&&selectedBugId?bugDetail():pages[page]();$('#crumb').textContent=({dashboard:'Dashboard',projects:'Projects',cases:'Test Cases',runs:'Test Runs',bugs:'Bug Management',reports:'Reports'})[page];document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));bindPage()}
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
 let cs=$('#case-search');if(cs)cs.addEventListener('input',filterCases);
 let cf=$('#case-filter');if(cf)cf.addEventListener('change',filterCases);
 let cpf=$('#case-project-filter');if(cpf)cpf.addEventListener('change',filterCases);
 let bs=$('#bug-search');if(bs)bs.addEventListener('input',filterBugs);
 let bf=$('#bug-filter');if(bf)bf.addEventListener('change',filterBugs);
 for(const id of ['bug-priority-filter','bug-project-filter']){const el=$('#'+id);if(el)el.addEventListener('change',filterBugs)}
}
function openStats(action){
 selectedProjectKey=null;selectedCaseId=null;selectedBugId=null;
 initialCaseStatus='';initialBugStatus='';initialProjectStatus='';
 if(action==='cases'){page='cases'}
 else if(action==='passed-cases'){page='cases';initialCaseStatus='Pass'}
 else if(action==='open-bugs'){page='bugs';initialBugStatus='active'}
 else if(action==='active-projects'){page='projects';initialProjectStatus='Active'}
 render();
}
// One delegated handler works for buttons added AFTER the page was rendered.
document.addEventListener('click',e=>{
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
 const runButton=e.target.closest('[data-run-id].btn');
 if(runButton){selectedRunId=runButton.dataset.runId;page='runs';render();return}
 const project=e.target.closest('[data-project-key]');
 if(project){selectedProjectKey=project.dataset.projectKey;page='projects';initialProjectStatus='';render();return}
 const action=e.target.closest('[data-action]');
 if(action){const a=action.dataset.action;
  if(a==='close-modal'){$('#modal-root').replaceChildren();return}
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
function filterCases(){let q=$('#case-search').value.toLowerCase(),s=$('#case-filter').value,project=$('#case-project-filter').value;$('#case-rows').innerHTML=caseRows(data.cases.filter(c=>(c.id+c.title+c.suite+projectLabel(c.project)).toLowerCase().includes(q)&&(!s||c.status===s)&&(!project||(project==='unassigned'?!c.project:c.project===project))))}
function filterBugs(){
 const q=$('#bug-search').value.trim().toLocaleLowerCase(),status=$('#bug-filter').value,priority=$('#bug-priority-filter').value,project=$('#bug-project-filter').value;
 const filtered=data.bugs.filter(b=>[b.id,b.title,b.project,b.description||'',b.steps||'',b.owner].some(v=>String(v).toLocaleLowerCase().includes(q))&&(!status||(status==='active'?['Open','In Progress'].includes(b.status):b.status===status))&&(!priority||b.priority===priority)&&(!project||b.project===project));
 $('#bug-rows').innerHTML=bugRows(filtered);$('#bug-result-count').textContent=filtered.length+' bugs';
}

$('#navigation').addEventListener('click',e=>{let b=e.target.closest('[data-page]');if(b){page=b.dataset.page;selectedProjectKey=null;selectedCaseId=null;selectedRunId=null;selectedBugId=null;initialCaseStatus='';initialBugStatus='';initialProjectStatus='';render()}});
document.querySelectorAll('.sidebar>.nav-item').forEach(b=>b.addEventListener('click',()=>{page=b.dataset.page;selectedProjectKey=null;selectedCaseId=null;selectedRunId=null;selectedBugId=null;initialCaseStatus='';initialBugStatus='';initialProjectStatus='';render()}));
render();
