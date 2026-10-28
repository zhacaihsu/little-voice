// Custom vocabulary is kept on this device, without a server.
const VOCAB_KEY='littleVoiceVocabularyV1';
let editingIndex=null;
function saveVocabulary(){try{localStorage.setItem(VOCAB_KEY,JSON.stringify({groups:groups.map(g=>g.words),quick}))}catch(e){toast('儲存失敗，請檢查瀏覽器儲存空間')}}
function loadVocabulary(){
  try{
    const saved=JSON.parse(localStorage.getItem(VOCAB_KEY)||'null');if(!saved)return;
    if(Array.isArray(saved.groups)&&saved.groups.length===3)saved.groups.forEach((words,i)=>{
      if(Array.isArray(words)){const clean=words.filter(w=>typeof w==='string'&&w.trim()&&w.length<=50&&w!=='（不選）').slice(0,200);groups[i].words=['（不選）',...new Set(clean)]}
    });
    if(Array.isArray(saved.quick))quick.splice(0,quick.length,...saved.quick.filter(p=>Array.isArray(p)&&typeof p[0]==='string'&&typeof p[1]==='string'&&p[1].trim()&&p[1].length<=50).slice(0,200));
  }catch(e){toast('舊詞庫無法載入，已顯示預設內容')}
}
function rebuildWheels(){
  const previous=groups.map((g,i)=>g.words[selected[i]]||'（不選）');
  $('wheels').replaceChildren();wheels.length=0;
  groups.forEach((g,i)=>{selected[i]=Math.max(0,g.words.indexOf(previous[i]));renderWheel(g,i)});
  groups.forEach((_,i)=>choose(i,selected[i],false));
}
function rebuildQuick(){
  $('quickGrid').replaceChildren();
  quick.forEach(([emoji,word])=>{
    const b=document.createElement('button');b.className='quick';
    const symbol=document.createElement('span');symbol.className='emoji';symbol.textContent=emoji;
    const caption=document.createElement('span');caption.textContent=word;
    b.append(symbol,caption);b.addEventListener('click',()=>speak(word));$('quickGrid').appendChild(b);
  });
}
function getList(){return $('editCategory').value==='quick'?quick:groups[Number($('editCategory').value)].words}
function clearEditing(){editingIndex=null;$('wordInput').value='';$('saveWord').textContent='＋ 新增';$('cancelEdit').hidden=true}
function refreshVocabulary(){saveVocabulary();rebuildWheels();rebuildQuick();renderWordList()}
function renderWordList(){
  const list=$('wordList');list.replaceChildren();const category=$('editCategory').value,words=getList();
  words.forEach((entry,index)=>{
    if(category!=='quick'&&index===0)return;
    const word=category==='quick'?entry[1]:entry;
    const row=document.createElement('div');row.className='word-row';
    const label=document.createElement('span');label.textContent=category==='quick'?entry[0]+' '+word:word;
    const edit=document.createElement('button');edit.type='button';edit.textContent='修改';edit.setAttribute('aria-label','修改 '+word);
    edit.addEventListener('click',()=>{editingIndex=index;$('wordInput').value=word;$('saveWord').textContent='儲存修改';$('cancelEdit').hidden=false;$('wordInput').focus()});
    const del=document.createElement('button');del.type='button';del.className='delete';del.textContent='刪除';del.setAttribute('aria-label','刪除 '+word);
    del.addEventListener('click',()=>{if(!confirm('確定要刪除「'+word+'」嗎？'))return;words.splice(index,1);clearEditing();refreshVocabulary();toast('已刪除')});
    row.append(label,edit,del);list.appendChild(row);
  });
  if(!list.childElementCount){const empty=document.createElement('p');empty.className='hint';empty.textContent='目前還沒有詞彙，請在上方新增。';list.appendChild(empty)}
}
$('manageButton').addEventListener('click',()=>{
  const panel=$('editor'),opening=panel.hidden;panel.hidden=!opening;
  $('manageButton').setAttribute('aria-expanded',String(opening));
  if(opening){$('editCategory').value=mode==='quick'?'quick':'0';clearEditing();renderWordList();panel.scrollIntoView({behavior:'smooth',block:'start'})}
});
$('closeEditor').addEventListener('click',()=>{$('editor').hidden=true;$('manageButton').setAttribute('aria-expanded','false');$('manageButton').focus()});
$('editCategory').addEventListener('change',()=>{clearEditing();$('wordInput').placeholder=$('editCategory').value==='quick'?'輸入完整句子，例如：我想出去玩':'輸入新詞彙，例如：草莓';renderWordList()});
$('cancelEdit').addEventListener('click',clearEditing);
$('wordForm').addEventListener('submit',e=>{
  e.preventDefault();
  const word=$('wordInput').value.trim().replace(/\s+/g,' ');if(!word)return;
  const category=$('editCategory').value,words=getList();
  if(words.some((v,i)=>i!==editingIndex&&(category==='quick'?v[1]===word:v===word))){toast('這個詞彙已經存在');return}
  const changed=editingIndex!==null;
  if(changed){if(category==='quick')words[editingIndex][1]=word;else words[editingIndex]=word}
  else{if(words.length>=200){toast('這個分類已達到詞彙上限');return}if(category==='quick')words.push(['💬',word]);else words.push(word)}
  clearEditing();refreshVocabulary();toast(changed?'已儲存修改':'已新增 '+word);
});
loadVocabulary();rebuildWheels();rebuildQuick();
