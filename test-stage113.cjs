const fs = require('fs');
const vm = require('vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(__dirname+'/src/app.js','utf8');
const css = fs.readFileSync(__dirname+'/src/styles.css','utf8');
const elements={};
function elem(id){return elements[id]??={value:'',innerHTML:'',hidden:false,textContent:'',children:[],classList:{toggle(){},add(){},remove(){}},setAttribute(){},replaceChildren(){},addEventListener(){}}}
const document={body:{classList:{toggle(){}}},querySelector:elem,querySelectorAll:()=>[],addEventListener(){}};
const ctx=vm.createContext({document,localStorage:{getItem(){return null},setItem(){}},Date,console,setTimeout(){}});
vm.runInContext(source,ctx);
const run=code=>vm.runInContext(code,ctx);
assert.match(run('tcHub()'),/tc-collection-table/);
assert.match(run('projectTable()'),/data-row-detail="project"/);
assert.match(run('caseRows(data.cases)'),/data-row-detail="case"/);
assert.match(run('runs()'),/data-row-detail="run"/);
assert.match(run('bugRows(data.bugs)'),/data-row-detail="bug"/);
run("tcCollections().push({id:'TCG-100',name:'테스트',project:'SHOP',suite:'상품',priority:'High'});selectedTcCollectionId='TCG-100';data.cases.push({id:'TC-099',title:'상세 시험',collectionId:'TCG-100',project:'SHOP',suite:'상품',status:'Not Run',priority:'Low'});");
assert.match(run('tcCollectionDetail()'),/data-row-detail="tc-detail"/);
const navigation=[['project','SHOP','projects','selectedProjectKey'],['case','TC-024','cases','selectedCaseId'],['run','RUN-008','runs','selectedRunId'],['bug','BUG-105','bugs','selectedBugId']];
for(const [kind,id,page,selected] of navigation){
 run(`openDetailRow({dataset:{rowDetail:'${kind}',rowId:'${id}'}})`);
 assert.equal(run('page'),page);
 assert.equal(run(selected),id);
}
run("selectedTcCollectionId='TCG-100';openDetailRow({dataset:{rowDetail:'tc-detail',rowId:'TC-099'}})");
assert.equal(run('page'),'workshop');
assert.match(css,/\.tc-mode \.tc-collection-table\{width:100%;min-width:0/);
assert.doesNotMatch(css,/\.tc-mode \.tc-detail-table\{min-width:1550px/);
assert.match(source,/if\(event\.target\.closest\('button,a,input,select,textarea,label,\[role="button"\]'\)\)return/);
console.log('PASS: Suite first screen layout, original detail density, 5 row navigation targets, interactive element exclusion');
