/* ============================================================
   量表扩展 (一)：情绪 / 临床向筛查  (追加到 window.SCALES)
   rep.domain: mood|stress|sleep|self|relation|career|habit|fun
   rep.kind: risk(越高越需关照) / well(越高越舒展)
   ============================================================ */
(function(){
"use strict";
const A=window.SCALES;
function push(o){ A.push(o); }

/* ---- 强迫倾向自评 ---- */
push({
  id:"ocd", name:"强迫倾向自查", category:"情绪状态", emoji:"🔁",
  colors:["#c6c0dd","#a9a1cf"], duration:"约 2 分钟 · 12 题",
  desc:"从反复的念头与动作两个角度，温柔地回看近两周是否有让你停不下来的‘必须’。",
  dims:["反复念头","强迫行为"],
  mode:"score", options:["完全没有","偶尔","经常","几乎总是"], weights:[0,1,2,3],
  rep:{domain:"habit",kind:"risk",mid:45,hi:65,gaugeLabel:"强迫困扰指数"},
  questions:[
    {d:0,t:"一些念头会不受控制地反复闯入我的脑海",r:false},
    {d:0,t:"我会反复检查门锁、煤气或开关，明知没必要却停不下来",r:false},
    {d:0,t:"我担心自己不小心伤害到别人或做错事",r:false},
    {d:0,t:"我不喜欢事物被弄乱，必须按特定顺序摆放",r:false},
    {d:1,t:"我反复洗手或清洁，总觉得没弄干净",r:false},
    {d:1,t:"我会在心里默数或重复某个动作来‘对抗’不好的念头",r:false},
    {d:0,t:"这些念头或动作占用了我的时间，让我疲惫",r:false},
    {d:1,t:"我常需要按固定仪式完成事情，否则会焦虑",r:false},
    {d:0,t:"即便理智上知道没必要时，我仍会被某种不安驱赶",r:false},
    {d:1,t:"反复的行为让我觉得失控，却难以停止",r:false},
    {d:0,t:"我常为‘万一’而过度担忧",r:false},
    {d:1,t:"这些困扰影响了我的专注、睡眠或人际",r:false}
  ]
});

/* ---- 社交焦虑自查 ---- */
push({
  id:"social", name:"社交焦虑自查", category:"情绪状态", emoji:"🎭",
  colors:["#a9c9dd","#86b6d0"], duration:"约 2 分钟 · 12 题",
  desc:"从人群、被注视与表达三个场景，回看您在人际场合里感到紧张的程度。",
  dims:["人群场合","被注视","当众表达"],
  mode:"score", options:["从不","偶尔","经常","几乎总是"], weights:[0,1,2,3],
  rep:{domain:"mood",kind:"risk",mid:45,hi:65,gaugeLabel:"社交紧张指数"},
  questions:[
    {d:0,t:"在人多的聚会或陌生场合，我会感到不自在",r:false},
    {d:0,t:"我担心在别人面前出丑或说错话",r:false},
    {d:1,t:"当别人注视我时，我会紧张、脸红或想逃开",r:false},
    {d:0,t:"我常回避需要结识新朋友的活动",r:false},
    {d:1,t:"轮到我发言或被点名时，我会手心冒汗、心跳加快",r:false},
    {d:2,t:"当众表达观点会让我非常焦虑",r:false},
    {d:0,t:"事后我会反复回想自己在社交中的表现",r:false},
    {d:1,t:"我担心别人正在评价我的一举一动",r:false},
    {d:2,t:"要我主动开启一段对话让我很有压力",r:false},
    {d:0,t:"因为紧张，我错过了一些本想去的机会",r:false},
    {d:1,t:"在权威或地位更高的人面前我格外拘谨",r:false},
    {d:2,t:"这些紧张已影响到我的学习、工作或生活",r:false}
  ]
});

/* ---- 创伤后应激筛查 PCL-改编 ---- */
push({
  id:"pcl", name:"创伤压力后应激筛查", category:"情绪状态", emoji:"🕊️",
  colors:["#c9827a","#b96f68"], duration:"约 2 分钟 · 12 题",
  desc:"用于回看近期是否反复出现与过去创伤相关的闪回、回避与警觉。仅作参考，非诊断。",
  dims:["侵入闪回","回避麻木","过度警觉"],
  mode:"score", options:["一点也不","有一点","相当多","非常多"], weights:[0,1,2,3],
  rep:{domain:"mood",kind:"risk",mid:45,hi:65,gaugeLabel:"创伤反应指数"},
  questions:[
    {d:0,t:"关于那段经历的回忆会不请自来地闯入脑海",r:false},
    {d:0,t:"我会反复做与之相关的梦，醒来仍感到不安",r:false},
    {d:0,t:"某些画面、声音或气味会让我瞬间回到当时",r:false},
    {d:1,t:"我刻意回避谈论或想起那段经历",r:false},
    {d:1,t:"我避免去那些人、地或活动聚集的场所",r:false},
    {d:1,t:"我对过去重要的事情渐渐提不起兴趣",r:false},
    {d:1,t:"我感到与人疏远，或难以感受到温暖的情绪",r:false},
    {d:2,t:"我容易惊醒，睡眠变得警觉而不安稳",r:false},
    {d:2,t:"一点动静就让我高度紧张、难以放松",r:false},
    {d:2,t:"我变得易怒、烦躁，一点小事就上头",r:false},
    {d:2,t:"我难以集中注意力，记忆力也不如从前",r:false},
    {d:0,t:"这些困扰已影响到我的工作与生活",r:false}
  ]
});

/* ---- 老年抑郁筛查 GDS-改编(通用化) ---- */
push({
  id:"gds", name:"老年抑郁倾向筛查", category:"情绪状态", emoji:"🍂",
  colors:["#c6b0a0","#b29582"], duration:"约 1.5 分钟 · 10 题",
  desc:"以简洁的是非作答，温和回看长者近期的心境、兴趣与生活满意感。",
  dims:["心境","兴趣活力","自我评价"],
  mode:"score", options:["是","否"], weights:[1,0],
  rep:{domain:"mood",kind:"risk",mid:45,hi:65,gaugeLabel:"低落倾向指数"},
  questions:[
    {d:0,t:"近段时间我常常感到闷闷不乐",r:false},
    {d:0,t:"我觉得生活里没有什么值得期待的事",r:false},
    {d:1,t:"我以前喜欢的事，现在大多提不起劲了",r:false},
    {d:1,t:"我常觉得精力不济、浑身乏力",r:false},
    {d:1,t:"我睡不好，夜里常常醒来或早醒",r:false},
    {d:2,t:"我常觉得自己没什么用，成了家人的负担",r:false},
    {d:0,t:"我常常觉得孤单，身边缺少可以说说话的人",r:false},
    {d:2,t:"我对自己近来的状况感到失望",r:false},
    {d:1,t:"我比从前更容易烦躁或想哭",r:false},
    {d:2,t:"我隐约觉得活着没什么意思",r:false}
  ]
});

/* ---- 产后情绪关怀筛查 EPDS-改编 ---- */
push({
  id:"epds", name:"产后情绪关怀筛查", category:"情绪状态", emoji:"🤱",
  colors:["#e6c9c9","#d69f9f"], duration:"约 2 分钟 · 10 题",
  desc:"为准妈妈/新妈妈准备的情绪关怀自测，帮助及时看见产后的心理波动。",
  dims:["情绪起伏","焦虑担忧","自我照顾"],
  mode:"score", options:["从不","偶尔","较多","非常多"], weights:[0,1,2,3],
  rep:{domain:"mood",kind:"risk",mid:45,hi:65,gaugeLabel:"情绪波动指数"},
  questions:[
    {d:0,t:"近来我能笑出来，也觉得事情有趣",r:true},
    {d:0,t:"我对未来曾乐观期待，现在却有些迷茫",r:false},
    {d:0,t:"我常无端感到害怕或恐慌",r:false},
    {d:1,t:"我会无缘无故地焦虑或担忧",r:false},
    {d:1,t:"我被惊吓感或恐惧感困扰",r:false},
    {d:2,t:"我觉得事情堆积得让我难以应对",r:false},
    {d:2,t:"我睡眠不好，即便宝宝睡着我也睡不安稳",r:false},
    {d:0,t:"我常常难过，甚至会想哭",r:false},
    {d:1,t:"我有过伤害自己的想法（若有请一定及时求助）",r:false},
    {d:2,t:"我对照顾自己与宝宝感到力不从心",r:false}
  ]
});

/* ---- 躯体焦虑 / 惊恐-贝克改编 ---- */
push({
  id:"bai", name:"躯体焦虑自评", category:"情绪状态", emoji:"💓",
  colors:["#f2b8b8","#e09a9a"], duration:"约 1.5 分钟 · 10 题",
  desc:"关注焦虑在身体上的信号，如心慌、发麻、发汗等，帮您听清身体的提醒。",
  dims:["躯体反应","自主神经"],
  mode:"score", options:["完全没有","轻度","中度","重度"], weights:[0,1,2,3],
  rep:{domain:"stress",kind:"risk",mid:45,hi:65,gaugeLabel:"躯体紧张指数"},
  questions:[
    {t:"我会突然感觉心跳加快、心慌",r:false},
    {t:"我有时觉得气不够用、喘不上来",r:false},
    {t:"我的手脚会发麻或发冷",r:false},
    {t:"紧张时我会手心冒汗或出冷汗",r:false},
    {t:"我会感到一阵阵的头晕或站不稳",r:false},
    {t:"我喉咙发紧，像有什么堵着",r:false},
    {t:"我常感胃部不适、想吐或没胃口",r:false},
    {t:"我身体发颤或肌肉绷紧",r:false},
    {t:"我担心自己是否生了重病而反复不安",r:false},
    {t:"这些身体反应让我更害怕、更紧张",r:false}
  ]
});

/* ---- 情绪稳定性 CES ---- */
push({
  id:"ces", name:"情绪稳定性测评", category:"情绪状态", emoji:"🌤️",
  colors:["#a9cf9f","#86bd7e"], duration:"约 1.5 分钟 · 10 题",
  desc:"看您情绪的起伏幅度与恢复速度，回望那份‘内心晴雨表’的稳定度。",
  dims:["情绪起伏","易激惹","恢复能力"],
  mode:"score", options:["从不","偶尔","经常","几乎总是"], weights:[0,1,2,3],
  rep:{domain:"mood",kind:"risk",mid:45,hi:65,gaugeLabel:"情绪波动指数"},
  questions:[
    {d:0,t:"我的心情会因小事在短时间内大起大落",r:false},
    {d:0,t:"上一秒还好好的，下一秒就莫名低落或烦躁",r:false},
    {d:1,t:"一点不如意就容易让我动怒",r:false},
    {d:1,t:"我常对亲近的人说出事后后悔的气话",r:false},
    {d:1,t:"情绪上头时我很难立刻平静下来",r:false},
    {d:2,t:"情绪波动后我需要很久才能恢复",r:false},
    {d:0,t:"我会被外界的评价轻易搅动心情",r:false},
    {d:2,t:"我担心自己的情绪像过山车一样不可控",r:false},
    {d:2,t:"情绪的起伏让我觉得疲惫",r:false},
    {d:2,t:"我希望能更平稳地接住自己的情绪",r:false}
  ]
});

/* ---- 孤独感 UCLA-改编 ---- */
push({
  id:"ucla", name:"孤独感自评 UCLA", category:"情绪状态", emoji:"🌑",
  colors:["#a9b8dd","#8797cf"], duration:"约 1.5 分钟 · 10 题",
  desc:"从陪伴、联结与独处感受，回看您内心是否感到被理解与陪伴。",
  dims:["陪伴感","联结感","独处体验"],
  mode:"score", options:["从不","很少","有时","常常"], weights:[1,2,3,4],
  rep:{domain:"mood",kind:"risk",mid:45,hi:60,gaugeLabel:"孤独感指数"},
  questions:[
    {d:0,t:"我觉得身边缺少可以真正依靠的人",r:false},
    {d:0,t:"我感到没人真正理解我的感受",r:false},
    {d:1,t:"我觉得和周围的人缺乏亲近的连接",r:false},
    {d:1,t:"即便在人群中，我仍感到孤单",r:false},
    {d:0,t:"我常觉得没有可以倾诉心事的人",r:false},
    {d:1,t:"我感到自己被排斥或被冷落",r:false},
    {d:2,t:"独处时我容易感到空虚或低落",r:false},
    {d:0,t:"我渴望有人陪伴，却不知如何走近",r:false},
    {d:1,t:"我怀疑自己是否受欢迎",r:false},
    {d:2,t:"孤独感已影响我的心情与生活",r:false}
  ]
});

/* ---- 生活满意度 SWLS ---- */
push({
  id:"swls", name:"生活满意度量表 SWLS", category:"情绪状态", emoji:"🌈",
  colors:["#f2d8b8","#e8bd8f"], duration:"约 1 分钟 · 5 题",
  desc:"从五个简洁判断，回看您对当下生活的整体满意程度(分值越高越满意)。",
  dims:["整体满意"],
  mode:"score", options:["非常不同意","不同意","中立","同意","非常同意"], weights:[1,2,3,4,5],
  rep:{domain:"mood",kind:"well",mid:55,hi:75,gaugeLabel:"生活满意度",},
  questions:[
    {t:"大体上，我的生活接近我理想的样子",r:false},
    {t:"我的生活条件很好，我很满意",r:false},
    {t:"我对自己的生活感到满意",r:false},
    {t:"到目前为止，我已得到我想要的",r:false},
    {t:"如果人生可以重来，我也不太想改变什么",r:false}
  ]
});

/* ---- 正念觉察 MAAS-改编 ---- */
push({
  id:"maas", name:"正念觉察自评", category:"情绪状态", emoji:"🧘",
  colors:["#b7d3bc","#8fc0a0"], duration:"约 1.5 分钟 · 8 题",
  desc:"看您能否安住当下，觉察而不被思绪带走的程度(分值越高越活在当下)。",
  dims:["安住当下","觉察","不自动化"],
  mode:"score", options:["几乎总是","经常","偶尔","几乎从不"], weights:[3,2,1,0],
  rep:{domain:"self",kind:"well",mid:50,hi:70,gaugeLabel:"正念觉察度"},
  questions:[
    {t:"吃饭时我能专注地品尝，而不被手机带走",r:false},
    {t:"做事时我能专注于眼前，而不是被杂念拉扯",r:false},
    {t:"我感到情绪波动时，能先觉察而不马上被卷走",r:false},
    {t:"走路时我能感受到步伐与呼吸",r:false},
    {t:"别人说话时我能真正地听见，而不只是等对方说完",r:false},
    {t:"我能发现身体发出的紧绷或疲惫信号",r:false},
    {t:"我很少因‘自动驾驶’而错过当下的时刻",r:false},
    {t:"总体而言，我能较多地活在当下",r:false}
  ]
});

})();
