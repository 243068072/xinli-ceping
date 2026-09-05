/* ============================================================
   图片投射测试 (3 套) — mode: pick (选项映射类别)
   图像为程序绘制的抽象/意象 SVG，仅供联想投射。
   ============================================================ */
(function(){
"use strict";
const A=window.SCALES;
function push(o){ A.push(o); }

/* ---------- 1) 墨迹联想 · 心境之镜 ---------- */
(function(){
  const cats={
    cloud:{name:"澄澈放松"},
    wave:{name:"内敛自省"},
    bloom:{name:"温暖渴望"},
    peak:{name:"坚韧向上"}
  };
  const pickResults={
    cloud:{emoji:"🍃",headline:"澄澈放松 · 心向平静",color:"#7fb592",
      sub:"你在这份墨迹里看到了开阔与轻盈，映射出你当下渴望放松、向往澄明的内在状态。你内心愿意把复杂看简单，把纷扰归还云外。",
      advice:["把这份轻盈感带进日常，允许自己不那么用力","给自己安排一段慢节奏的独处时光","练习把注意力放回呼吸与当下"],
      quote:"心若澄澈，所见皆是风景。",warm:"这不是诊断，而是一面温和的镜子。愿你看见自己偏爱平静的那一部分。"},
    wave:{emoji:"🌊",headline:"内敛自省 · 内心深流",color:"#6b89b0",
      sub:"你从墨迹中读出了起伏与深度，映射出你细腻、爱思考、常向内观照的一面。你习惯先感受再表达，内心比外表更丰富。",
      advice:["把那些没说出口的想法，试着写下来或与信任的人分享","允许情绪有涨落，不必时时压平","把向内看的敏锐，用在自我关怀上而非苛责"],
      quote:"你不必总是风平浪静，深处的汹涌也是你的力量。",warm:"愿这份解读帮你接住自己丰富却不易言说的内心。"},
    bloom:{emoji:"🌷",headline:"温暖渴望 · 情感丰盈",color:"#e07a8a",
      sub:"你在墨迹里看见了生机与美好，映射出你内心温暖、重视情感联结、向往爱与美的倾向。你看世界的眼光带着柔光。",
      advice:["主动靠近让你感到温暖的人和事","大方表达你的在意，别让温柔藏在心里","在照顾他人感受时，也记得滋养自己"],
      quote:"能看见花开的人，心里一定也种着花。",warm:"愿你用这份温柔的眼光，好好对待自己。"},
    peak:{emoji:"⛰️",headline:"坚韧向上 · 内心有光",color:"#c99a4a",
      sub:"你从墨迹里看到了轮廓与高度，映射出你坚韧、有目标、敢于向上的内在力量。你倾向在挑战中确认自己。",
      advice:["把大目标拆成今天能走的一小步","拼搏之余给自己真正的休息","把向上生长与安住当下平衡起来"],
      quote:"你心里住着一座山，也住着一片可以停靠的草地。",warm:"愿你刚柔并济，既向上，也允许自己休憩。"}
  };
  const art=[[
    '<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">'+
    '<g fill="#8fb3c0"><path d="M100 12c-22 0-38 14-38 34 0 26 18 40 38 52 20-12 38-26 38-52 0-20-16-34-38-34z" opacity=".85"/>'+
    '<path d="M72 30c10 6 12 16 6 26M128 30c-10 6-12 16-6 26" stroke="#6f9bb0" stroke-width="3" fill="none" opacity=".7"/></g>'+
    '<ellipse cx="44" cy="22" rx="14" ry="9" fill="#cfe3d2" opacity=".8"/><ellipse cx="158" cy="86" rx="12" ry="7" fill="#e6c9c9" opacity=".7"/></svg>'
  ],[
    '<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">'+
    '<g fill="none" stroke="#7f9fc0" stroke-linecap="round">'+
    '<path d="M34 60c8-16 18-24 30-22s20 12 22 26 10 26 24 26 24-14 28-30" stroke-width="5" opacity=".8"/>'+
    '<path d="M34 60c-6 10-8 20-4 28M66 38c-2 8-2 16 2 24M118 64c-2-10 0-20 4-28M156 60c-4 10-6 20-4 30" stroke-width="3" opacity=".6"/></g></svg>'
  ],[
    '<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">'+
    '<circle cx="100" cy="58" r="26" fill="#e0a3cf" opacity=".85"/>'+
    '<g fill="#f2c9e0"><ellipse cx="100" cy="40" rx="16" ry="12"/><ellipse cx="86" cy="66" rx="13" ry="10"/><ellipse cx="114" cy="66" rx="13" ry="10"/></g>'+
    '<path d="M60 90c8-18 26-30 40-30s32 12 40 30-14 22-80 22-20-4-0-22z" fill="#93bda0" opacity=".7"/></svg>'
  ],[
    '<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M100 14 L112 44 L146 46 L120 64 L130 96 L100 78 L70 96 L80 64 L54 46 L88 44 Z" fill="#b8a85f" opacity=".9"/>'+
    '<g fill="#a3c9a8"><path d="M100 20c-10-8-30-6-34 6 8-2 14 0 18 4 2-6 10-9 16-10z" opacity=".85"/><path d="M108 28c6-4 18-2 20 6-7-2-12 0-15 3 0-4-4-7-5-9z"/></g></svg>'
  ]];
  const Q=[
    {ask:"你更倾向把这张墨迹联想成什么？",art:art[0],options:[{t:"云朵与舒展的水面",c:"cloud"},{t:"流淌的波浪与深流",c:"wave"}]},
    {ask:"这张图在你眼中更像？",art:art[1],options:[{t:"柔和的云影、随风飘散",c:"cloud"},{t:"起伏的山丘与蜿蜒的路",c:"wave"}]},
    {ask:"凝视片刻，你看到了什么？",art:art[2],options:[{t:"初绽的花与温柔的春",c:"bloom"},{t:"夜空里的一团暖光",c:"peak"}]},
    {ask:"这幅画面给你的感觉最接近？",art:art[3],options:[{t:"向上的星与坚定的光",c:"peak"},{t:"安稳栖息、被守护的心",c:"bloom"}]}
  ];
  push({id:"inkblot", name:"墨迹联想 · 心境之镜", category:"图片投射", kind:"image", emoji:"🪞",
    colors:["#c6c0dd","#a9a1cf"], duration:"约 1 分钟 · 4 图", mode:"pick",
    desc:"经典的意象联想式投射。凝视墨迹，选出你内心最自然浮现的画面，照见此刻的心境倾向。",
    cats, catKeys:Object.keys(cats), pickResults, questions:Q});
})();

/* ---------- 2) 内在之树 · 自我之根 ---------- */
(function(){
  const cats={
    strong:{name:"扎根坚实"},
    lush:{name:"生命丰盛"},
    free:{name:"自由舒展"},
    shelter:{name:"温柔庇护"}
  };
  const pickResults={
    strong:{emoji:"🌲",headline:"扎根坚实 · 稳而有力量",color:"#6fa87e",
      sub:"你被挺拔坚实的树木吸引，映射出你重视稳定、踏实、有担当的内在根基。你希望自己的努力能深深扎根、向上生长。",
      advice:["继续夯实让你安心的事业与关系","不必时时拼命，根稳了树自然高","在稳定之外，给生活留一点惊喜的枝桠"],
      quote:"把根扎深，风再大也撼不动你的方向。",warm:"愿你的每一步都走得稳，也允许自己偶尔摇一摇、换口气。"},
    lush:{emoji:"🌳",headline:"生命丰盛 · 内心富足",color:"#7fbfa0",
      sub:"你被枝叶繁茂的生命力吸引，映射出你内心丰盛、乐于给予、重视成长与滋养的一面。你的世界像一座自带果园的森林。",
      advice:["把丰盛的能量分享给你在乎的人","也允许自己停下来摘果、休憩","持续学习，让生命力常有活水"],
      quote:"内心富足的人，走到哪里都在开花。",warm:"愿你的丰盛既照亮他人，也温暖自己。"},
    free:{emoji:"🌾",headline:"自由舒展 · 旷达自在",color:"#c9b05f",
      sub:"你被疏朗、自由舒展的意象吸引，映射出你向往自在、不爱被束缚、追求旷达生活的内在气质。风的方向对你很重要。",
      advice:["为热爱的事留出自由的空间","建立让自己舒展的生活节奏","自由也需边界，找到两者平衡会让你更轻松"],
      quote:"心是自由的，处处皆是旷野。",warm:"愿你活得舒展，也安于被在乎的人轻轻牵挂。"},
    shelter:{emoji:"🏡",headline:"温柔庇护 · 重情重暖",color:"#e0a3cf",
      sub:"你被像家一般可依靠的树冠吸引，映射出你重视关系、渴望庇护与被庇护的柔软一面。温暖与陪伴是你心里很深的坐标。",
      advice:["珍惜并表达你对在乎之人的心意","允许自己被照顾，不必总是强撑","为自己也搭一个可以停靠的角落"],
      quote:"能给人荫凉的人，也请记得为自己留一片树荫。",warm:"愿你在付出温柔的同时，也被温柔稳稳接住。"}
  };
  const trees=[
    '<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg"><rect x="92" y="78" width="16" height="44" rx="4" fill="#8a6a4a"/><g fill="#5f9b74"><ellipse cx="100" cy="52" rx="44" ry="40"/><ellipse cx="66" cy="70" rx="30" ry="26"/><ellipse cx="134" cy="70" rx="30" ry="26"/></g></svg>',
    '<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg"><path d="M96 70c-6-20-4-42 6-56" stroke="#8a6a4a" stroke-width="10" fill="none"/><g fill="#7fbf8f"><circle cx="96" cy="40" r="20"/><circle cx="66" cy="62" r="24"/><circle cx="126" cy="58" r="26"/><circle cx="92" cy="86" r="22"/><circle cx="132" cy="92" r="20"/></g></svg>',
    '<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg"><path d="M100 60c-4-20-8-34-18-42M100 60c4-16 12-24 24-24M100 60c-6-14-18-20-30-18" stroke="#c9a04f" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M60 120c18-24 62-24 80 0" stroke="#c9a04f" stroke-width="6" fill="none" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg"><rect x="88" y="80" width="24" height="30" rx="4" fill="#b0865f"/><path d="M100 44c-6-16 6-28 6-28s10 12 6 28z" fill="#e0a3cf" opacity=".8"/><path d="M58 96c10-30 74-30 84 0-4 16-14 22-84 22s-66-6-0-22z" fill="#9cc9a8" opacity=".9"/></svg>'
  ];
  const Q=[
    {ask:"凭直觉选出一棵最吸引你的树？",art:trees[0],options:[{t:"挺拔厚实的常青树",c:"strong"},{t:"繁茂开阔的大树",c:"lush"}]},
    {ask:"哪一幅树的形态更贴近你此刻的状态？",art:trees[1],options:[{t:"疏朗摇曳、自成风景的树",c:"free"},{t:"枝叶温柔、予人荫凉的树",c:"shelter"}]},
    {ask:"在风雨里，你更愿意成为哪一棵？",art:trees[2],options:[{t:"根系深稳、不惧风浪的树",c:"strong"},{t:"舒展自在、随风而舞的树",c:"free"}]},
    {ask:"哪一片树冠让你感到安心？",art:trees[3],options:[{t:"圆润可栖、像家一样的树",c:"shelter"},{t:"生机勃勃、果实累累的树",c:"lush"}]}
  ];
  push({id:"tree", name:"内在之树 · 自我之根", category:"图片投射", kind:"image", emoji:"🌲",
    colors:["#b7d3bc","#93c0a0"], duration:"约 1 分钟 · 4 图", mode:"pick",
    desc:"从树木人格的意象出发，看你被怎样的生命姿态所吸引，照见内心深处的自我意象。",
    cats, catKeys:Object.keys(cats), pickResults, questions:Q});
})();

/* ---------- 3) 云间漫步 · 情绪意象 ---------- */
(function(){
  const cats={
    calm:{name:"安宁自洽"},
    spark:{name:"向往明亮"},
    drift:{name:"随性自由"},
    anchor:{name:"渴望依归"}
  };
  const pickResults={
    calm:{emoji:"🌤️",headline:"安宁自洽 · 内心有静",color:"#7fb3c0",
      sub:"你更留意平和开阔的意象，映射出你渴望内心安宁、希望与自己和解的状态。你已经懂得，静下来也是一种抵达。",
      advice:["延续让你平静的节奏","给自己一段不被评价的空白时间","练习把焦虑交给呼吸，把心带回当下"],
      quote:"真正的安宁，是你与自己握手言和。",warm:"愿这份静，常伴你左右。"},
    spark:{emoji:"✨",headline:"向往明亮 · 心里有光",color:"#e6bd5f",
      sub:"你被温暖明亮的意象吸引，映射出你向往希望、温暖与被看见的一面。你心里始终亮着一盏朝光走的小灯。",
      advice:["主动靠近让你发光的人与事","大方表达你的热情与期待","也允许自己有暗下来的时刻，那很正常"],
      quote:"你心里的光，足够照亮前路，也足够暖化自己。",warm:"愿你被看见，也愿你看见自己有多好。"},
    drift:{emoji:"🍃",headline:"随性自由 · 不喜束缚",color:"#a9c9a8",
      sub:"你对疏朗随性的意象心生向往，映射出你珍惜自由、不愿被条框定义、希望活得轻盈的一面。",
      advice:["为热爱留白，别把日程塞太满","给选择留余地，允许计划外的惊喜","在自由里也要记得回家的路与牵挂你的人"],
      quote:"若心中有旷野，脚下的路便处处皆可远行。",warm:"愿你自在如风，也被温柔记得。"},
    anchor:{emoji:"⛵",headline:"渴望依归 · 情深意重",color:"#c9a3cf",
      sub:"你被安稳可栖的意象吸引，映射出你重视归属、珍惜联结、希望在关系里被好好托住的一面。",
      advice:["把牵挂表达出来，别让在意悄悄溜走","允许自己依靠与被依靠","为重要的人留出不被占用的时间"],
      quote:"你的心需要一个归处，而你的温柔正是别人的归处。",warm:"愿你既是被庇护的帆，也是稳稳的港湾。"}
  };
  const scenes=[
    '<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg"><rect width="220" height="140" fill="#eef4ee"/><ellipse cx="110" cy="70" rx="60" ry="34" fill="#ffffff"/><ellipse cx="90" cy="62" rx="22" ry="12" fill="#dff0e6"/><ellipse cx="140" cy="80" rx="28" ry="14" fill="#dff0e6"/><circle cx="60" cy="38" r="10" fill="#f6d27a"/><rect y="112" width="220" height="28" fill="#cfe6cf"/></svg>',
    '<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg"><rect width="220" height="140" fill="#f7eef2"/><g stroke="#e6a3cf"><path d="M60 40c6-8 10-8 14-2s6 10 12 8M120 70c6-8 10-8 14-2" stroke-width="4" stroke-linecap="round"/></g><circle cx="70" cy="92" r="30" fill="#f4c07a" opacity=".8"/><rect x="30" y="108" width="160" height="32" fill="#e8cfb6" opacity=".6"/></svg>',
    '<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg"><rect width="220" height="140" fill="#eef2f7"/><g fill="#ffffff" opacity=".9"><ellipse cx="80" cy="46" rx="30" ry="16"/><ellipse cx="150" cy="60" rx="34" ry="16"/><ellipse cx="120" cy="36" rx="24" ry="13"/></g><path d="M40 120c40-18 100-18 140 0z" fill="#a8c9d6"/><rect y="120" width="220" height="20" fill="#a8c9d6"/></svg>',
    '<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg"><rect width="220" height="140" fill="#f4efe2"/><path d="M110 26L196 96 H24 Z" fill="#d8b07a"/><path d="M24 96 H196 L110 26 Z" fill="#efc9a0"/><rect x="24" y="96" width="172" height="30" rx="6" fill="#caa06a"/><circle cx="110" cy="66" r="7" fill="#b96f6f"/></svg>'
  ];
  const Q=[
    {ask:"在这片天空里，你更愿意自己是一片怎样的云？",art:scenes[0],options:[{t:"轻柔舒缓、慢慢飘远的云",c:"calm"},{t:"被霞光染亮的那一片云",c:"spark"}]},
    {ask:"如果走入图中，你更想停在哪一处？",art:scenes[1],options:[{t:"有暖光的角落",c:"anchor"},{t:"开阔随意的小径",c:"drift"}]},
    {ask:"哪一幅画面让你的心更安宁？",art:scenes[2],options:[{t:"开阔澄澈、能望远的天空",c:"calm"},{t:"有依靠、有归处的天地",c:"anchor"}]},
    {ask:"这里藏着一处光，你最想靠近哪一束？",art:scenes[3],options:[{t:"跃动闪烁的光",c:"spark"},{t:"温和稳当的光",c:"drift"}]}
  ];
  push({id:"cloudwalk", name:"云间漫步 · 情绪意象", category:"图片投射", kind:"image", emoji:"☁️",
    colors:["#a9c9dd","#7fb3d0"], duration:"约 1 分钟 · 4 图", mode:"pick",
    desc:"透过对天空与画面的直觉联想，轻柔地照见此刻的情绪倾向与内心坐标。",
    cats, catKeys:Object.keys(cats), pickResults, questions:Q});
})();

})();
