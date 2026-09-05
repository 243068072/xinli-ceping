/* ============================================================
   趣味心理测试 (5 套) — mode: pick · 轻松取向
   ============================================================ */
(function(){
"use strict";
const A=window.SCALES;
function push(o){ A.push(o); }

/* 1) 森林小动物 · 你的内在角色 */
(function(){
  const cats={fox:{name:"狐狸·机智"},owl:{name:"猫头鹰·沉静"},deer:{name:"小鹿·温和"},wolf:{name:"狼·守护"}};
  const pickResults={
    fox:{emoji:"🦊",headline:"狐狸 · 机智的破局者",color:"#e0a35a",
      sub:"你灵活聪敏，遇事总有办法。在人群里，你是那个擅长发现机会、化解僵局的机灵鬼。",
      advice:["把你的机智用在创造而非取巧上","多留一点耐心，聪明也需要沉淀","偶尔放慢，别总急着赢"],
      quote:"聪明是天分，真诚才是你走得更远的底牌。"},
    owl:{emoji:"🦉",headline:"猫头鹰 · 沉静的观察者",color:"#8a83b5",
      sub:"你安静爱思考，习惯先看明白再开口。你的话不多，却常常一针见血、给人安定。",
      advice:["适度打开心门，分享你的洞察","别把沉默当作疏远，试着表达温度","你的深度值得被懂的人接住"],
      quote:"你安静地看得透，也愿你有勇气说得出。"},
    deer:{emoji:"🦌",headline:"小鹿 · 温柔的治愈者",color:"#e0a3cf",
      sub:"你温和敏感，自带让人放松的气场。和你相处像走进一片清静的林地，干净又舒服。",
      advice:["守护你的温柔，也学会说‘不’","把善意给值得的人，别让它透支","你的温柔需要一点力量来护航"],
      quote:"你的温柔不是软弱，而是这世界稀缺的光。"},
    wolf:{emoji:"🐺",headline:"狼 · 忠诚的守护者",color:"#6b89b0",
      sub:"你重情重义、有担当，认定的人和事会坚定守护到底。你是可靠又可依靠的存在。",
      advice:["把守护也留一份给自己","信任值得信任的人，不必凡事独扛","刚强之外，留一处柔软"],
      quote:"你的忠诚是把双刃剑，愿它先温柔地指向自己。"}
  };
  const Q=[
    {ask:"夜深时你更享受？",options:[{t:"独自梳理想法",c:"owl"},{t:"和伙伴一起行动",c:"wolf"}]},
    {ask:"遇到麻烦时你更倾向？",options:[{t:"绕个聪明的弯解决",c:"fox"},{t:"安抚大家慢慢来",c:"deer"}]},
    {ask:"朋友眼中的你更像？",options:[{t:"安静的军师",c:"owl"},{t:"可靠的靠山",c:"wolf"}]},
    {ask:"选择一件陪你度过周末的事？",options:[{t:"去大自然里走走",c:"deer"},{t:"探索一家新店/新点子",c:"fox"}]},
    {ask:"面对竞争，你的态度更像？",options:[{t:"找到聪明的方式脱颖而出",c:"fox"},{t:"守好阵地、稳稳前行",c:"wolf"}]},
    {ask:"最能形容你的是？",options:[{t:"敏锐且有趣",c:"fox"},{t:"温和又善解人意",c:"deer"}]}
  ];
  push({id:"fun_animal",name:"森林动物 · 你的内在角色",category:"趣味心理",kind:"fun",emoji:"🐾",
    colors:["#c9b0a9","#b99a90"],duration:"约 1 分钟 · 6 题",mode:"pick",
    desc:"凭直觉做出选择，看看你的性格更像森林里的哪位朋友。纯属轻松向的小测试。",
    cats,catKeys:Object.keys(cats),pickResults,questions:Q});
})();

/* 2) 说走就走 · 性格旅行 */
(function(){
  const cats={explore:{name:"探索派"},relax:{name:"治愈派"},social:{name:"社交派"},plan:{name:"规划派"}};
  const pickResults={
    explore:{emoji:"🧭",headline:"探索派 · 好奇的你",color:"#7fb3c0",
      sub:"你不爱按部就班，更享受发现未知的兴奋。对你而言，旅途的意义在路上的惊喜。",
      advice:["把好奇心导向长期热爱","在探索里也带一份规划，走得更稳","学会在终点停下，享受获得的快乐"],
      quote:"你的人生是一场有趣的冒险，别忘了带上地图也别忘了迷路也美好。"},
    relax:{emoji:"🌿",headline:"治愈派 · 慢活的你",color:"#7fbfa0",
      sub:"你向往能让身心松绑的地方，懂得停下来呼吸。慢，是你的充电方式。",
      advice:["把‘休息’看作必需品而非奖赏","为自己创造规律的喘息时刻","在慢生活里，也不错过小确幸"],
      quote:"能停下来的人，往往走得更远、更自在。"},
    social:{emoji:"🎉",headline:"社交派 · 热烈的你",color:"#e0a3cf",
      sub:"你享受与人同行、分享热闹的快乐。一群人在一起，你的能量就回来了。",
      advice:["把热闹沉淀成几段真心关系","学会在人群中听见自己的声音","独处也能帮你蓄电，试着享受它"],
      quote:"你是点亮气氛的光，也请为自己留一盏暖灯。"},
    plan:{emoji:"🗺️",headline:"规划派 · 靠谱的你",color:"#8a83b5",
      sub:"你习惯把行程安排妥当，让旅行既有期待又不慌乱。你的细致让人安心。",
      advice:["给计划留一点意外之喜的缝隙","别让安排挤掉了当下的感受","信任临场的小灵感也很有趣"],
      quote:"你把世界安排得井井有条，也别错过计划外的风景。"}
  };
  const Q=[
    {ask:"如果要出发，你更想？",options:[{t:"去没去过的地方探秘",c:"explore"},{t:"去安静的地方放空",c:"relax"}]},
    {ask:"旅途中最重要的是？",options:[{t:"遇到有趣的灵魂",c:"social"},{t:"随心而行的自由",c:"explore"}]},
    {ask:"出发前你会？",options:[{t:"认真做一份攻略",c:"plan"},{t:"随缘走到哪算哪",c:"relax"}]},
    {ask:"你更偏爱哪种旅行？",options:[{t:"和一群朋友热热闹闹",c:"social"},{t:"一个人安静地看世界",c:"relax"}]},
    {ask:"这次旅行你最想带回？",options:[{t:"一堆新见识与灵感",c:"explore"},{t:"一叠整理好的美好回忆",c:"plan"}]},
    {ask:"旅行的意义对你更像？",options:[{t:"认识不同的人与故事",c:"social"},{t:"从日常中抽离、重新出发",c:"plan"}]}
  ];
  push({id:"fun_travel",name:"说走就走 · 性格旅行",category:"趣味心理",kind:"fun",emoji:"🧳",
    colors:["#a9c9dd","#82afcf"],duration:"约 1 分钟 · 6 题",mode:"pick",
    desc:"从对旅行的直觉偏好，看看你隐藏的性格气质。轻松向，图个开心。",
    cats,catKeys:Object.keys(cats),pickResults,questions:Q});
})();

/* 3) 花语 · 气质测试 */
(function(){
  const cats={sun:{name:"向日葵·明朗"},rose:{name:"玫瑰·炽热"},lotus:{name:"莲·清雅"},lav:{name:"薰衣草·治愈"}};
  const pickResults={
    sun:{emoji:"🌻",headline:"向日葵 · 明朗的你",color:"#e6bd5f",
      sub:"你自带阳光，总能给身边人带来元气与希望。你倾向看见积极的一面，也愿意分享温暖。",
      advice:["把乐观变成能落地的小行动","允许自己也有低落，那不是背叛阳光","用你的光，也照亮那些需要被看见的角落"],
      quote:"你朝着光生长，本身就成了别人的光。"},
    rose:{emoji:"🌹",headline:"玫瑰 · 炽热的你",color:"#e07a8a",
      sub:"你热烈而有个性，敢爱敢表达，也自带锋芒。你的魅力在于既美丽又有刺的真实。",
      advice:["让锋芒指向保护，而非推开爱","在炽热之外，留一点温柔的余地","表达需要，是你爱自己的方式"],
      quote:"玫瑰带刺，才更动人；你有棱角，才更真实。"},
    lotus:{emoji:"🪷",headline:"莲 · 清雅的你",color:"#93a3c9",
      sub:"你内敛从容，自带一种不争的清醒与净气。喧嚣里你能守住自己的一方清净。",
      advice:["把这份清雅活成生活的底色","别让‘懂事’掩盖了你真正的需要","在清净之外，也多与人连接几分暖"],
      quote:"出淤泥而不染的你，也请记得偶尔沾沾人间的热闹。"},
    lav:{emoji:"💜",headline:"薰衣草 · 治愈的你",color:"#c9a3d6",
      sub:"你温柔而有安抚力，靠近你的人会不自觉地放松。你是那阵让紧绷松开的清香风。",
      advice:["好好照顾自己的情绪，你才能持续治愈","别把别人的负担都背在身上","给善良加上‘懂拒绝’的保护层"],
      quote:"治愈别人的人，请先治愈好自己。"}
  };
  const Q=[
    {ask:"花市里你会先被哪一束吸引？",options:[{t:"明晃晃的向日葵",c:"sun"},{t:"清雅的莲或白花",c:"lotus"}]},
    {ask:"你希望自己是哪朵花？",options:[{t:"热烈醒目的玫瑰",c:"rose"},{t:"温柔安神的薰衣草",c:"lav"}]},
    {ask:"别人常形容你的气质是？",options:[{t:"明朗阳光",c:"sun"},{t:"温润治愈",c:"lav"}]},
    {ask:"面对生活的风浪，你更像？",options:[{t:"带刺守护自己的玫瑰",c:"rose"},{t:"静立水中、波澜不惊的莲",c:"lotus"}]},
    {ask:"你最想送给朋友的祝福是？",options:[{t:"愿你眼里有光、心有希望",c:"sun"},{t:"愿你被温柔以待、好好安睡",c:"lav"}]},
    {ask:"此刻的你最需要？",options:[{t:"一阵热烈的释放与表达",c:"rose"},{t:"一段安静澄澈的独处",c:"lotus"}]}
  ];
  push({id:"fun_flower",name:"花语 · 气质测试",category:"趣味心理",kind:"fun",emoji:"🌷",
    colors:["#e6c9d6","#d9a9c0"],duration:"约 1 分钟 · 6 题",mode:"pick",
    desc:"花开花落各有姿态，你的气质又像哪一朵？轻松向的小趣味测试。",
    cats,catKeys:Object.keys(cats),pickResults,questions:Q});
})();

/* 4) 周末密钥 · 生活风格 */
(function(){
  const cats={energetic:{name:"元气型"},cozy:{name:"宅家型"},advent:{name:"行动型"},recharge:{name:"疗愈型"}};
  const pickResults={
    energetic:{emoji:"⚡",headline:"元气型 · 充实主义",color:"#e6a35a",
      sub:"你的周末喜欢排满有趣的事，越充实越有满足感。你不怕忙碌，只怕无聊。",
      advice:["在高强度里安排真正的休息","别让‘填满’替代‘享受’","试着留一个什么都不做的下午"],
      quote:"你把日子过得很满，也别忘了给心留点空。"},
    cozy:{emoji:"🏠",headline:"宅家型 · 舒适主义",color:"#c9a3a3",
      sub:"对你而言，最棒的周末是窝在家里、做点喜欢的小事。舒适与自在是你的充电站。",
      advice:["偶尔也走出去晒晒太阳","把宅家的时光过得有仪式感","邀请一两个朋友共享你的舒适区"],
      quote:"能把宅家过出滋味的人，更懂如何爱自己。"},
    advent:{emoji:"⛰️",headline:"行动型 · 体验主义",color:"#7fb3c0",
      sub:"你的周末要有点‘动静’才算过，运动、远足、尝试新事让你觉得活着。",
      advice:["注意给身体适度的恢复","把冒险精神也带到工作里","记录下每一次体验带来的成长"],
      quote:"你用脚步丈量世界，也用体验认识自己。"},
    recharge:{emoji:"🌊",headline:"疗愈型 · 慢充主义",color:"#7fbfa0",
      sub:"你的周末用来修复自己：泡澡、散步、看书、早睡。你懂得怎么把能量慢慢养回来。",
      advice:["把自我照顾当作优先级","把这种疗愈分享给在乎的人","别让‘应该’打扰你的休养节奏"],
      quote:"慢下来不是停摆，是让你重新满格的温柔。"}
  };
  const Q=[
    {ask:"理想中的周六上午是？",options:[{t:"睡到自然醒再懒懒待着",c:"cozy"},{t:"约上朋友/安排活动",c:"energetic"}]},
    {ask:"周末你会更想？",options:[{t:"去户外或尝试新东西",c:"advent"},{t:"在家泡个澡、好好休息",c:"recharge"}]},
    {ask:"最能让你恢复元气的是？",options:[{t:"做一桌菜或整理房间",c:"cozy"},{t:"散步、流汗、呼吸新鲜空气",c:"advent"}]},
    {ask:"如果多出半天自由，你会？",options:[{t:"去探店/看展/学点新技能",c:"energetic"},{t:"看书、冥想、给自己做顿好的",c:"recharge"}]},
    {ask:"你对‘完美周末’的定义是？",options:[{t:"安排得充实有收获",c:"energetic"},{t:"什么都不用赶、完全放松",c:"recharge"}]},
    {ask:"更多时候你的状态是？",options:[{t:"想立刻行动去体验",c:"advent"},{t:"想窝在沙发里好好待着",c:"cozy"}]}
  ];
  push({id:"fun_weekend",name:"周末密钥 · 生活风格",category:"趣味心理",kind:"fun",emoji:"🗓️",
    colors:["#a9cfc0","#7fbfa8"],duration:"约 1 分钟 · 6 题",mode:"pick",
    desc:"从你怎么过周末，看看你的生活充电方式与性格偏好。轻松向小测试。",
    cats,catKeys:Object.keys(cats),pickResults,questions:Q});
})();

/* 5) 心情甜度 · 你现在的状态 */
(function(){
  const cats={fresh:{name:"清新轻快"},rich:{name:"浓郁热烈"},calm:{name:"平静回甘"},fuzzy:{name:"温暖绵软"}};
  const pickResults={
    fresh:{emoji:"🍋",headline:"清新轻快 · 此刻明朗",color:"#9ccb5f",
      sub:"你当下的状态偏清新轻快，像是咬了一口柠檬气泡水，爽利又带点雀跃。",
      advice:["顺着这份轻快去做点开心的事","把明朗的状态分享给身边人","也允许偶尔酸一下，那很正常"],
      quote:"生活清爽的你，连烦恼都像被冰镇的汽水冲淡了。"},
    rich:{emoji:"🍫",headline:"浓郁热烈 · 情绪饱满",color:"#c97a4a",
      sub:"你此刻的感受偏浓郁，情绪浓度高，无论是想表达的、想争取的，都带着一股冲劲。",
      advice:["给这股浓烈一个出口：运动、书写、表达","别让上头让你忽略身体的节奏","浓烈之后，记得安抚自己"],
      quote:"你的浓烈让生活有滋味，也请让心有个回甘的缓冲。"},
    calm:{emoji:"🍵",headline:"平静回甘 · 安然自洽",color:"#8aa35f",
      sub:"你此刻像一杯温润的茶，平静而有回甘。你看得开、放得下，内心稳稳的。",
      advice:["珍惜这份难得的安定感","用这份平静去陪伴身边的人","平静是底气，别让它变成麻木"],
      quote:"能从日子里喝出回甘的人，最懂得生活的滋味。"},
    fuzzy:{emoji:"🍯",headline:"温暖绵软 · 渴望被爱",color:"#e0b06f",
      sub:"你此刻带着一点温暖绵软的心境，可能渴望被温柔对待，或正想念某个人、某种归属感。",
      advice:["允许自己表达对温暖的渴望","给自己一个被好好照顾的夜晚","主动联系那个让你安心的人"],
      quote:"想被温柔以待的你，请先温柔地接住自己。"}
  };
  const Q=[
    {ask:"此刻你想吃点什么解压？",options:[{t:"清爽的水果或汽水",c:"fresh"},{t:"浓郁暖心的甜品/热饮",c:"fuzzy"}]},
    {ask:"你更想来一口？",options:[{t:"浓醇的黑巧克力",c:"rich"},{t:"清茶或淡香的饮品",c:"calm"}]},
    {ask:"今天的心情底色更像？",options:[{t:"明亮有精神",c:"fresh"},{t:"平静安稳",c:"calm"}]},
    {ask:"如果给此刻配首歌，它更像？",options:[{t:"带劲、有律动的",c:"rich"},{t:"温柔舒缓的",c:"fuzzy"}]},
    {ask:"你更想被怎样安慰？",options:[{t:"陪我大笑、转移注意力",c:"fresh"},{t:"给我一个暖乎乎的拥抱",c:"fuzzy"}]},
    {ask:"这一天的你更像一杯？",options:[{t:"有层次的、够味的",c:"rich"},{t:"温润回甘、不刺的",c:"calm"}]}
  ];
  push({id:"fun_sweet",name:"心情甜度 · 此刻状态",category:"趣味心理",kind:"fun",emoji:"🍩",
    colors:["#f2c9b0","#e0a98f"],duration:"约 1 分钟 · 6 题",mode:"pick",
    desc:"用味觉的直觉描述你此刻的心情，把状态读成一段治愈的甜点解读。轻松向。",
    cats,catKeys:Object.keys(cats),pickResults,questions:Q});
})();

})();
