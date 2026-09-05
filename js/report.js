/* ============================================================
   心屿测评 · 报告生成配置
   每种量表定义: normalize(如何把作答转成 0-100 主分数)、
   verdict(分档判定)、dims(维度解读与条形)、advice(建议)、
   quote(治愈格言)、warm(安抚语)、coverColor
   ============================================================ */

/* 反转分值: 选项索引 a → 反向后的分值 */
function revWeight(scale,a){ return scale.weights[scale.weights.length-1-a]; }
function maxWeight(scale){ return Math.max.apply(null, scale.weights); }

/* 对一组题计分: key=null 表示全部题; 否则只统计该维度的题 */
function likertAnswers(scale, answers, key){
  let raw=0, count=0, maxc=0;
  scale.questions.forEach((q,i)=>{
    const a=answers[i];
    if(a==null) return;
    const dim = q.d!=null ? String(q.d) : null;
    if(key!=null && dim!==key) return;
    const val = q.r ? revWeight(scale,a) : scale.weights[a];
    raw += val; count++;
    maxc += q.r ? maxWeight(scale) : maxWeight(scale);
  });
  return { raw, count, max: maxc };
}
function to100(o){ return o.max<=0?0:Math.round(o.raw/o.max*100); }

/* 计算器: 返回统一的 detail 结构 */
function computeDetail(scale, answers){
  if(scale.mode==="type"){
    if(scale.dimType==="dichotomy") return computeMBTI(scale, answers);
    return computeDISC(scale, answers);
  }
  if(scale.mode==="custom") return computeCustom(scale, answers);
  if(scale.mode==="pick") return computePick(scale, answers);
  if(scale.mode==="score") return computeScoreScale(scale, answers);
}
window.computeDetail = computeDetail;

/* ------- 自定义/图片/趣味(pick: 选项映射类别累计) ------- */
function computePick(scale, answers){
  const cats = scale.cats || {};  // {catKey:{name}}
  const sums = {}; (scale.catKeys||Object.keys(cats)).forEach(k=>sums[k]=0);
  scale.questions.forEach((q,i)=>{
    const a=answers[i]; if(a==null) return;
    const opt=q.options[a]; if(!opt||!opt.c) return;
    sums[opt.c]=(sums[opt.c]||0)+ (opt.w||1);
  });
  const total=Object.values(sums).reduce((a,b)=>a+b,0)||1;
  const dist={}; (scale.catKeys||Object.keys(cats)).forEach(k=>dist[k]=Math.round(sums[k]/total*100));
  return {mode:"pick", sums, dist, total, cats};
}

function computeCustom(scale, answers){
  const kind=scale.custom;
  if(kind==="enneagram"){
    const t=["one","two","three","four","five","six","seven","eight","nine"];
    const sums={}; t.forEach(x=>sums[x]=0);
    scale.questions.forEach((q,i)=>{ const a=answers[i]; if(a==null)return; if(a===0) sums[q.tt]=(sums[q.tt]||0)+1; });
    let top="nine"; let mx=-1; t.forEach(x=>{ if(sums[x]>mx){mx=sums[x];top=x;} });
    return {mode:"custom", kind, sums, top, order:t.slice().sort((x,y)=>sums[y]-sums[x])};
  }
  if(kind==="holland"){
    const letters=["R","I","A","S","E","C"];
    const sums={}; letters.forEach(x=>sums[x]=0);
    scale.questions.forEach((q,i)=>{ const a=answers[i]; if(a==null)return; sums[q.h]+=scale.weights[a]; });
    let top="S"; let mx=-1; letters.forEach(x=>{ if(sums[x]>mx){mx=sums[x];top=x;} });
    return {mode:"custom", kind, sums, top, order:letters.slice().sort((x,y)=>sums[y]-sums[x])};
  }
  if(kind==="lovelang"){
    const ll=["aff","time","gift","serve","touch"];
    const names={aff:"肯定的话语",time:"精心时刻",gift:"接受礼物",serve:"服务的行动",touch:"身体的接触"};
    const sums={}; ll.forEach(x=>sums[x]=0);
    scale.questions.forEach((q,i)=>{ const a=answers[i]; if(a==null)return; sums[q.ll]+=scale.weights[a]; });
    const order=ll.slice().sort((x,y)=>sums[y]-sums[x]);
    return {mode:"custom", kind, sums, order, names};
  }
  return {mode:"custom", kind};
}
window.computeCustom=computeCustom;

/* ------- 得分型量表通用 ------- */
function computeScoreScale(scale, answers){
  // 收集按题 d 划分的多个字符串维度(attachment / scl)
  const keySet = {};
  let hasMulti=false;
  scale.questions.forEach(q=>{ if(q.d!=null){ keySet[q.d]=1; if(Object.keys(keySet).length>1) hasMulti=true; } });
  if(hasMulti){
    const dims={};
    Object.keys(keySet).forEach(k=>{
      const o=likertAnswers(scale,answers,k);
      dims[k]={ score:to100(o), raw:o.raw };
    });
    const overall=likertAnswers(scale,answers,null);
    return { mode:"score", overall:{ raw:overall.raw, pct:to100(overall) }, dims };
  }
  const overall=likertAnswers(scale,answers,null);
  return { mode:"score", overall:{ raw:overall.raw, pct:to100(overall) }, dims:{} };
}

/* ------- MBTI ------- */
function computeMBTI(scale, answers){
  const axis = [["E","I"],["N","S"],["T","F"],["J","P"]];
  const scores = [[0,0],[0,0],[0,0],[0,0]]; // 每轴左右累计
  scale.questions.forEach((q,i)=>{
    const a = answers[i]; if(a==null) return;
    const w = [1,0.5,0][a]??0;
    const dim = q.d;
    // a 选0→左, 选2→右; 中点各半
    if(a===0) scores[dim][0]+=1;
    else if(a===2) scores[dim][1]+=1;
    else { scores[dim][0]+=0.5; scores[dim][1]+=0.5; }
  });
  const code = scores.map((s,di)=> s[0]>=s[1] ? axis[di][0] : axis[di][1]).join("");
  const pref = {};
  axis.forEach((ax,di)=>{
    const total = scores[di][0]+scores[di][1]||1;
    const perc = Math.round(Math.max(scores[di][0],scores[di][1])/total*100);
    pref[ax[0]]={p:Math.round(scores[di][0]/total*100)};
    pref[ax[1]]={p:Math.round(scores[di][1]/total*100)};
  });
  return { mode:"type", type:"mbti", code, raw:scores, pref, axis };
}

/* ------- DISC ------- */
function computeDISC(scale, answers){
  const dims=["D","I","S","C"];
  const sums=[0,0,0,0];
  scale.questions.forEach((q,i)=>{
    const a=answers[i]; if(a==null) return;
    const w=[0,1,2,3][a]??0;
    const idx = q.d; // 0..3
    sums[idx]+= w;
  });
  const total=sums.reduce((a,b)=>a+b,0)||1;
  const pct=sums.map(s=>Math.round(s/total*100));
  let code="D"; let mx=-1;
  pct.forEach((p,i)=>{ if(p>mx){mx=p;code=dims[i];} });
  return { mode:"type", type:"disc", code, raw:sums, pct, total, dims };
}

/* ============================================================
   报告文案: 每种量表的解读逻辑
   ============================================================ */
function buildReport(scale, answers){
  const d = computeDetail(scale, answers);
  if(scale.mode==="pick") return pickReport(scale, d);
  if(scale.mode==="custom") return customReport(scale, d);
  const cfg = REPORTS[scale.id];
  return cfg ? cfg.make.call(cfg, d, scale) : genericReport(d, scale);
}
window.buildReport = buildReport;

function bandOf(scaleId, pctOrBand){
  const r = REPORTS[scaleId];
  return r && r.band ? r.band(pctOrBand) : {tier:0};
}

/* 三档通用: 分数越低越健康(SAS/SDS等风险量表) */
function riskBands(ranges){
  return (pct)=>{
    if(pct<ranges[0]) return 0;      // 状态良好
    if(pct<ranges[1]) return 1;      // 轻微波动
    return 2;                         // 值得关照
  };
}

const REPORTS = {

/* ===================== SAS 焦虑 ===================== */
sas:{
  colors:["#9fc7a8","#7fb592"],
  band:(pct)=> riskBands([45,65])(pct),
  make(d){
    const tier = this.band(d.overall.pct);
    const v = [
      {emoji:"🌿", t:"情绪平稳", sub:"您目前的心态较为放松，焦虑感不高，状态舒展而自在。", c:"#6fa87e"},
      {emoji:"🌊", t:"偶有波澜", sub:"近期有一些焦虑的涟漪，属于每个人都会经历的情绪波动，温柔以待即可。", c:"#c99a4a"},
      {emoji:"🌫️", t:"需要关照", sub:"焦虑的感受偏多，正在消耗您的能量。请务必先照顾好自己，必要时寻求专业帮助。", c:"#c9827a"}
    ][tier];
    return {
      headline:v.emoji+" "+v.t, sub:v.sub, color:v.c, tier,
      gauge:{pct:d.overall.pct, label:"焦虑感受指数", note:"分值越低状态越舒展"},
      dims:[
        {name:"情绪困扰",pct:Math.round(d.overall.pct)},
        {name:"身体紧张",pct:Math.round(d.overall.pct*0.92)},
        {name:"认知担忧",pct:Math.round(d.overall.pct*0.85)}
      ],
      advice: adv("SAS",tier),
      quote:["把担心交给风，把当下留给自己。慢一点，世界不会因此停转。","焦虑是大脑爱你的方式，但别让它替你决定今天的颜色。"][tier===2?1:0],
      warm: tier===2 ? "您近来背负了太多紧绷。请记得：向信任的人倾诉、预约专业咨询、给自己留一段只属于呼吸的时间，都不是软弱，而是勇敢的自救。" : "若最近有紧张的小情绪，试着深呼吸三次——吸气四秒、屏息两秒、呼气六秒，让肩膀和心一同松开。"
    };
  }
},

/* ===================== SDS 抑郁 ===================== */
sds:{
  colors:["#a9c9dd","#8db6cf"],
  band:(pct)=> riskBands([45,60])(pct),
  make(d){
    const tier=this.band(d.overall.pct);
    const v=[
      {emoji:"☀️",t:"内心明亮",sub:"近期情绪整体明朗，低落感很少，能感受生活的温度与意义。",c:"#6fa87e"},
      {emoji:"🌥️",t:"偶有阴云",sub:"有些许低落情绪掠过，属正常起伏。允许自己休憩，光亮会重新透进来。",c:"#c99a4a"},
      {emoji:"🌧️",t:"请在雨中撑伞",sub:"低落的云层偏厚。请别独自硬扛，向亲友开口、寻求专业陪伴都是被允许的温柔。",c:"#6b89b0"}
    ][tier];
    return {
      headline:v.emoji+" "+v.t, sub:v.sub, color:v.c, tier,
      gauge:{pct:d.overall.pct,label:"低落情绪指数",note:"分值越低越轻盈"},
      dims:[
        {name:"情绪感受",pct:Math.round(d.overall.pct*0.95)},
        {name:"身体能量",pct:Math.round(d.overall.pct*0.9)},
        {name:"自我认同",pct:Math.round(d.overall.pct*0.85)}
      ],
      advice: adv("SDS",tier),
      quote:["阴天不是你的错，你只是暂时收不到光。先好好吃饭，好好睡觉，光会回来的。","你已走了很远的路。即便此刻感到沉重，也请相信温柔与光照从未离开你。"][tier===2?1:0],
      warm: tier===2 ? "请把这份结果认真对待：低落若持续两周以上并影响生活，请一定联系专业心理咨询或精神科医生。你值得被好好接住，不必独自面对。" : "低落的片刻里，试试拉开窗帘晒五分钟太阳、给自己一杯热饮、写下三件今天完成的小事。微小如豆的光点，也能连成光路。"
    };
  }
},

/* ===================== PSS 压力 ===================== */
pss:{
  colors:["#b7d3bc","#93bda0"],
  band:(pct)=> riskBands([40,65])(pct),
  make(d){
    const tier=this.band(d.overall.pct);
    const v=[
      {emoji:"🍃",t:"压力尚可",sub:"您目前对生活的掌控感不错，即便有压力也能从容应对，身心有呼吸的缝隙。",c:"#6fa87e"},
      {emoji:"⛰️",t:"压力偏重",sub:"近期被琐事与期望裹挟的感觉增多。请主动为日程留白，给紧绷的自己松绑。",c:"#c99a4a"},
      {emoji:"🔥",t:"高压紧绷",sub:"压力值偏高，您可能正处于过度消耗状态。请把“休息”当作必需而非奢侈。",c:"#d07a6a"}
    ][tier];
    return {
      headline:v.emoji+" "+v.t, sub:v.sub, color:v.c, tier,
      gauge:{pct:d.overall.pct,label:"压力感知指数",note:"分值越高压力越重"},
      dims:[
        {name:"失控感",pct:Math.round(d.overall.pct*1.05)},
        {name:"应对自信",pct:Math.round(100-d.overall.pct)}
      ],
      advice: adv("PSS",tier),
      quote:["压力是信使，不是判决。它提醒你该慢下来，而不是判你不够好。","你不需要扛下所有。把一些担子放下，允许自己被帮助，也是一种成熟。"][tier===2?1:0],
      warm: tier===2 ? "高压之下请为自己按下暂停键：规律睡眠、一次彻底放空的散步、把大目标拆小。若仍感到撑不住，请找咨询师或信得过的人聊一聊。" : "给自己安排一天“无待办”的时光，关掉提醒，单纯地吃饭、散步、发呆。恢复与充电，本就是你生活的一部分。"
    };
  }
},

/* ===================== 睡眠 ===================== */
sleep:{
  colors:["#c6c0dd","#a9a1cf"],
  band:(pct)=> riskBands([45,65])(pct),
  make(d){
    const tier=this.band(d.overall.pct);
    const v=[
      {emoji:"🌙",t:"睡得不错",sub:"您的睡眠节奏整体健康，能顺利入睡、安睡并恢复精力，值得为自己点赞。",c:"#6fa87e"},
      {emoji:"🌗",t:"偶有起伏",sub:"睡眠偶有波澜，多与近期的作息或思虑相关，稍加调理便能回到安稳轨道。",c:"#8a83b5"},
      {emoji:"🌑",t:"需要安眠",sub:"睡眠品质偏低，可能正影响您的白天状态。请把睡眠当作第一要务来温柔经营。",c:"#6b628f"}
    ][tier];
    return {
      headline:v.emoji+" "+v.t, sub:v.sub, color:v.c, tier,
      gauge:{pct:100-d.overall.pct,label:"睡眠品质指数",note:"分值越高睡得越好"},
      dims:[
        {name:"入睡顺畅",pct:Math.max(0,Math.round(100-d.overall.pct*1.1))},
        {name:"睡眠维持",pct:Math.max(0,Math.round(100-d.overall.pct))},
        {name:"醒来状态",pct:Math.max(0,Math.round(100-d.overall.pct*0.9))}
      ],
      advice: adv("SLEEP",tier),
      quote:["睡眠是身体写给我们的情书。读不懂时，先放下手机，让黑暗与呼吸作伴。","把今天的烦恼交还给今天，让夜晚只属于安宁的你自己。"][tier===2?1:0],
      warm: tier===2 ? "若失眠持续超过一个月，请及时咨询专业睡眠门诊。今晚开始：固定上床时间、睡前一小时放下屏幕、卧室只留柔和光线，给自己一场安稳的告别白昼仪式。" : "睡前试试“4-7-8 呼吸法”：吸气4秒、屏息7秒、缓缓呼气8秒，重复四轮，让副交感神经带你滑入梦乡。"
    };
  }
},

/* ===================== MBTI ===================== */
mbti:{
  colors:["#f2d8b8","#e6bd8e"],
  make(d){
    const MB={
      "ISTJ":"尽责的检查者","ISFJ":"温暖的守护者","INFJ":"安静的引路人","INTJ":"远见的建筑师",
      "ISTP":"灵巧的实干家","ISFP":"柔和的艺术家","INFP":"天真的治愈者","INTP":"好奇的思考者",
      "ESTP":"果敢的行动派","ESFP":"热情的表演者","ENFP":"灵动的倡导者","ENTP":"机敏的辩论家",
      "ESTJ":"干练的管理者","ESFJ":"贴心的供给者","ENFJ":"感召的导师","ENTJ":"笃定的指挥官"
    };
    const meta={
      "INFJ":["理想主义","洞察他人","渴望意义","在独处中充电，却用敏感的温度照亮世界"],
      "INFP":["内心丰盈","忠于价值","浪漫而坚定","在想象与真实之间，温柔地守着自己认定的美好"],
      "ENFP":["热情洋溢","拥抱可能","鼓舞人心","用感染力的笑容把灰暗日子点亮"],
      "INTP":["逻辑分明","热爱探索","独立求真","在脑内宇宙里搭建精巧的真理殿堂"],
      "INTJ":["目光长远","谋定后动","高度自洽","以清晰的蓝图抵达别人看不见的远方"],
      "ENFJ":["善解人意","乐于成全","领袖气质","用共情与担当托举起身边的人"],
      "ISFJ":["体贴周到","重情重诺","默默付出","用细水长流的温暖守护所爱"],
      "ISFP":["细腻敏感","忠于当下","审美独到","在生活细微处发现并创造美"],
      "ISTJ":["踏实可靠","条理分明","责任感强","是团队与关系中最值得信赖的基石"],
      "ESTJ":["行动果决","组织力强","务实高效","让纷乱的一切回归秩序"],
      "ESTP":["反应敏捷","敢于冒险","现实灵活","在行动与应变中点燃现场"],
      "ESFP":["活力四射","享受当下","亲切开朗","所到之处自有欢愉的光"],
      "ISTP":["冷静分析","动手天赋","随性自由","是关键时刻沉得住气的实操高手"],
      "ENTP":["脑洞大开","伶牙俐齿","挑战常规","总能为僵局撕开新的可能"],
      "ESFJ":["热情体贴","注重和谐","乐于服务","擅长让人感受到被在意"],
      "ENTJ":["天生领导","目标明确","果敢坚定","以超凡的执行力领航方向"]
    };
    const m=meta[d.code]||meta["INFP"];
    return {
      headline:(d.code+" · "+(MB[d.code]||"")).trim(), emoji:"🪷",
      typeLabel:d.code+" · "+(MB[d.code]||"")+"", sub:m[0]+" — "+m[3], color:"#c98a5a", tier:0,
      gauge:null,
      /* 四轴偏好 */
      axisBars:[
        {name:"精力来源",a:d.code[0],pa:d.pref[d.code[0]].p},
        {name:"信息接收",a:d.code[1],pa:d.pref[d.code[1]].p},
        {name:"决策方式",a:d.code[2],pa:d.pref[d.code[2]].p},
        {name:"生活方式",a:d.code[3],pa:d.pref[d.code[3]].p}
      ],
      mb_desc:m,
      advice: mbAdvice(d.code),
      quote:"性格没有优劣，只有不同的路。你在世界上的坐标，本就无可替代。",
      warm:"MBTI 是一面温和的镜子，帮助你看清自己的偏好，但它从不定义你完整的可能。愿你借它认识自己，而不被它困住。"
    };
  }
},

/* ===================== DISC ===================== */
disc:{
  colors:["#e6c9c9","#d69f9f"],
  make(d){
    const D={
      "D":{t:"D · 支配型",e:"🔥 果断的行动者",d:["目标感强","直接高效","天生领导者"],sub:"你是推动事情发生的人，越有挑战越有干劲。"},
      "I":{t:"I · 影响型",e:"🌟 热情的发光体",d:["感染力强","乐于表达","人缘满分"],sub:"你擅长连接与鼓舞，人群会因你而更明亮。"},
      "S":{t:"S · 稳健型",e:"🌲 温柔的定海针",d:["耐心可靠","善于倾听","团队稳定器"],sub:"你以沉稳和包容托住周围的人，是值得深交的依靠。"},
      "C":{t:"C · 谨慎型",e:"🎯 精密的把关人",d:["严谨细致","逻辑分明","追求卓越"],sub:"你用高标准守护品质，让每个细节都经得起推敲。"}
    };
    const c=D[d.code];
    return {
      headline:c.t.replace(" · ","·")+"", typeLabel:c.t, sub:c.sub, color:"#c9827a", tier:0, emoji:c.e,
      gauge:null,
      dimsBar: d.pct.map((p,i)=>(
        {name:["支配 D","影响 I","稳健 S","谨慎 C"][i],pct:p}
      )),
      typeDetail:c,
      advice: discAdvice(d.code),
      quote:"不必成为别人期待的样子，成为最有力量的自己，就已足够闪亮。",
      warm:"你的风格往往是几种类型的温柔混合。DISC 不是贴标签，而是帮你看见自己最舒服的发力方式，也理解别人为何与你不同。"
    };
  }
},

/* ===================== 成人依恋 ===================== */
attachment:{
  colors:["#e9c6c6","#e2b0b0"],
  make(d){
    const anx=d.dims.anx?d.dims.anx.score:50;
    const avo=d.dims.avo?d.dims.avo.score:50;
    let style,emoji,desc,color;
    if(anx<45 && avo<45){style="安全型";emoji="🏡";color:"#6fa87e";desc="你在关系里能亲近而不失自我，信赖而不黏腻。安全感是你与生俱来的底气，你既能享受亲密，也允许对方保有空间。"}
    else if(anx>=45 && avo<50){style="焦虑型(痴迷)";emoji="🌊";color:"#c99a4a";desc="你渴望亲近，也害怕被冷落。敏感让你爱得用力，却常因“会不会被丢下”的疑问而惴惴不安。"}
    else if(avo>=50 && anx<45){style="回避型(疏离)";emoji="🌫️";color:"#6b89b0";desc="你习惯独立自处，亲密一旦逼近便本能地想退回自己的堡垒。你不是不需要爱，只是不知如何安然地靠近。"}
    else {style="恐惧·回避型";emoji="🌪️";color:"#8a83b5";desc="你既渴望亲密又惧怕受伤，靠近与逃离在内心反复拉扯。这并非你的错，而是曾被辜负的伤口在发出提醒。"}
    return {
      headline:emoji+" "+style, sub:desc, color, tier: style==="安全型"?0:1,
      gauge:null,
      dimsBar:[
        {name:"关系焦虑",pct:Math.round(anx)},
        {name:"亲近回避",pct:Math.round(avo)}
      ],
      advice: attAdvice(style),
      quote:style==="安全型"
        ?"能被温柔地爱着，也能温柔地爱着，是这世间很深的幸运。"
        :"童年留下的印记，不必成为关系里永远的剧本。觉察是改变的开始，你有力量改写它。",
      warm:"依恋风格不是性格判词，而是你学会爱的方式的一次回望。它形成于过去，却能在此刻被温柔地重新学习。若常被焦虑或回避困扰，一段稳定的亲密关系或专业咨询，都能帮你长出更安全的内核。"
    };
  }
},

/* ===================== 关系温暖度 ===================== */
relation:{
  colors:["#f2d8b8","#e6b5a0"],
  band:(pct)=> pct>=75?2 : pct>=55?1 : 0,  // 分数越高越好
  make(d){
    const tier=this.band(d.overall.pct);
    const v=[
      {emoji:"🌫️",t:"温暖流失中",sub:"你们之间的温度与连接似乎有些稀薄。这并不可怕，许多关系都值得被重新焐热。",c:"#c9827a"},
      {emoji:"🌤️",t:"有暖意、可加温",sub:"关系中有不错的底色，只是近期沟通与陪伴少了些。一点用心，就能让火苗更旺。",c:"#c99a4a"},
      {emoji:"💗",t:"滋养而契合",sub:"你们彼此理解、彼此支持，这段关系正温柔地给予你们双方能量。",c:"#e07a8a"}
    ][tier];
    return {
      headline:v.emoji+" "+v.t, sub:v.sub, color:v.c, tier,
      gauge:{pct:d.overall.pct,label:"关系温暖度",note:"分值越高越滋养"},
      dims:[
        {name:"相互理解",pct:Math.round(d.overall.pct*1.05)},
        {name:"彼此支持",pct:Math.round(d.overall.pct)},
        {name:"情感滋养",pct:Math.round(d.overall.pct*0.95)}
      ],
      advice: relAdvice(tier),
      quote:"爱不是拥有，而是看见；不是占有，而是彼此照亮。最好的关系，是两个人一起，比独自一人走得更远。",
      warm:tier===2?"请珍惜并浇灌这份难得的关系：一句真诚的谢谢、一个没有手机的夜晚、一次只属于你们的约会，都会让爱意常青。" : "若你感到关系的温度下降，从“一小步”开始：主动道声辛苦了、安排一次轻松约会、认真听对方说完一次。爱常常在细微的回应里重新生长。"
    }
  }
},

/* ===================== PHQ-GAD ===================== */
scl:{
  colors:["#a9c9dd","#86b6d0"],
  band:(pct)=> riskBands([35,55])(pct),
  make(d){
    const tier=this.band(d.overall.pct);
    const phq=d.dims.phq?d.dims.phq.score:50;
    const gad=d.dims.gad?d.dims.gad.score:50;
    const v=[
      {emoji:"🌱",t:"状态明朗",sub:"近两周整体情绪平稳，抑郁与焦虑的困扰很少，你正稳稳地生活着。",c:"#6fa87e"},
      {emoji:"🍂",t:"偶有消耗",sub:"情绪有起伏，疲惫与不安偶有造访，多数人都会有这样需要调养的时节。",c:"#c99a4a"},
      {emoji:"🌩️",t:"请多关照自己",sub:"当前情绪负荷偏重。请务必认真对待，向专业求助是对自己最大的温柔。",c:"#6b89b0"}
    ][tier];
    return {
      headline:v.emoji+" "+v.t, sub:v.sub, color:v.c, tier,
      gauge:{pct:d.overall.pct,label:"情绪负荷指数",note:"分值越高越需要调养"},
      dims:[
        {name:"抑郁倾向(PHQ)",pct:Math.round(phq)},
        {name:"焦虑倾向(GAD)",pct:Math.round(gad)}
      ],
      advice: adv("SCL",tier),
      quote:"你不必时刻都好。允许自己暂时不够好，是走向更好最诚实的一步。",
      warm:tier===2 ? "本测评仅作自查参考，不能替代诊断。若情绪低落或过度担忧已持续两周以上、并影响到工作与生活，请一定前往正规医院精神科/心理科或专业咨询机构寻求帮助——求助是勇敢，不是软弱。" : "照顾好情绪的两把钥匙：规律的睡眠与运动，加上一个可以说心里话的人。若困扰持续，主动预约一次专业咨询，会是很值得的投资。"
    };
  }
}

};

/* ============ 建议文案库 ============ */
function adv(kind,tier){
  const bank={
    /* tier0 低风险/良好 */
    0:{
      SAS:["练习腹式呼吸，让身体记得放松的状态","把“担心清单”写下来，识别哪些真的会发生","给自己安排规律的运动，释放多余的紧张"],
      SDS:["保持与亲友的联结，低落时主动打个电话","晒晒太阳、多出门走走，光线会带来好心情","记录每天三件小确幸，喂养内心的光亮"],
      PSS:["为日程主动留白，把“休息”写进待办","把大事拆成小步，一次只专注眼前一件事","练习正念：吃饭时只吃饭，走路时只走路"],
      SLEEP:["固定入睡与起床时间，稳定生物钟","睡前一小时远离屏幕，改用阅读或轻柔音乐","睡前一小时避免咖啡因与重餐"],
      SCL:["坚持规律的作息与适度运动，稳住情绪基底","与信任的人定期聊聊内心，别独自消化","把每天的烦恼写下来，为大脑卸下重担"]
    },
    /* tier1 中度 */
    1:{
      SAS:["尝试 4-7-8 呼吸放松法，焦虑来袭时救急","减少咖啡因与熬夜，它们是焦虑的放大器","每天留 20 分钟独处，允许自己放空"],
      SDS:["从最小的事开始行动，哪怕只是起床喝杯水","向一位朋友坦白近况，你不需要一个人扛","减少自我批判，把“应该”换成“可以”"],
      PSS:["识别主要压力源，区分“可控”与“不可控”","练习对不必要的事说“不”，保护自己的能量","每周安排一次彻底放松的“充电日”"],
      SLEEP:["若睡不着，先起床去客厅坐会，别强躺硬扛","把焦虑写下来再上床，清空思绪再入睡","午后不喝咖啡，为夜间睡眠让路"],
      SCL:["情绪起伏时，先做几次深呼吸稳住当下","给自己每天一段不被打扰的安静时光","若起伏持续，考虑预约一次专业心理测评/咨询"]
    },
    /* tier2 高风险 */
    2:{
      SAS:["请优先照顾自己，必要时空出时间真正休息","向信任的人或专业咨询师求助，你不是一个人","若影响生活，请尽快预约心理科或精神科就诊"],
      SDS:["这份结果请认真对待，尽快寻求专业帮助","联系正规心理咨询机构或精神科医生评估","告诉身边一位亲友你的真实状态，让他们陪你走"],
      PSS:["请为自己按下暂停键，减少不必要的负荷","考虑专业减压咨询，学习系统的压力管理","保证基本睡眠与营养，这是应对高压的地基"],
      SLEEP:["失眠若持续，请尽快咨询专业睡眠门诊","避免自行长期服用安眠药，需在医生指导下进行","睡前建立固定仪式，用规律重建安全感"],
      SCL:["本结果仅作自查，请尽快前往正规医院评估","联系精神科/心理科医生或专业咨询师","请让信任的人知道你正在经历什么"]
    }
  };
  return bank[tier][kind]||["给自己一些耐心，温柔地对待当下的自己"];
}

function mbAdvice(code){
  return [
    "多给自己独处的充电时间，那会是你灵感的源泉",
    "试着把你珍视的价值，一步步落实成小而具体的行动",
    "允许世界看见真实的你，真诚的联结会让你的天赋发光"
  ];
}
function discAdvice(code){
  return [
    "留意放慢语速、多倾听三秒，让身边的人跟上你",
    "在追求结果的同时，也照顾一下关系的温度",
    "与风格不同的人共事时，试着欣赏互补，而非抵抗"
  ];
}
function attAdvice(style){
  const map={
    "安全型":["珍惜并经营这份安全感，你也能成为他人的安全港湾","继续保持开放表达，让爱有来有往","用你的稳定，温暖那些仍在学习亲近的人"],
    "焦虑型(痴迷)":["当不安来袭，先深呼吸，区分“事实”与“脑补”","试着把“他是不是不爱我了”换成“我想要什么”，把注意力拉回自己","练习在关系里保留自我空间，你的完整与爱并不冲突"],
    "回避型(疏离)":["从分享一件小事开始练习靠近","允许自己“被需要”，依靠不是负担","慢一点没关系，安全感可以在被温柔对待中重新长出"],
    "恐惧·回避型":["请先学会善待自己，伤口愈合需要时间","在一段稳定、耐心的关系里逐步重建信任","必要时寻求专业依恋创伤的咨询支持"]
  };
  return map[style]||[];
}
function relAdvice(tier){
  if(tier===2) return ["安排一场只属于你们的约会，重燃心动的火苗","练习“具体地赞美”：指出对方一个让你欣赏的细节","每天留出十分钟，放下手机，专注听对方说话"];
  return ["主动开启一次真诚的深度对话，说出你的需要","共同创造一点“仪式感”，让日常也值得期待","当温度下降，先给出一个拥抱，话语可以慢慢来"];
}

/* ============================================================
   数据驱动通用报告工厂
   每套量表可在数据里带 rep 元数据; 无专属 REPORTS.make 时，
   依据 kind(risk低好/well高好) + domain(文案域) + tier 自动生成。
   ============================================================ */

const DOMAIN={
  mood:{              // 情绪
    emoji:["🌷","🌤️","🌧️"], color:["#6fa87e","#c99a4a","#6b89b0"],
    names:["情绪明亮","偶有起伏","值得关照"],
    subs:{
      risk:[
        "您近期的情绪状态舒展明亮，能感受到生活里的光与暖意。",
        "情绪有些小小的起落，这是每个人都会经历的潮汐，允许自己休憩片刻。",
        "近期情绪的云层偏厚，正在消耗您的能量。请一定先照顾好自己，必要时向专业求助。"]
    },
    q:["真正的平静，不是没有风浪，而是你学会了在风浪中为自己撑伞。","情绪不是敌人，而是内心想对你说的话。试着安静下来听一听。","你不必时刻都好。允许自己暂时不够好，是走向更好最诚实的一步。"],
    a0:["把情绪写下来，让它们有处安放","每天给自己一段不被打扰的安静时光","主动联系一位让你安心的朋友，说说心里话"],
    a1:["尝试规律的作息与适度运动，让情绪有稳定的土壤","练习正念呼吸，焦虑来袭时先回到当下","减少自我批判，把‘应该’换成‘可以’"],
    a2:["请认真对待此刻的感受，尽快寻求专业心理帮助","把真实状态告诉一位信任的人，别独自硬扛","保证睡眠与营养，这是情绪修复的地基"]
  },
  stress:{            // 压力
    emoji:["🍃","⛰️","🔥"], color:["#6fa87e","#c99a4a","#d07a6a"],
    names:["压力尚可","压力偏重","高压紧绷"],
    subs:{
      risk:[
        "您对生活的掌控感不错，压力尚在从容消化的范围。",
        "近期被琐事与期望裹挟的感觉增多，请主动为日程留白。",
        "压力值偏高，您可能正处在过度消耗的状态，休息已是必需而非奢侈。"]
    },
    q:["压力是信使，不是判决。它提醒你该慢下来，而不是判你不够好。","你不需要扛下所有。允许自己被帮助，也是一种成熟。"],
    a0:["保持规律的睡眠与运动，给身体稳稳的底盘","练习把大目标拆成可完成的小步","给自己安排定期的‘留白时光’"],
    a1:["识别主要压力源，分清可控与不可控","学会对不必要的事说‘不’，保护自己的能量","每周安排一次彻底放空的充电日"],
    a2:["请为自己按下暂停键，减少不必要的负荷","考虑专业减压咨询，学习系统的压力管理","先保证基本睡眠与营养，再谈应对高压"]
  },
  sleep:{             // 睡眠
    emoji:["🌙","🌗","🌑"], color:["#6fa87e","#8a83b5","#6b628f"],
    names:["睡得不错","偶有起伏","需要安眠"],
    subs:{
      risk:[
        "您的睡眠节奏整体健康，能顺利入睡并恢复精力。",
        "睡眠偶有波澜，多与近期作息或思虑相关，稍加调理便能回到安稳轨道。",
        "睡眠品质偏低，可能正影响白天状态，请把睡眠当作第一要务来温柔经营。"]
    },
    q:["睡眠是身体写给我们的情书。读不懂时，先放下手机，让黑暗与呼吸作伴。","把今天的烦恼交还给今天，让夜晚只属于安宁的你。"],
    a0:["保持规律作息，稳定你的生物钟","睡前一小时放下屏幕，改用阅读或轻音乐","营造安静、微暗的助眠环境"],
    a1:["若睡不着，先起床坐会，别强躺硬扛","把烦心事写下来再上床，清空思绪","午后少喝咖啡，为夜间让路"],
    a2:["失眠若持续，请尽快咨询专业睡眠门诊","勿自行长期服药，需在医生指导下进行","睡前一小时固定仪式，用规律重建安全感"]
  },
  self:{              // 自我认知/人格
    emoji:["🪷","🌱","🌫️"], color:["#8fb39b","#c99a4a","#6b89b0"],
    names:["清晰自洽","正在探索","需要松绑"],
    subs:{
      risk:[
        "您对自我的认识清晰而稳定，能温柔地接纳真实的自己。",
        "您正处在探索自我的路上，有些不确定很正常，那恰恰是成长的入口。",
        "自我批判与紧绷偏多，请先练习温和地对待自己，再看清真实的模样。"]
    },
    q:["认识自己，是这世上最温柔也最值得的一场远行。","性格没有优劣，只有不同的路。你的坐标，本就无可替代。"],
    a0:["把喜欢与擅长的部分写下来，让它们更清晰","允许自己有不足，那是完整的一部分","继续保有那份对自己的好奇与善意"],
    a1:["记录‘我是什么样的人’的小观察","试着从别人眼里的你，补充对自己的认识","接纳不确定，探索本身就有意义"],
    a2:["先练习自我接纳，再谈改变","减少与他人的苛刻比较","若常感自我怀疑，不妨与专业咨询师聊聊"]
  },
  relation:{          // 关系/家庭/婚姻
    emoji:["💗","🌤️","🌫️"], color:["#e07a8a","#c99a4a","#c9827a"],
    names:["滋养契合","有暖意可加温","温暖流失中"],
    subs:{
      risk:[
        "关系中有温度与理解，正温柔地给予彼此能量。",
        "关系有不错的底色，只是沟通与陪伴少了些，用心便能让火苗更旺。",
        "你们之间的连接有些稀薄，许多关系都值得被重新焐热。"]
    },
    q:["爱不是拥有，而是看见；最好的关系，是两个人一起，比独自走得更远。","关系里的温暖，常藏在那些细微的回应里。"],
    a0:["多表达具体的感谢与欣赏，让爱意常青","安排只属于彼此的时光，制造小仪式感","认真倾听对方，不急着给建议"],
    a1:["主动开启一次真诚的深度对话","共同创造一点仪式感，让日常值得期待","先给出一个拥抱，话语可以慢慢来"],
    a2:["从一小步开始：一声辛苦了、一次轻松约会","学习非暴力沟通，先讲感受再谈对错","若僵局难解，可考虑专业伴侣咨询"]
  },
  career:{            // 职业/工作
    emoji:["🌟","🧭","🌫️"], color:["#e6bd8e","#c99a4a","#8a83b5"],
    names:["方向清晰","正在探索","需要调整"],
    subs:{
      risk:[
        "您在职业上能找到意义与成就感，方向感清晰。",
        "职业状态有些消耗或方向摇摆，是需要调整与充电的信号。",
        "当前的职业状态偏紧绷或倦怠，请优先关照自己，再重新校准方向。"]
    },
    q:["工作之外，你仍是你自己。别让忙碌掩盖了你心里真正想去的方向。","方向不是找出来的，是在一次次尝试中走出来的。"],
    a0:["把让你有成就感的事记下来，朝它多走几步","与同频的伙伴保持交流，拓展视野","定期给自己做一次职业复盘"],
    a1:["找出工作中的消耗点与意义点","尝试把大目标拆解成可落地的小步","给自己安排真正的休息与切换"],
    a2:["正视倦怠信号，暂停无意义的消耗","必要时寻求职业规划或心理咨询支持","重新连接初心，问自己真正在意什么"]
  },
  habit:{             // 习惯/成瘾/拖延
    emoji:["🌿","🍂","🔥"], color:["#7fb592","#c99a4a","#d07a6a"],
    names:["习惯良好","需要调养","正在报警"],
    subs:{
      risk:[
        "您在自我管理与生活节律上做得不错，稳而有度。",
        "某些习惯正在悄悄消耗你，是开始温柔调整的好时机。",
        "过度依赖或失控感偏强，请认真对待，逐步为自己找回主动权。"]
    },
    q:["改变不必惊天动地，从微小而诚实的一步开始，就已足够勇敢。","你比某个习惯更强大，只是需要给它一个温柔的替代。"],
    a0:["继续保持规律的节奏","给自己设定适度、可持续的小目标","留意那些让你偏离的触发点"],
    a1:["找到触发习惯的场景，提前设好提醒","用小而有意义的替代行为填充空缺","不必苛责，回看是为了走得更稳"],
    a2:["正视失控感，必要时寻求专业评估","与信任的人约定互相提醒","把目标缩小到‘今天只做一点点’"]
  },
  fun:{               // 趣味
    emoji:["✨","🌈","🍀"], color:["#e6a9c6","#c99a4a","#6fa87e"],
    names:["A 型特质","B 型特质","中间型"],
    subs:{
      well:["你的选择里藏着独特的性格密码，一起来读读这段治愈的解读吧。","这个答案没有对错，它只是温柔地照见了你的一部分。","放轻松，我们不过是用轻松的方式，认识更有趣的自己。"]
    },
    q:["人生好玩的地方，正在于你不必定义，只去体验。","每种性格都有它的光，你的也正亮着。"],
    a0:["把这份解读当作认识自己的起点","相信并喜欢那个真实的自己","带着轻松的心态再探索更多可能"],
    a1:["试着做一件平时不会做的事","与不同性格的朋友聊聊彼此差异","接纳自己的多面与流动"],
    a2:["保持好奇与开放","不必被标签定义","今天的你，已经足够可爱"]
  }
};

/* 由 scale.rep + computeDetail 生成自动报告 */
function autoReport(d,scale){
  const meta=scale.rep||{};
  const domain=DOMAIN[meta.domain]||DOMAIN.mood;
  const pct=d.overall?d.overall.pct: (d.pct?d.pct:50);
  const kind=meta.kind||"risk";
  const good=(kind==="well");
  let tier;
  if(good){ tier = pct>=meta.hi||pct>=75?2 : pct>=meta.mid||pct>=55?1:0; }   // tier:0低 1中 2高(佳)
  else     { tier = pct>=meta.hi||pct>=65?2 : pct>=meta.mid||pct>=45?1:0; } // 0好 1中 2关照

  let em,col,head,sub,adv,q,warm;
  const showName=scale.name.replace(/[（(].*?[)）]/g,"").trim();

  if(!good){
    // 风险/负荷型: 分值越低越好 → domain 索引 0好..2关照
    const i=tier;
    em=domain.emoji[i]; col=domain.color[i];
    head=em+" "+domain.names[i];
    sub=(domain.subs.risk||[])[i]||domain.names[i]+"。";
    adv=(domain["a"+i]||domain.a0);
    q=domain.q[i===2&&domain.q[1]?1:0];
    warm="本测评仅作自我认识参考，不构成医疗诊断。若困扰持续或偏重，请及时寻求专业心理帮助——求助是勇敢，不是软弱。";
  } else {
    // 健康/能力型: 分值越高越好 → domain 索引反过来(0=佳 2=待提升)
    const i = tier===2?0 : tier===1?1 : 2;
    em=domain.emoji[i]; col=domain.color[i];
    head=em+" "+domain.names[i];
    const hiW=tier>=2, lowW=tier===0;
    sub= hiW
      ? `你的「${showName}」状态相当不错，稳定而饱满，是值得珍视的底气。`
      : ( lowW
        ? `你的「${showName}」目前还有待生长的空间，这只是阶段性的状态，不必苛责自己。`
        : `你的「${showName}」处于不错的中位，稍加用心就能让它更稳更亮。`);
    adv=(domain["a"+i]||domain.a0);
    q= domain.q ? domain.q[ i===2 ? (domain.q[1]?1:0) : 0 ] : "真正的自我关怀，是看见并接纳真实的自己。";
    warm="感谢你此刻的自我关怀。这份结果供你温柔地看见自己，想往更好的方向走，上面的小建议会是不错的起点。";
  }

  const base = good ? pct : (100-pct);
  const dimNames = (scale.dims||["整体状态"]).slice(0,4);
  let dimBars;
  if(d.dims && Object.keys(d.dims).length){
    const keys=Object.keys(d.dims);
    dimBars=dimNames.map((nm,i)=>{
      const src=d.dims[keys[i]||keys[0]];
      const v=src?src.score:base;
      return {name:nm,pct:Math.max(0,Math.min(100, good? Math.round(v):Math.round(100-v)))};
    });
  } else {
    dimBars=dimNames.map((nm,i)=>({name:nm, pct:Math.max(0,Math.min(100, Math.round(base*(0.85+(i%3)*0.15))))}));
  }
  return {
    headline:head, sub, color:col, tier,
    gauge:{pct:Math.round(pct), label:meta.gaugeLabel||"自评指数", note:good?"分值越高越舒展":"分值越高越需调养"},
    dims:dimBars,
    advice:adv||[], quote:q, warm:warm
  };
}

/* 兜底通用报告 */
function genericReport(d,scale){
  return autoReport(d,scale);
}

/* ============================================================
   图片投射 / 趣味 (pick) 报告
   scale.pickResults: 选项类别被命中后如何解读
   ============================================================ */
function pickReport(scale, d){
  // 主命中类别 = 用户选得最多的选项类别
  let top = (scale.catKeys||Object.keys(d.cats))[0], mx=-1;
  (scale.catKeys||Object.keys(d.cats)).forEach(k=>{ if(d.sums[k]>mx){mx=d.sums[k];top=k;} });
  const res = scale.pickResults && scale.pickResults[top];
  const fallback = {headline:"✨ 你的内在答案", sub:"每一次选择都在替你说话，愿你温柔读懂它。", color:"#c9a3a3", advice:["把这次的发现当作认识自己的起点","不必对号入座，自在做真实的自己"], quote:"你看世界的方式，就是你内心的形状。", warm:"本测试为轻松取向，结果仅供自我娱乐与觉察，不作专业评判。"};
  const R = res||fallback;
  const rc=R.color||"#c9a3a3";
  // 类别分布条
  const dims = (scale.catKeys||Object.keys(d.cats)).map(k=>({name:d.cats[k]&&d.cats[k].name||k, pct:d.dist[k]||0}));
  return {
    headline:R.headline, emoji:R.emoji||"✨", sub:R.sub, color:rc, tier:0,
    gauge:null,
    dims,
    advice:R.advice||[], quote:R.quote||fallback.quote, warm:R.warm||fallback.warm
  };
}

/* ============================================================
   自定义型报告: 九型 / 霍兰德 / 爱的语言
   ============================================================ */
function customReport(scale, d){
  if(scale.custom==="enneagram") return enneagramReport(scale,d);
  if(scale.custom==="holland") return hollandReport(scale,d);
  if(scale.custom==="lovelang") return lovelangReport(scale,d);
  return genericReport(d,scale);
}

/* --- 九型人格 --- */
const ENNE_META={
  one:{n:"1号 · 完美主义者",e:"📐",c:"#c9827a",d:["严谨自律","规则感强","追求卓越"],sub:"你是那个想把事情做对、做好的人。眼中的标准是你的认真，也是你对世界的善意。",a:["允许自己有不完美的部分，松弛一点也是一种完整","把‘必须’换成‘可以’，给自己多一点余地","试着欣赏过程，而不只盯着结果"],q:"足够好，好过完美。"},
  two:{n:"2号 · 助人者",e:"🤝",c:"#e07a8a",d:["温暖慷慨","善解人意","乐于给予"],sub:"你习惯先看到别人的需要，把温暖递给世界。请别忘了，你自己也值得被温柔以待。",a:["先学会为自己着想，你的需要同样重要","练习开口求助，接受别人的好意","设立边界，照顾他人不意味着忽略自己"],q:"懂得爱自己，才能更长久地爱别人。"},
  three:{n:"3号 · 成就者",e:"🏆",c:"#e6bd8e",d:["目标感强","闪亮高效","渴望认可"],sub:"你为目标奔跑的样子闪闪发光。愿你知道，你的价值从不只由成就定义。",a:["允许自己有‘停下来’的时刻","区分‘被认可’与‘真实的自己’","欣赏过程里的成长，而不只盯着结果"],q:"你值得被爱，不是因为优秀，而是因为是你。"},
  four:{n:"4号 · 独特者",e:"🎨",c:"#c9a3cf",d:["细腻感性","追求深度","忠于自我"],sub:"你有一颗丰盈而敏感的心，能看见别人忽略的美与痛。这份独特是你的天赋。",a:["别把自己的不同视作缺憾","用创作与表达安放细腻的情绪","偶尔把目光从内心拉回当下的烟火气"],q:"你的特别，正是世界需要你的理由。"},
  five:{n:"5号 · 观察者",e:"🔭",c:"#6b89b0",d:["冷静理性","爱思考","独立专注"],sub:"你在知识与思考里找到安宁，也为自己筑起稳固的堡垒。偶尔，让光照进内心。",a:["试着适度敞开，分享会让温暖流动","允许自己‘不必准备好’再出发","重视身体与情感的照料，而不只喂养头脑"],q:"头脑是你遮风挡雨的伞，也别忘了晒晒太阳。"},
  six:{n:"6号 · 忠诚者",e:"🛡️",c:"#8a83b5",d:["谨慎可靠","忠贞负责","未雨绸缪"],sub:"你习惯为可能的风雨做足准备，这份谨慎让你可靠可信。愿你也相信自己的安全。",a:["把‘万一’换成‘我能处理’","练习信任自己也信任亲近的人","分辨真实的危险与脑中的担忧"],q:"你可以既谨慎，又信任这个世界正在温柔托举你。"},
  seven:{n:"7号 · 活跃者",e:"🎈",c:"#e6a9a9",d:["乐观自由","热爱新鲜","体验至上"],sub:"你向往自由与快乐，总能把日子过得热热闹闹。请记得，安静的深度同样美好。",a:["允许自己安住当下，体验沉淀","把分散的兴趣收拢成几件深耕的事","不害怕面对那些不那么轻松的情绪"],q:"快乐是天赋，能安住此刻的你更迷人。"},
  eight:{n:"8号 · 挑战者",e:"🦁",c:"#d07a6a",d:["果敢有力","主导掌控","保护他人"],sub:"你敢于直面，也善于担当，是身边人的依靠。刚强之下，也住着柔软的真心。",a:["柔软不是软弱，示弱也是勇气","试着在信任的人面前卸下盔甲","照顾别人的同时，听见自己的需要"],q:"真正的强大，是能保护世界，也能拥抱自己。"},
  nine:{n:"9号 · 和平者",e:"🕊️",c:"#93bda0",d:["温和包容","调和者","内心平静"],sub:"你是让关系归于安宁的和平者，包容而温暖。请别忘了，你的声音同样重要。",a:["练习说出自己的想法与需要","把回避冲突换成温和的正面沟通","为自己的渴望和热情留出位置"],q:"和平不是压抑自己，而是让所有人(包括你)都被看见。"}
};
function enneagramReport(scale,d){
  const key=d.top||"nine";
  const m=ENNE_META[key];
  return {
    typeLabel:m.n, emoji:m.e, headline:m.n, sub:m.sub, color:m.c, tier:0,
    gauge:null,
    dimsBar:[
      {name:"主导倾向", pct: 100},
      {name:"次要 1", pct: d.order&&d.order[1]?Math.round(d.sums[d.order[1]]/Math.max(1,d.sums[key])*100):30},
      {name:"次要 2", pct: d.order&&d.order[2]?Math.round(d.sums[d.order[2]]/Math.max(1,d.sums[key])*100):20}
    ],
    advice:m.a, quote:m.q,
    warm:"九型是你认识自己的其中一面镜子。它描述倾向，不定义全部的你。愿你借它看见优势，也温柔接纳自己有待练习的部分。"
  };
}

/* --- 霍兰德 --- */
const HOLLAND_META={
  R:{n:"R 现实型 · 实干家",e:"🔧",c:"#7fb3d6",d:["动手能力强","务实可靠","热爱操作"],sub:"你偏好动手实干、结果可见的工作。让想法落地，正是你的天赋所在。",a:["选择能发挥你动手与实操天赋的岗位","与技术、工具、自然相关的方向都适合你","把复杂目标拆成一步步去完成的工程"],q:"把世界造得更实在，也是一种了不起的浪漫。"},
  I:{n:"I 研究型 · 思考者",e:"🔬",c:"#6b89b0",d:["爱钻研","逻辑清晰","求知若渴"],sub:"你对‘为什么’抱有持久的好奇，享受在知识深处求解的过程。",a:["研究与分析类、需要深入探究的方向适合你","继续滋养你的求知欲，建立系统知识","多把研究结果分享出来，让价值被看见"],q:"你在问号里寻找答案的样子，本身就在发光。"},
  A:{n:"A 艺术型 · 创作者",e:"🎨",c:"#e0a3cf",d:["富创造力","感受细腻","自由表达"],sub:"你渴望通过创造表达自我，在美与想象里找到归属。",a:["把表达变成职业或持续的爱好","给自己不受评判的创作空间","与同样热爱创造的人彼此滋养"],q:"你的想象力，是这世上稀缺而珍贵的礼物。"},
  S:{n:"S 社会型 · 帮助者",e:"🤝",c:"#7fbfa0",d:["乐于助人","善解人意","重视关系"],sub:"你在帮助他人、促进理解中获得意义，是天生的陪伴与支持者。",a:["教育、心理、医疗、公益等‘与人’方向适合你","学会在助人时也守住自己的边界","把善意用在可持续、专业的方式上"],q:"你用温暖成全他人，也请记得成全自己。"},
  E:{n:"E 企业型 · 引领者",e:"🚀",c:"#e6a35a",d:["敢想敢闯","有领导力","乐于影响"],sub:"你享受目标、说服与引领，能在挑战与影响中感到澎湃。",a:["管理、销售、创业等开拓型方向适合你","把野心化作清晰的路径与行动","在追逐结果时，也经营好关系与诚信"],q:"你的魄力能开路，你的真诚能致远。"},
  C:{n:"C 常规型 · 精算者",e:"🗂️",c:"#a9a9c9",d:["严谨细致","井井有条","追求精确"],sub:"你在秩序与精确里感到安心，是让系统顺畅运转的可靠一环。",a:["财会、行政、数据分析等规范型方向适合你","发挥你的条理与耐心优势","偶尔允许自己打破常规，发现新的可能"],q:"世界的井然有序，正需要你这样细心的守夜人。"}
};
function hollandReport(scale,d){
  const key=d.top||"S";
  const m=HOLLAND_META[key];
  // top3 组合
  const top3=d.order.slice(0,3).join("").replace("R","R").replace("I","I");
  const code3=d.order.slice(0,3).join("");
  return {
    typeLabel:m.n+" ("+code3+")", emoji:m.e, headline:m.n+"（"+code3+"）", sub:m.sub, color:m.c, tier:0,
    gauge:null,
    dimsBar:[
      {name:"现实 R",pct:Math.round(d.sums.R/Math.max(1,d.sums[d.order[0]])*100)||30},
      {name:"研究 I",pct:Math.round(d.sums.I/Math.max(1,d.sums[d.order[0]])*100)||30},
      {name:"艺术 A",pct:Math.round(d.sums.A/Math.max(1,d.sums[d.order[0]])*100)||30},
      {name:"社会 S",pct:Math.round(d.sums.S/Math.max(1,d.sums[d.order[0]])*100)||30},
      {name:"企业 E",pct:Math.round(d.sums.E/Math.max(1,d.sums[d.order[0]])*100)||30},
      {name:"常规 C",pct:Math.round(d.sums.C/Math.max(1,d.sums[d.order[0]])*100)||30}
    ],
    advice:m.a, quote:m.q,
    warm:"霍兰德帮助你看清偏好，但职业是偏好、能力与现实的交汇。愿你用它认识方向，也保留探索的余地。"
  };
}

/* --- 爱的五种语言 --- */
function lovelangReport(scale,d){
  const order=d.order, names=d.names;
  const top=order[0];
  const META={
    aff:"肯定的话语",time:"精心时刻",gift:"接受礼物",serve:"服务的行动",touch:"身体的接触"
  };
  const DES={
    aff:["温暖的言语能直接抵达你的心","一句真诚的肯定，比什么都更能滋养你","多表达欣赏，也期待对方开口说爱"],
    time:["专注的陪伴是你最深的渴望","放下手机的独处时光让你感到被爱","你也在用‘好好陪伴’爱着对方"],
    gift:["用心的小礼物是你在乎的证明","礼物的贵重不如心意，那是一种被记得","你也喜欢通过送礼传递思念"],
    serve:["实实在在的行动比甜言更打动你","对方为你分担，是你能感到的爱","你也习惯用付出与帮忙表达深情"],
    touch:["拥抱与靠近让你感到踏实安心","身体的距离藏着你的安全感","你也用温柔的触碰去安抚所爱"]
  };
  const colors={aff:"#e07a8a",time:"#6b89b0",gift:"#e0a35a",serve:"#7fbfa0",touch:"#c9a3cf"};
  const emoji={aff:"💬",time:"⏳",gift:"🎁",serve:"🛠️",touch:"🤗"};
  return {
    typeLabel:"主要爱的语言 · "+META[top], emoji:emoji[top], headline:META[top], color:colors[top], tier:0,
    sub:"你更习惯通过「"+META[top]+"」来表达与接收爱。读懂彼此的爱的语言，能让爱被真正看见。",
    gauge:null,
    dimsBar:order.map(k=>({name:META[k], pct:Math.round(d.sums[k]/Math.max(1,d.sums[top])*100)||20})),
    advice:DES[top], quote:"爱若用对方听得懂的语言说出，才真正抵达心里。",
    warm:"每个人的爱的语言不同。多去理解伴侣‘收到爱’的方式，也温柔说出自己的需要，感情会因此更贴近。"
  };
}
