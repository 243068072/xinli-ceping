/* ============================================================
   心屿测评 · 主逻辑
   ============================================================ */
(function(){
"use strict";

const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));

const state={
  view:"home",            // home | intro | quiz | report
  scale:null,
  answers:[],
  cur:0,
  filter:"all",
  q:""            // 标题搜索关键字
};

/* ---------- 视图切换 ---------- */
function go(view){ state.view=view; $$(".view").forEach(v=>v.classList.remove("active")); $("#view-"+view).classList.add("active"); window.scrollTo({top:0,behavior:"smooth"}); }

/* ---------- 分类筛选 ---------- */
function categories(){
  return ["情绪状态","压力水平","人格特质","人际关系","图片投射","趣味心理"];
}
const PROF_CATS=["情绪状态","压力水平","人格特质","人际关系"];
function profCount(){ return SCALES.filter(s=>PROF_CATS.includes(s.category)).length; }
function catCount(c){ return SCALES.filter(s=>s.category===c).length; }

/* ---------- 渲染首页 ---------- */
function renderHome(){
  const cats=categories();
  const q=(state.q||"").trim().toLowerCase();
  const searching = q.length>0;

  // filter chips: 搜索时隐藏分类，避免干扰
  const frow=$("#filters");
  if(searching){
    frow.innerHTML="";
  } else {
    frow.innerHTML = `<button class="chip ${state.filter==='all'?'on':''}" data-f="all">全部 ${SCALES.length}</button>`+
      cats.map(c=>`<button class="chip ${state.filter===c?'on':''}" data-f="${c}">${c} ${SCALES.filter(s=>s.category===c).length}</button>`).join("");
    frow.querySelectorAll(".chip").forEach(ch=>ch.onclick=()=>{state.filter=ch.dataset.f;renderHome();});
  }

  // 搜索框同步
  const sb=$("#searchBox"); if(sb && sb.value!==(state.q||"")) sb.value=state.q||"";
  const sc=$("#searchClear"); if(sc) sc.style.display = q?"flex":"none";

  const grid=$("#grid"); grid.innerHTML="";
  let list = state.filter==='all' ? SCALES : SCALES.filter(s=>s.category===state.filter);
  if(searching){
    list = SCALES.filter(s=> (s.name||"").toLowerCase().includes(q) || (s.desc||"").toLowerCase().includes(q));
  }
  if(!list.length){ grid.innerHTML='<div class="empty">'+(searching?'没有找到相关的测评 🌱 换个关键词试试': '这里还没有测评 🌱')+'</div>'; }
  list.forEach(s=>{
    const c=s.colors||["#b7d3bc","#a6c8ae"];
    const card=document.createElement("div");
    card.className="test-card"; card.style.setProperty("--c1",c[0]); card.style.setProperty("--c2",c[1]||c[0]);
    card.innerHTML=`
      <span class="cat">${s.category}</span>
      <h4>${s.emoji} ${s.name}</h4>
      <p>${s.desc}</p>
      <div class="meta">
        <span class="dur">⏱ ${s.duration}</span>
        <span class="go">开始测评
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
      </div>`;
    card.onclick=()=>openIntro(s.id);
    grid.appendChild(card);
  });
}

/* ---------- 打开某测评介绍 ---------- */
function openIntro(id){
  const s=SCALES.find(x=>x.id===id); if(!s) return;
  state.scale=s; state.answers=new Array(s.questions.length).fill(null); state.cur=0;
  renderIntro(); go("intro");
}
function renderIntro(){
  const s=state.scale; const c=s.colors||["#9fc7a8"];
  const cEl=$("#view-intro"); cEl.innerHTML=`
    <div class="page-head">
      <button class="back-btn" id="introBack">${backIcon()}</button>
      <div class="pt"><div class="cattag">${s.category}</div><h2>${s.name}</h2></div>
      <button class="reset-mini" id="introReset" style="visibility:hidden">重选</button>
    </div>
    <div class="intro-card" style="--rc:${c[0]}">
      <div style="background:linear-gradient(135deg,color-mix(in srgb,${c[0]} 18%,white),transparent);margin:-34px -34px 0;padding:34px">
        <div class="big-emoji">${s.emoji}</div>
        <h3>${s.name}</h3>
        <p class="lead">${s.desc}</p>
      </div>
      <div class="info-grid">
        <div class="info-box"><div class="k">题量</div><div class="v">${s.questions.length} 题</div></div>
        <div class="info-box"><div class="k">预计用时</div><div class="v">${(s.duration.match(/\d+/)?s.duration:"").replace(/·.*/,"").trim()||"约 3 分钟"}</div></div>
        <div class="info-box"><div class="k">结果</div><div class="v">专属测评报告</div></div>
      </div>
      <div style="font-size:.88rem;color:#6b6d77">${s.duration} · 完成后将为您生成一份温暖的图文解读报告。</div>
      <div class="dim-list">${(s.dims||[]).map(d=>`<span class="dim-tag">${d}</span>`).join("")}</div>
      <button class="btn-start" id="startQuiz">开始测评 ${arrowIcon()}</button>
      <div class="legal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b5915a" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16.5v.5"/></svg>
        <div><b>温馨提示</b>：本测评基于心理学标准化量表改编，仅用于增进自我了解与觉察，<b>不构成医疗诊断</b>。请理性看待结果，如有持续困扰请寻求专业心理帮助。</div>
      </div>
    </div>`;
  $("#introBack").onclick=()=>go("home");
  $("#startQuiz").onclick=()=>startQuiz();
}
function startQuiz(){
  state.cur=0; renderQuiz(); go("quiz");
}

/* ---------- 作答 ---------- */
function renderQuiz(){
  const s=state.scale;
  const dimTag = s.dims && s.dims.length===s.questions.length ? s.dims[state.cur] : null;
  const cEl=$("#view-quiz"); cEl.innerHTML=`
    <div class="page-head">
      <button class="back-btn" id="quizBack">${backIcon()}</button>
      <div class="pt"><div class="cattag">${s.category}</div><h2>${s.name}</h2></div>
      <button class="reset-mini" id="quizReset">退出测评</button>
    </div>
    <div class="quiz-wrap">
      <div class="quiz-top">
        <div class="quiz-count"><b>${state.cur+1}</b> / ${s.questions.length}</div>
        <div class="prog-track"><div class="prog-fill" id="progFill"></div></div>
      </div>
      ${dimTag?`<div class="dim-hint">${dimTag}</div>`:""}
      <div class="quiz-q" id="quizQ"></div>
      <div class="quiz-art" id="artArea"></div>
      <div class="opt-list" id="optList"></div>
      <div class="quiz-nav">
        <button class="nav-btn ghost" id="btnPrev">← 上一题</button>
        <button class="nav-btn primary" id="btnNext">下一题 →</button>
      </div>
    </div>`;
  const q=s.questions[state.cur];
  $("#quizBack").onclick=()=>go("home");
  $("#quizReset").onclick=()=>resetConfirm();
  renderQuestion(q);
  const fill=$("#progFill"); fill.style.width=(state.cur/(s.questions.length))*100+"%";
  updateNav();
}

function renderQuestion(q){
  const s=state.scale;
  const list=$("#optList"); list.innerHTML="";
  const qq=$("#quizQ");
  const art=$("#artArea"); if(art) art.innerHTML="";
  const curAns=state.answers[state.cur];
  const isPic = s.mode==="pick" || s.kind==="image";

  /* 题目文本 */
  if(isPic && q.ask){
    qq.style.cssText=""; qq.textContent=q.ask;
  } else if(s.mode==="custom" && s.custom==="enneagram"){
    qq.innerHTML=""; const lead=document.createElement("div"); lead.style.cssText="font-size:.96rem;color:#8b8d97;font-weight:400;line-height:1.6";
    lead.textContent="请选出更贴近你的一侧（没有完全相同的选项，凭第一感觉即可）";
    qq.appendChild(lead);
  } else {
    qq.style.cssText=""; qq.textContent = q.t || q.ask || s.name;
  }

  /* 图片题: 显示内嵌图像 */
  if(isPic && q.art && art){ art.innerHTML=`<div class="imgwrap" style="--rc:${s.colors?.[0]||'#c9c3e0'}">${q.art}</div>`; }

  const pick=isPic;

  function optRow(txt, idx, sub){
    const row=document.createElement("div");
    row.className="opt"+(curAns===idx?" sel":"");
    row.innerHTML=`<div class="dot"></div><div class="txt">${txt}</div>${sub?`<div class="k" style="flex:0 0 auto;max-width:120px;text-align:right">${sub}</div>`:`<div class="k">${labelOf(s.options?s.options.length:(q.options||[]).length,idx)}</div>`}`;
    row.onclick=()=>{ state.answers[state.cur]=idx; renderQuestion(q); updateNav(); };
    list.appendChild(row);
  }

  if(s.mode==="type" && s.dimType==="dichotomy"){
    const opts=[{txt:q.t,k:"更像我"},{txt:"中间 / 都有一点",mid:true},{txt:q.t2,k:"更像我"}];
    opts.forEach((o,oi)=>{ optRow(o.txt||"",oi,o.mid?"":"更像我"); });
    return;
  }

  if(s.mode==="custom"){
    if(s.custom==="enneagram"){
      const pair=[{txt:q.a},{txt:q.b}];
      pair.forEach((o,oi)=>{ optRow(o.txt, oi, oi===0?"前句":"后句"); });
      return;
    }
    if(s.custom==="holland" || s.custom==="lovelang"){
      // 陈述 + 程度likert(scale.options)
      (s.options||[]).forEach((txt,oi)=>optRow(txt,oi));
      return;
    }
  }

  if(isPic && q.options && Array.isArray(q.options) && q.options.length && typeof q.options[0]!=="string"){
    q.options.forEach((o,oi)=>{ optRow(o.t||"", oi, o.hint||""); });
    return;
  }

  // 默认 likert(scale.options 字符串) 或 pick 字符串选项
  const opts = (q.options&&Array.isArray(q.options))? q.options.map((o,i)=>typeof o==="string"?o:(o&&o.t?o.t:"")) : (s.options||[]);
  (opts).forEach((txt,oi)=>optRow(txt,oi));
}

function labelOf(n,i){
  const map={2:["A","B"],3:["A","B","C"],4:["A","B","C","D"],5:["A","B","C","D","E"]};
  return map[n]?map[n][i]||"":"";
}

function updateNav(){
  const s=state.scale;
  const done = state.answers[state.cur]!=null;
  const last = state.cur===s.questions.length-1;
  const btnNext=$("#btnNext");
  const btnPrev=$("#btnPrev");
  if(btnPrev) btnPrev.disabled = state.cur===0;
  if(btnNext){
    btnNext.textContent = last? "查看报告 ✨" : "下一题 →";
    btnNext.disabled = !done;
    btnNext.onclick=()=>{
      if(!done){ toast("请先选择一个选项 🍃"); return; }
      if(last) finishQuiz(); else { state.cur++; renderQuiz(); }
    };
  }
  if(btnPrev) btnPrev.onclick=()=>{ if(state.cur>0){state.cur--;renderQuiz();} };
  const allDone = state.answers.every(a=>a!=null);
  // 允许随时跳过? 采用"需全部作答"策略
  if(last) btnNext.disabled=!done;
}

function finishQuiz(){
  // 校验全答
  const empty = state.answers.findIndex(a=>a==null);
  if(empty!==-1){ state.cur=empty; renderQuiz(); toast("还有题目未完成，我们继续 🌱"); return; }
  const result = buildReport(state.scale, state.answers);
  state.lastResult=result;
  renderReport(result);
  go("report");
}
function resetConfirm(){
  toast("测评已退出，随时可以回来继续认识自己 🌿");
  go("home");
}

/* ---------- 报告 ---------- */
function renderReport(r){
  const s=state.scale;
  const rc=r.color||(s.colors?.[0])||"#9fc7a8";
  const rc2=(s.colors?.[1])||rc;
  const el=$("#view-report"); el.innerHTML="";
  const sec=document.createElement("div"); sec.className="report";
  sec.style.setProperty("--rc",rc); sec.style.setProperty("--rc2",rc2);

  /* 封面 */
  let cover=`
    <div class="report-card">
      <div class="report-cover">
        <div class="rcat">${s.category} · 测评报告</div>
        <h2>${s.name}</h2>
        <div class="stamp">生成于 ${today()}</div>
        <div class="score-hero">
          ${r.gauge? ringHTML(r.gauge, rc) : ""}
          <div class="verdict">
            ${r.typeLabel ? `<div class="v-title" style="color:${r.color||'#33343c'};display:flex;align-items:center;gap:8px">${r.emoji?`<span style="font-size:2rem">${r.emoji}</span>`:""}${r.typeLabel}</div>`
                          : `<div class="v-title" style="color:${r.color||'#33343c'}">${r.emoji?r.emoji+" ":""}${r.headline||""}</div>`}
            <div class="v-sub" style="margin-top:6px">${r.sub||""}</div>
          </div>
        </div>
      </div>
      <div class="report-body">
        ${r.axisBars? axisBarsHTML(r.axisBars, rc, rc2) : (r.dimsBar? dimsBarsHTML(r.dimsBar,"维度分布",rc,rc2) : (r.dims? dimsBarsHTML(r.dims,"状态拆解",rc,rc2):""))}
        <div class="blk">
          <div class="blk-head"><span class="ic">${leafIcon()}</span><h3>给你的温柔建议</h3></div>
          <div class="blk-body"><ul class="sugg-list">${(r.advice||[]).map(a=>`<li><span class="heart">${heartIcon()}</span><span>${a}</span></li>`).join("")}</ul></div>
        </div>
        <div class="quote">
          <div class="q-svg">${quoteIcon()}</div>
          <p>${r.quote||""}</p>
          <div class="q-src">— 心屿治愈寄语</div>
        </div>
        <div class="warm-note">${heartIcon2()} <span>${r.warm||""}</span></div>
      </div>
    </div>`;

  /* 操作栏 */
  cover+=`
    <div class="report-actions">
      <button class="act solid" id="actAgain">${againIcon()} 重新测评</button>
      <button class="act" id="actDl">${dlIcon()} 下载报告</button>
      <button class="act" id="actCopy">${copyIcon()} 复制报告</button>
      <button class="act soft" id="actHome">${homeIcon()} 返回首页</button>
    </div>`;
  sec.innerHTML=cover;
  el.appendChild(sec);

  $("#actAgain").onclick=()=>startQuiz();
  $("#actHome").onclick=()=>go("home");
  $("#actDl").onclick=()=>downloadReport(r);
  $("#actCopy").onclick=()=>copyReport(r);

  requestAnimationFrame(()=>{ $$("#view-report .bar i").forEach(b=>{ b.style.width=b.dataset.w+"%"; }); });
}

function ringHTML(g,rc){
  const pct=Math.max(0,Math.min(100,g.pct||0));
  const C=2*Math.PI*54;
  return `<div class="ringbox">
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle cx="64" cy="64" r="54" fill="none" stroke="#f0ece1" stroke-width="13"/>
      <circle cx="64" cy="64" r="54" fill="none" stroke="${rc}" stroke-width="13" stroke-linecap="round"
        stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct/100)}" style="transition:stroke-dashoffset 1.3s cubic-bezier(.2,.7,.2,1)"/>
    </svg>
    <div class="ring-label"><b>${pct}</b><span>${g.label||""}</span></div>
  </div>`;
}
function dimsBarsHTML(dims,title,rc,rc2){
  return `<div class="blk">
    <div class="blk-head"><span class="ic">${gridIcon()}</span><h3>${title}</h3></div>
    <div class="blk-body"><div class="dim-gauge">
      ${dims.map(d=>`<div class="dim-row">
        <div class="dim-name"><b>${d.name}</b><span>${Math.max(0,Math.min(100,d.pct))}</span></div>
        <div class="bar"><i data-w="${Math.max(0,Math.min(100,d.pct))}" style="background:linear-gradient(90deg,${rc},${rc2})"></i></div>
      </div>`).join("")}
    </div></div>
  </div>`;
}
function axisBarsHTML(bars,rc,rc2){
  return `<div class="blk">
    <div class="blk-head"><span class="ic">${gridIcon()}</span><h3>你的偏好构成</h3></div>
    <div class="blk-body"><div class="dim-gauge">
      ${bars.map(b=>`<div class="dim-row">
        <div class="dim-name"><b>${b.name} · ${b.a}</b><span>${Math.max(0,Math.min(100,b.pa))}% 偏好</span></div>
        <div class="bar"><i data-w="${Math.max(0,Math.min(100,b.pa))}" style="background:linear-gradient(90deg,${rc},${rc2})"></i></div>
      </div>`).join("")}
    </div></div>
  </div>`;
}

/* ---------- 报告文案(复制/下载共用) ---------- */
function reportText(r){
  const s=state.scale;
  const lines=[
    `「${s.name}」测评报告`, today(),
    ``,
    `· ${r.emoji?r.emoji+" ":""}${r.headline||r.typeLabel||""}`,
    r.typeLabel?`· 类型：${r.typeLabel}`:"",
    r.sub,
    ``,
    r.gauge?`综合指数：${r.gauge.pct}/100（${r.gauge.label||""}）`:"",
    ``,
    "给你的温柔建议：",
    ...(r.advice||[]).map((a,i)=>(i+1)+". "+a),
    ``,
    `治愈寄语：${r.quote||""}`,
    ``,
    r.warm?`❤ ${r.warm}`:"",
    ``,
    "本报告仅用于自我认识参考，不构成医疗诊断。",
    "— 心屿测评 · 愿你被这世界温柔以待"
  ].filter(l=>l!=="");
  return lines.join("\n");
}

/* ---------- 复制报告 ---------- */
function copyReport(r){
  const txt=reportText(r);
  (navigator.clipboard? navigator.clipboard.writeText(txt): Promise.reject())
    .then(()=>toast("报告已复制到剪贴板 🌟"))
    .catch(()=>{ fallbackCopy(txt); });
}
function fallbackCopy(txt){
  const ta=document.createElement("textarea"); ta.value=txt; document.body.appendChild(ta);
  ta.select(); try{ document.execCommand("copy"); toast("报告已复制到剪贴板 🌟");}catch(e){ toast("复制失败，请手动截图保存"); }
  document.body.removeChild(ta);
}

/* ---------- 下载报告(生成图片 PNG) ---------- */
function downloadReport(r){
  const s=state.scale;
  const rc=r.color||(s.colors?.[0])||"#9fc7a8";
  try{
    const W=880, pad=56;
    // 预估行高, 先算纵向尺寸
    const ctx0=document.createElement("canvas").getContext("2d");
    ctx0.font="24px sans-serif";
    const bodyW=W-pad*2;
    function lines(s,font,mw){ ctx0.font=font; const out=[]; let cur=""; for(const ch of String(s)){ if(ctx0.measureText(cur+ch).width>mw){ out.push(cur); cur=ch;} else cur+=ch; } out.push(cur); return out; }
    let y=pad, H;
    y+=0;
    const titleLines=lines(s.name, "700 40px sans-serif", bodyW); y+= titleLines.length*48+8;
    y+= (r.typeLabel? 42:40);            // 主判定
    const subL=lines(r.sub||"", "22px sans-serif", bodyW); y+= subL.length*32+20;
    if(r.gauge) y+= 70;
    const advL=(r.advice||[]).map(a=>lines(a,"21px sans-serif",bodyW-40)); 
    y+= (r.advice? r.advice.length:0)*30; advL.forEach(a=>y+=(a.length-1)*30); y+=20;
    const qL=lines(r.quote||"", "22px sans-serif", bodyW); y+= qL.length*34+26;
    const warmL=lines(r.warm||"", "18px sans-serif", bodyW); y+= warmL.length*28+30;
    y+=50;
    H=Math.ceil(y)+pad;
    if(H<700) H=700;

    const c=document.createElement("canvas"); c.width=W; c.height=H;
    const g=c.getContext("2d");
    // 背景
    const bg=g.createLinearGradient(0,0,W,H); bg.addColorStop(0,"#fbf7ee"); bg.addColorStop(1,"#f3eee2");
    g.fillStyle=bg; g.fillRect(0,0,W,H);
    // 顶部装饰条
    g.fillStyle=rc; g.fillRect(0,0,W,8);
    // 卡片标题区
    g.fillStyle="#6b6d77"; g.font="18px sans-serif"; g.textBaseline="top";
    g.fillText((s.category||"测评")+" · 测评报告", pad, 44);
    g.font="600 40px sans-serif"; g.fillStyle="#33343c";
    let ty=84;
    for(const l of titleLines){ g.fillText(l, pad, ty); ty+=48; }
    g.strokeStyle=rc; g.lineWidth=3; g.beginPath(); g.moveTo(pad, ty+2); g.lineTo(W-pad, ty+2); g.stroke();
    ty+=22;

    // 主判定
    if(r.emoji){ g.font="30px sans-serif"; g.fillText(r.emoji, pad, ty); }
    g.font="600 27px sans-serif"; g.fillStyle=rc;
    const mainTxt=(r.headline||r.typeLabel||"").replace(/^[^\s\u4e00-\u9fa5A-Za-z0-9]+/,"");
    g.fillText((r.typeLabel||r.headline||""), pad+(r.emoji?46:0), ty);
    ty+=40;
    g.font="22px sans-serif"; g.fillStyle="#5d5f69";
    for(const l of subL){ g.fillText(l, pad, ty); ty+=32; }
    ty+=12;

    // 分数
    if(r.gauge){
      const pct=Math.max(0,Math.min(100,r.gauge.pct||0));
      const gx=pad, gw=bodyW;
      g.fillStyle="#e6e0d2"; g.beginPath(); g.roundRect(gx,ty,gw,16,8); g.fill();
      g.fillStyle=rc; g.beginPath(); g.roundRect(gx,ty,gw*pct/100,16,8); g.fill();
      g.fillStyle="#33343c"; g.font="600 22px sans-serif";
      g.fillText((r.gauge.label||"自评指数")+"  "+pct+" / 100", pad, ty+24);
      ty+=52;
    }
    ty+=6;

    // 建议
    g.font="600 23px sans-serif"; g.fillStyle="#33343c"; g.fillText("给你的温柔建议", pad, ty); ty+=38;
    (r.advice||[]).forEach((a,ai)=>{
      const as=lines(a,"21px sans-serif",bodyW-40);
      g.font="21px sans-serif"; g.fillStyle="#44454d";
      g.fillText((ai+1)+".", pad, ty);
      let cx=pad+30;
      for(let li=0;li<as.length;li++){
        g.fillText(as[li], cx, ty);
        ty+=30; cx=pad+30;
      }
      ty+=6;
    });
    ty+=12;

    // 寄语卡
    g.fillStyle="rgba(216,185,138,.18)"; g.beginPath(); g.roundRect(pad,ty,bodyW, qL.length*34+26, 14); g.fill();
    g.font="italic 22px serif"; g.fillStyle="#8a6d45";
    let qy=ty+14;
    for(const l of qL){ g.fillText("“"+l, pad+22, qy); qy+=34; }
    ty+= qL.length*34+40;

    // 温馨提醒
    g.font="18px sans-serif"; g.fillStyle="#8b8d97";
    for(const l of warmL){ g.fillText(l, pad, ty); ty+=28; }

    // 页脚
    g.fillStyle="#c2beb0"; g.font="17px sans-serif";
    g.fillText("— 心屿测评 · 愿你被这世界温柔以待", pad, H-46);

    // 下载
    const a=document.createElement("a");
    a.href=c.toDataURL("image/png");
    a.download=(s.name.replace(/[^\w\u4e00-\u9fa5]/g,"")||"心屿测评报告")+"_报告.png";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast("报告图片已下载 📥");
  }catch(e){
    // 降级: 下载 txt
    try{
      const blob=new Blob([reportText(r)],{type:"text/plain;charset=utf-8"});
      const a=document.createElement("a");
      a.href=URL.createObjectURL(blob);
      a.download=(s.name.replace(/[^\w\u4e00-\u9fa5]/g,"")||"心屿测评报告")+"_报告.txt";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(a.href),1000);
      toast("报告已下载 📥");
    }catch(e2){ toast("下载失败，请尝试截图保存"); }
  }
}

/* ---------- toast ---------- */
let toastTimer;
function toast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove("show"),1800);
}

/* ---------- 图标 ---------- */
const backIcon=()=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>`;
const arrowIcon=()=>`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const leafIcon=()=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;
const heartIcon=()=>`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const heartIcon2=()=>`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="flex:0 0 auto;color:inherit"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const quoteIcon=()=>`<svg width="26" height="26" viewBox="0 0 24 24" fill="#d8b98a"><path d="M9.6 5C6 6.6 3.5 9.9 3.5 14c0 2.8 1.9 5 4.5 5 2.4 0 4.2-1.8 4.2-4.3 0-2.4-1.7-4.2-4-4.2-.2 0-.5 0-.6.1.4-2.1 2-4.2 4-5.2L9.6 5zm10.4 0c-3.6 1.6-6.1 4.9-6.1 9 0 2.8 1.9 5 4.5 5 2.4 0 4.2-1.8 4.2-4.3 0-2.4-1.7-4.2-4-4.2-.2 0-.5 0-.6.1.4-2.1 2-4.2 4-5.2L20 5z"/></svg>`;
const gridIcon=()=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`;
const againIcon=()=>`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>`;
const copyIcon=()=>`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const homeIcon=()=>`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></svg>`;
const dlIcon=()=>`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>`;

function today(){
  const d=new Date(); const p=n=>String(n).padStart(2,"0");
  return `${d.getFullYear()} 年 ${d.getMonth()+1} 月 ${d.getDate()} 日`;
}

/* ---------- 初始化 ---------- */
// 标题搜索
const searchBox=$("#searchBox");
if(searchBox){
  searchBox.addEventListener("input",()=>{ state.q=searchBox.value; state.filter="all"; renderHome(); });
  const clear=$("#searchClear");
  if(clear) clear.onclick=()=>{ searchBox.value=""; state.q=""; renderHome(); searchBox.focus(); };
}
renderHome();
go("home");
})();
