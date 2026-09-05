/* ============================================================
   量表扩展 (四)：职业 / 习惯 / 认知
   ============================================================ */
(function(){
"use strict";
const A=window.SCALES;
function push(o){ A.push(o); }

/* ---- 霍兰德职业兴趣 RIASEC (6型·18题简版, custom) ---- */
(function(){
  const RIASEC=["R","I","A","S","E","C"];
  const items={
    R:["动手拆装、维修或制作实物让我投入","我喜欢户外活动或操控工具器械","解决问题时我倾向动手实验而非空谈"],
    I:["我喜欢探究原理、弄清‘为什么’","钻研数据或技术细节让我专注","我对科学、规律与新知充满好奇"],
    A:["绘画、音乐、写作让我自在表达","我乐于创造有美感或创意的事物","我的想法常有想象与艺术色彩"],
    S:["帮助他人成长让我有成就感","我擅长倾听并给人支持","我享受与人打交道、服务他人"],
    E:["我享受说服、带领大家去达成目标","组织与影响他人让我感到有力量","我乐于承担领导与开拓的角色"],
    C:["我把事情整理得井井有条让我安心","我喜欢清晰规则下的精确工作","细心核对与数据管理我做得很好"]
  };
  const qs=[];
  ["R","I","A","S","E","C"].forEach(letter=>{
    items[letter].forEach(t=>qs.push({h:letter,t}));
  });
  push({
    id:"holland", name:"霍兰德职业兴趣", category:"人格特质", emoji:"🧭",
    colors:["#a9c9dd","#7fb3d6"], duration:"约 2 分钟 · 18 题",
    desc:"依据霍兰德 RIASEC 理论，从现实型到企业型，看你的职业兴趣主导倾向。",
    mode:"custom", custom:"holland",
    options:["不太像我","有点像我","很像我","非常像我"], weights:[0,1,2,3],
    questions:qs
  });
})();

/* ---- 职业倦怠 ---- */
push({
  id:"burnout", name:"职业倦怠自评", category:"压力水平", emoji:"🪫",
  colors:["#c9c3a9","#aea57f"], duration:"约 1.5 分钟 · 10 题",
  desc:"从情感耗竭、去个性化与成就感低落，回看你是否正被工作消耗。",
  dims:["情感耗竭","疏离感","成就感"],
  mode:"score", options:["从不","偶尔","经常","几乎每天"], weights:[0,1,2,3],
  rep:{domain:"career",kind:"risk",mid:45,hi:65,gaugeLabel:"职业倦怠指数"},
  questions:[
    {d:0,t:"下班后我常觉得身心被掏空、提不起劲",r:false},
    {d:0,t:"一想到要上班我就感到疲惫或抵触",r:false},
    {d:0,t:"工作占据了我太多精力，难有生活",r:false},
    {d:1,t:"我对工作变得冷淡，不太在意结果",r:false},
    {d:1,t:"我越来越难以对同事/客户保持耐心",r:false},
    {d:1,t:"我觉得工作与同事都与我有些疏离",r:false},
    {d:2,t:"我常怀疑自己的工作能力或价值",r:false},
    {d:2,t:"即便做成了事，我也很少感到成就",r:false},
    {d:0,t:"睡眠与休息也难以让我恢复状态",r:false},
    {d:2,t:"倦怠感已影响我的情绪或身体",r:false}
  ]
});

/* ---- 职场压力 ---- */
push({
  id:"workstress", name:"职场压力自评", category:"压力水平", emoji:"⏱️",
  colors:["#d0b8a9","#bd9c89"], duration:"约 1.5 分钟 · 10 题",
  desc:"从任务负荷、时间与期望三方面，回看你正承受的职场压力水平。",
  dims:["任务负荷","时间压力","期望负担"],
  mode:"score", options:["从不","偶尔","经常","几乎每天"], weights:[0,1,2,3],
  rep:{domain:"career",kind:"risk",mid:45,hi:65,gaugeLabel:"职场压力指数"},
  questions:[
    {d:0,t:"我的工作任务常多到难以完成",r:false},
    {d:0,t:"我需要加班或把工作带回家",r:false},
    {d:1,t:"我常赶在截止日期前手忙脚乱",r:false},
    {d:1,t:"我难以从工作中抽离、大脑停不下来",r:false},
    {d:2,t:"上司或组织的期望常让我不堪重负",r:false},
    {d:2,t:"工作竞争或考核让我长期紧绷",r:false},
    {d:0,t:"我几乎没有喘息和放松的时间",r:false},
    {d:1,t:"我常担忧自己是否会被淘汰或落后",r:false},
    {d:2,t:"压力已开始影响我的睡眠或身体",r:false},
    {d:2,t:"职场压力让我对工作心生倦怠",r:false}
  ]
});

/* ---- 手机/网络依赖 ---- */
push({
  id:"screen", name:"手机网络依赖自查", category:"压力水平", emoji:"📱",
  colors:["#a9c9dd","#82afcf"], duration:"约 1.5 分钟 · 10 题",
  desc:"从失控、戒断与影响生活三方面，温柔回看你和屏幕的‘难分难舍’。",
  dims:["失控使用","戒断反应","影响生活"],
  mode:"score", options:["从不","偶尔","经常","几乎每天"], weights:[0,1,2,3],
  rep:{domain:"habit",kind:"risk",mid:45,hi:62,gaugeLabel:"屏幕依赖指数"},
  questions:[
    {d:0,t:"我拿起手机刷着刷着，时间就不知不觉过去了",r:false},
    {d:0,t:"我常说‘再刷五分钟’却停不下来",r:false},
    {d:0,t:"我想控制用手机却常常失败",r:false},
    {d:1,t:"手机不在身边我会焦躁、坐立难安",r:false},
    {d:1,t:"我睡前总要刷很久，明知影响睡眠也难放下",r:false},
    {d:1,t:"我用手机排解无聊、焦虑或低落",r:false},
    {d:2,t:"过度使用已影响我的作息或身体",r:false},
    {d:2,t:"它挤占了我与家人朋友相处的时间",r:false},
    {d:2,t:"它让我的专注力和效率下降",r:false},
    {d:2,t:"我意识到自己可能有些依赖却难以摆脱",r:false}
  ]
});

/* ---- 拖延倾向 ---- */
push({
  id:"procrast", name:"拖延倾向测评", category:"压力水平", emoji:"🦥",
  colors:["#c9d0a9","#a6b27f"], duration:"约 1.5 分钟 · 10 题",
  desc:"看你在面对任务时的启动与坚持情况(分值越高拖延越明显)。",
  dims:["启动困难","回避拖延","自责循环"],
  mode:"score", options:["从不","偶尔","经常","几乎总是"], weights:[0,1,2,3],
  rep:{domain:"habit",kind:"risk",mid:45,hi:62,gaugeLabel:"拖延倾向指数"},
  questions:[
    {t:"明知重要，我也常拖到最后一刻才开始",r:false},
    {t:"面对困难或枯燥的任务，我总想先做别的",r:false},
    {t:"我常因分心而难以按计划推进",r:false},
    {t:"我开始一件事前会犹豫很久",r:false},
    {t:"我常靠截止日期的压迫感来驱动自己",r:false},
    {t:"拖延让我错过机会或降低质量",r:false},
    {t:"拖完后我常自责，却仍在下一次拖延",r:false},
    {t:"我因拖延而常常焦虑不安",r:false},
    {t:"有些事我一拖再拖，始终没真正开始",r:false},
    {t:"拖延已影响到我的学业或工作",r:false}
  ]
});

/* ---- 情商 EQ 简测 ---- */
push({
  id:"eq", name:"情商 EQ 测评", category:"情绪状态", emoji:"💡",
  colors:["#a9d0cf","#7fbdbd"], duration:"约 1.5 分钟 · 12 题",
  desc:"从识别、管理、运用与理解情绪四个维度，回看你的情商整体水平(分值越高越佳)。",
  dims:["觉察情绪","管理情绪","共情他人","激励自我"],
  mode:"score", options:["几乎不","偶尔","经常","几乎总是"], weights:[1,2,3,4],
  rep:{domain:"mood",kind:"well",mid:52,hi:70,gaugeLabel:"情商指数"},
  questions:[
    {d:0,t:"我能及时察觉自己情绪的变化",r:false},
    {d:0,t:"我能分辨自己此刻是难过、愤怒还是疲惫",r:false},
    {d:1,t:"情绪上头时我仍能做出较明智的选择",r:false},
    {d:1,t:"我很少被情绪冲昏头而说出伤人话",r:false},
    {d:1,t:"我能用合适的方式让自己平静下来",r:false},
    {d:2,t:"我能读懂他人情绪与言外之意",r:false},
    {d:2,t:"我懂得如何让他人感觉被理解",r:false},
    {d:3,t:"即便受挫，我也能调整心态继续前行",r:false},
    {d:3,t:"我能在压力下自我激励而不内耗",r:false},
    {d:0,t:"总体看，我对自己的情绪较有掌控力",r:false}
  ]
});

})();
