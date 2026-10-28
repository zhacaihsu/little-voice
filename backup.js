// Portable, human-readable JSON backup for this device's vocabulary.
const BACKUP_FORMAT='little-voice-vocabulary';
const BACKUP_VERSION=1;
function vocabularySnapshot(){
  return {groups:groups.map(g=>[...g.words]),quick:quick.map(([symbol,text])=>[symbol,text])};
}
function exportVocabulary(){
  const data={
    format:BACKUP_FORMAT,
    version:BACKUP_VERSION,
    exportedAt:new Date().toISOString(),
    vocabulary:vocabularySnapshot()
  };
  const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const file=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(file),anchor=document.createElement('a');
  anchor.href=url;anchor.download='小小發聲器-詞庫備份-'+date+'.json';
  document.body.appendChild(anchor);anchor.click();anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
  toast('已產生詞庫備份檔，請確認下載位置');
}
function validateVocabularyFile(data){
  if(!data||data.format!==BACKUP_FORMAT||data.version!==BACKUP_VERSION)
    throw new Error('這不是相容的「小小發聲器」詞庫備份檔');
  const v=data.vocabulary;
  if(!v||!Array.isArray(v.groups)||v.groups.length!==3||!Array.isArray(v.quick))
    throw new Error('備份檔缺少必要的詞庫分類');
  const groupsClean=v.groups.map((list,i)=>{
    if(!Array.isArray(list)||list.length>201||list[0]!=='（不選）')
      throw new Error('第 '+(i+1)+' 組詞彙格式不正確');
    if(list.some(w=>typeof w!=='string'||!w.trim()||w.length>50))
      throw new Error('備份詞彙包含無效文字');
    if(new Set(list).size!==list.length)
      throw new Error('備份檔包含重複的詞彙');
    return [...list];
  });
  if(v.quick.length>200||v.quick.some(item=>
    !Array.isArray(item)||item.length!==2||
    typeof item[0]!=='string'||item[0].length>12||
    typeof item[1]!=='string'||!item[1].trim()||item[1].length>50
  ))throw new Error('快速說話的句子格式不正確');
  if(new Set(v.quick.map(item=>item[1])).size!==v.quick.length)
    throw new Error('快速說話包含重複的句子');
  return {groups:groupsClean,quick:v.quick.map(item=>[...item])};
}
$('exportVocabulary').addEventListener('click',exportVocabulary);
$('importVocabulary').addEventListener('click',()=>$('vocabularyFile').click());
$('vocabularyFile').addEventListener('change',async event=>{
  const file=event.target.files?.[0];
  event.target.value='';
  if(!file)return;
  if(file.size>1024*1024){alert('備份檔過大，請選擇小於 1 MB 的 JSON 檔案。');return}
  try{
    const imported=validateVocabularyFile(JSON.parse(await file.text()));
    const count=imported.groups.reduce((sum,g)=>sum+g.length-1,0);
    const message='備份檔包含 '+count+' 個詞彙及 '+imported.quick.length+' 句快速說話。\n\n匯入將「取代」這台裝置目前的全部詞彙與句子。\n\n確定要繼續嗎？';
    if(!confirm(message))return;
    const previous=vocabularySnapshot();
    try{
      imported.groups.forEach((list,i)=>{groups[i].words=[...list]});
      quick.splice(0,quick.length,...imported.quick);
      localStorage.setItem(VOCAB_KEY,JSON.stringify(vocabularySnapshot()));
    }catch(e){
      previous.groups.forEach((list,i)=>{groups[i].words=list});
      quick.splice(0,quick.length,...previous.quick);
      throw new Error('儲存失敗，原本的詞庫已保留');
    }
    clearEditing();rebuildWheels();rebuildQuick();renderWordList();
    toast('匯入成功，詞彙與句子已更新');
  }catch(e){
    alert('無法匯入詞庫：'+(e instanceof Error?e.message:'檔案無法讀取'));
  }
});
