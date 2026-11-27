const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/src/app.js','utf8');
const elements={};function element(sel){return elements[sel]||=( {innerHTML:'',textContent:'',value:'',children:[],classList:{add(){},remove(){},toggle(){}},addEventListener(){},replaceChildren(){this.innerHTML='';this.children=[]}} )}
const doc={querySelector:element,querySelectorAll:()=>[],addEventListener(){}};
const storage={};const ctx=vm.createContext({document:doc,localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>{storage[k]=v}},setTimeout:()=>{},Date,console});
vm.runInContext(src,ctx);
function call(code){return vm.runInContext(code,ctx)}
function test(name,condition){assert.ok(condition,name);console.log('PASS',name)}
test('renders dashboard',element('#page-content').innerHTML.includes('Dashboard')||element('#page-content').innerHTML.includes('Good morning'));
test('bug list renders with filter fields',call('bugs()').includes('bug-priority-filter')&&call('bugs()').includes('bug-project-filter'));
test('existing bugs readable',call("data.bugs.length")===5);
test('existing run-case linking available',typeof call('openLinkBug')==='function');
call("data.bugs.push({id:nextBugId(),title:'쇼핑몰 결제 테스트 오류',project:'SHOP',priority:'High',status:'Open',owner:'QA Tester 01',description:'데모 오류',steps:'1. 결제 클릭'});recordBugChange(data.bugs.at(-1),'버그 생성')");
test('new id unique',call('new Set(data.bugs.map(b=>b.id)).size===data.bugs.length'));
test('audit history saved',call('data.bugs.at(-1).history.length===1'));
call("updateBugStatus(data.bugs.at(-1),'In Progress')");
test('status change logged',call("data.bugs.at(-1).history.length===2 && data.bugs.at(-1).status==='In Progress'"));
call("data.runs.push({id:'RUN-999',name:'모의 실행',project:'SHOP',results:[{caseId:'TC-999',title:'가상 실패',result:'Fail',bugId:data.bugs.at(-1).id}]})");
test('reverse-linked test result',call('bugLinks(data.bugs.at(-1).id).length===1'));
call("selectedBugId=data.bugs.at(-1).id");
test('bug detail shows related test',call("bugDetail().includes('RUN-999')"));
call("deleteBugConfirmed(selectedBugId)");
test('deletion removes bug only',call("data.bugs.length===5 && data.runs.at(-1).results[0].result==='Fail' && !('bugId' in data.runs.at(-1).results[0])"));
test('source keeps localStorage key',Object.keys(storage).includes('qaboard-demo'));
console.log('SMOKE TESTS COMPLETE');
