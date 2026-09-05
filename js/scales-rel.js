/* ============================================================
   量表扩展 (三)：亲密关系 / 家庭 / 亲子 / 人际
   ============================================================ */
(function(){
"use strict";
const A=window.SCALES;
function push(o){ A.push(o); }

/* ---- 婚姻质量自评 (Olson-改编) ---- */
push({
  id:"marriage", name:"婚姻质量自评", category:"人际关系", emoji:"💒",
  colors:["#f2c9c9","#e6a9a9"], duration:"约 2 分钟 · 12 题",
  desc:"从沟通、亲密、冲突应对三个角度，回看你们婚姻的整体质地。",
  dims:["沟通","亲密","冲突处理"],
  mode:"score", options:["几乎不","偶尔","经常","几乎总是"], weights:[1,2,3,4],
  rep:{domain:"relation",kind:"well",mid:55,hi:75,gaugeLabel:"婚姻质量"},
  questions:[
    {t:"我们愿意就重要的事坦诚沟通",r:false},
    {t:"我们能平静地表达彼此的不同意见",r:false},
    {t:"争吵后我们愿意修复关系，而非长期冷战",r:false},
    {t:"我们有让彼此感到亲密的时刻",r:false},
    {t:"我能在伴侣面前自在地做真实的自己",r:false},
    {t:"我们会在意并回应彼此的喜怒哀乐",r:false},
    {t:"遇到困难时，我们倾向一起面对",r:false},
    {t:"我觉得伴侣尊重我的想法与边界",r:false},
    {t:"我们有共同的期待或生活目标",r:false},
    {t:"日常相处中我感到被理解和支持",r:false},
    {t:"我们没有把负面情绪长期积压在心底",r:false},
    {t:"总体而言，我对我们的婚姻感到满意",r:false}
  ]
});

/* ---- 亲子沟通自评 ---- */
push({
  id:"parent", name:"亲子沟通测评", category:"人际关系", emoji:"👨‍👩‍👧",
  colors:["#f2d8a8","#e6bd7f"], duration:"约 2 分钟 · 10 题",
  desc:"回看您与孩子的日常对话，是滋养了关系，还是拉开了距离。",
  dims:["倾听","表达","情感温度"],
  mode:"score", options:["几乎不","偶尔","经常","几乎总是"], weights:[1,2,3,4],
  rep:{domain:"relation",kind:"well",mid:55,hi:75,gaugeLabel:"亲子沟通质量"},
  questions:[
    {t:"我愿意耐心听完孩子想说的话",r:false},
    {t:"我会先了解孩子的感受，而不是急着说教",r:false},
    {t:"孩子愿意向我分享他的心事与烦恼",r:false},
    {t:"我表达关心多于批评和指责",r:false},
    {t:"我说话时会注意语气，不伤孩子自尊",r:false},
    {t:"我会肯定孩子的努力，而不只盯着结果",r:false},
    {t:"家里有能轻松谈心的氛围",r:false},
    {t:"冲突后我愿意主动和孩子和解",r:false},
    {t:"我会给孩子适当的空间与选择权",r:false},
    {t:"总体而言，我们的亲子关系是温暖开放的",r:false}
  ]
});

/* ---- 原生家庭探索 ---- */
push({
  id:"origin", name:"原生家庭影响力测评", category:"人际关系", emoji:"🏡",
  colors:["#c9c3e0","#a79fd0"], duration:"约 2 分钟 · 10 题",
  desc:"温柔回望童年家庭如何塑造了你的情绪与关系模式，看见即疗愈的开始。",
  dims:["情感连接","安全感","自主空间"],
  mode:"score", options:["非常不符合","不符合","中立","符合","非常符合"], weights:[1,2,3,4,5],
  rep:{domain:"relation",kind:"well",mid:50,hi:70,gaugeLabel:"家庭滋养度"},
  questions:[
    {t:"在童年家庭里，我感受到被爱与接纳",r:false},
    {t:"家人愿意倾听我的感受与想法",r:false},
    {t:"我能表达需要而不怕被否定",r:false},
    {t:"家人间的相处总体是温暖而非紧张的",r:false},
    {t:"我有被允许尝试和犯错的空间",r:false},
    {t:"我不需要为家人的情绪负责或小心翼翼",r:false},
    {t:"童年的我会向家人求助而不是独自硬扛",r:false},
    {t:"我学会的亲密方式让现在的我受益",r:false},
    {t:"我不会用童年里的伤害去对待现在的人",r:false},
    {t:"我对自己的原生家庭有较清晰的觉察",r:false}
  ]
});

/* ---- 非暴力沟通 NVC ---- */
push({
  id:"nvc", name:"非暴力沟通测评", category:"人际关系", emoji:"🕊️",
  colors:["#a9c9dd","#84b3d0"], duration:"约 1.5 分钟 · 10 题",
  desc:"看你在沟通时，是否更能表达观察、感受、需要与请求(分值越高越平和)。",
  dims:["表达感受","倾听同理","提出请求"],
  mode:"score", options:["几乎不","偶尔","经常","几乎总是"], weights:[1,2,3,4],
  rep:{domain:"relation",kind:"well",mid:52,hi:72,gaugeLabel:"沟通平和度"},
  questions:[
    {t:"我会先描述事实，而非直接评判对方",r:false},
    {t:"我能用‘我感到…’表达自己的情绪",r:false},
    {t:"生气时我仍尽量不出口伤人",r:false},
    {t:"我会试着理解对方背后的需要",r:false},
    {t:"冲突中我既能表达自己，也愿意听对方说完",r:false},
    {t:"我会用请求而非命令的方式提出需要",r:false},
    {t:"我不常把‘你应该…’挂在嘴边",r:false},
    {t:"我意识到指责与抱怨常让沟通卡住",r:false},
    {t:"我能在对话中给对方同理与共情",r:false},
    {t:"总体而言，我的人际沟通是建设性的",r:false}
  ]
});

/* ---- 共情能力 CET ---- */
push({
  id:"cet", name:"共情能力测评", category:"人际关系", emoji:"💞",
  colors:["#e6c9e0","#cf9fd0"], duration:"约 1.5 分钟 · 10 题",
  desc:"看您感受与理解他人情绪、并把这份理解传达出去的能力(分值越高共情越好)。",
  dims:["情绪感受","观点采择","共情回应"],
  mode:"score", options:["几乎不","偶尔","经常","几乎总是"], weights:[1,2,3,4],
  rep:{domain:"relation",kind:"well",mid:52,hi:72,gaugeLabel:"共情能力"},
  questions:[
    {t:"我能较快察觉身边人情绪的微妙变化",r:false},
    {t:"朋友难过时，我能真切感受到他的心情",r:false},
    {t:"我能站在对方的角度理解他的选择",r:false},
    {t:"听人倾诉时我少急着给建议，多陪伴感受",r:false},
    {t:"我表达理解时，对方常感到被接住",r:false},
    {t:"影视剧中人物的喜怒哀乐能触动我",r:false},
    {t:"我懂得用让对方舒服的方式去安慰",r:false},
    {t:"即便与对方观点不同，我也能尊重他的感受",r:false},
    {t:"我能把共情化为温和、支持性的回应",r:false},
    {t:"总体而言，我是个较有共情力的人",r:false}
  ]
});

/* ---- 关系边界 / 讨好倾向 ---- */
push({
  id:"boundary", name:"关系边界感测评", category:"人际关系", emoji:"🛡️",
  colors:["#a9d0c9","#80bdb5"], duration:"约 1.5 分钟 · 10 题",
  desc:"看您是否常把别人的感受放在自己之前、难以说‘不’(分值越高越需关照自己)。",
  dims:["难说拒绝","讨好他人","忽视自我"],
  mode:"score", options:["从不","偶尔","经常","几乎总是"], weights:[0,1,2,3],
  rep:{domain:"relation",kind:"risk",mid:45,hi:65,gaugeLabel:"讨好/边界失守指数"},
  questions:[
    {t:"即便我不想，也常因不好意思而答应别人",r:false},
    {t:"我害怕拒绝会让别人不高兴或离开",r:false},
    {t:"我常把别人的情绪扛在自己肩上",r:false},
    {t:"为了不扫兴，我会压抑自己的真实想法",r:false},
    {t:"我很难在别人面前说‘我需要…’",r:false},
    {t:"我过度在意别人怎么看我",r:false},
    {t:"答应别人的事做不到时我会非常自责",r:false},
    {t:"我常忽略自己的休息与需要去成全他人",r:false},
    {t:"我难以设立并守住自己的边界",r:false},
    {t:"这种讨好已让我感到疲惫",r:false}
  ]
});

/* ---- 爱的五种语言 ---- */
push({
  id:"lovelang", name:"爱的五种语言", category:"人际关系", emoji:"💌",
  colors:["#f2a9c9","#e07aa6"], duration:"约 2 分钟 · 12 题",
  desc:"看您最习惯用哪一种方式表达与接收爱(按偏好排序,选出你的主导爱的语言)。",
  mode:"custom", custom:"lovelang",
  options:["几乎不用","偶尔","经常","几乎总是"], weights:[0,1,2,3],
  questions:[
    {ll:"aff",t:"我会主动说出‘我爱你’或表达欣赏",r:false},
    {ll:"aff",t:"听到伴侣真诚的赞美让我很开心",r:false},
    {ll:"time",t:"我更看重两人在一起的专注时光",r:false},
    {ll:"time",t:"一起散步、看电影比礼物更让我心动",r:false},
    {ll:"gift",t:"收到用心准备的礼物会让我感到被爱",r:false},
    {ll:"gift",t:"我常通过送小礼物表达心意",r:false},
    {ll:"serve",t:"对方为我分担家务或事务会让我感动",r:false},
    {ll:"serve",t:"我更愿意用行动帮忙来爱对方",r:false},
    {ll:"touch",t:"拥抱和牵手能让我感到踏实亲密",r:false},
    {ll:"touch",t:"肢体上的靠近是我重要的爱的信号",r:false},
    {ll:"aff",t:"一句温暖的话比任何东西都更能安抚我",r:false},
    {ll:"serve",t:"当对方记得并帮我的忙，我知道他在乎我",r:false}
  ]
});

})();
