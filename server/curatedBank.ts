// Curated dictionary bank for high-frequency terms, sample queries, and idioms.
// Ensures instant (0ms) response, zero API quota usage, and seamless offline resilience.

export interface CuratedDictionaryItem {
  normalizedTerm: string;
  phonetic: string;
  partOfSpeech: string;
  naturalExplanation: string;
  examples: Array<{ target: string; translation: string }>;
  funUsageNotes: {
    culturalVibe: string;
    scenarios: string;
    tone: string;
    relatedWords: Array<{
      word: string;
      type: 'synonym' | 'confusing_similar';
      difference: string;
    }>;
  };
  visualMemoryHook: {
    metaphor: string;
    mnemonicTip: string;
    focalPoints: string[];
  };
  imagePrompt: string;
  conceptKeyword: string;
}

export const CURATED_ENTRIES: Record<string, CuratedDictionaryItem> = {
  'bite the bullet': {
    normalizedTerm: 'bite the bullet',
    phonetic: '/baɪt ðə ˈbʊl.ɪt/',
    partOfSpeech: '日常成语 (Idiom)',
    naturalExplanation: '咬紧牙关，硬着头皮迎难而上。指明知某件事极其艰难、痛苦或令人不快，但由于别无选择，只能强迫自己勇敢直面并付诸行动。',
    examples: [
      {
        target: "I didn't want to apologize, but I decided to bite the bullet and admit I was wrong.",
        translation: '我本不想道歉，但我决定硬着头皮迎难而上，承认是我错了。'
      },
      {
        target: "Dentist visits are terrifying, but you just have to bite the bullet and go.",
        translation: '看牙医确实令人发怵，但你只能咬咬牙挺过去。'
      }
    ],
    funUsageNotes: {
      culturalVibe: '源自古代野战外科手术：在没有麻醉药的战场上，伤员需紧咬一枚铅弹以忍受剧痛。现代日常中多带有一种“认栽但坦然决绝”的成熟自嘲感。',
      scenarios: '面对拖延很久的棘手工作、艰难的摊牌谈话、或者大笔必要但心痛的开销时。',
      tone: '决绝、坚毅、略带自嘲',
      relatedWords: [
        {
          word: 'face the music',
          type: 'synonym',
          difference: 'bite the bullet 侧重鼓起勇气主动去行动；face the music 侧重不得不为先前的错误承担后果。'
        },
        {
          word: 'swallow the bitter pill',
          type: 'synonym',
          difference: 'swallow the bitter pill 侧重被动接受令人难过的既定事实，而 bite the bullet 强调行动力。'
        }
      ]
    },
    visualMemoryHook: {
      metaphor: '一个身披斗篷但表情悲壮的卡通英雄，闭紧双眼、下颚青筋暴起，牙齿正死死咬住一颗闪闪发光的大金子弹，背景是一道即将跃过的悬崖。',
      mnemonicTip: '联想：嘴里紧咬着子弹（bullet），牙关紧闭，强迫自己跨出最艰难的第一步。',
      focalPoints: ['牙齿紧咬的金色大子弹', '紧绷坚毅的下颚与微表情', '身后跨越深渊的决绝姿态']
    },
    imagePrompt: 'vivid editorial cartoon illustration of an expressive humorous character gritting teeth tightly on a huge shiny golden bullet, determined facial expression, dramatic superhero stance, clean graphic contours, bright pop art colors, centered composition',
    conceptKeyword: 'determination grit courageous decision'
  },
  'serendipity': {
    normalizedTerm: 'serendipity',
    phonetic: '/ˌser.ənˈdɪp.ə.ti/',
    partOfSpeech: '名词 (Noun)',
    naturalExplanation: '不期而遇的美好，妙手偶得的机缘。指在并没有刻意寻找时，却意外发现了极具价值或令人惊喜的事物的奇妙能力或幸运契机。',
    examples: [
      {
        target: 'Finding my dream job while casually helping a friend was pure serendipity.',
        translation: '在随便帮朋友忙时居然碰上了我梦寐以求的工作，纯粹是妙不可言的机缘巧合。'
      },
      {
        target: 'Many scientific breakthroughs, like penicillin, were discovered through serendipity.',
        translation: '许多重大的科学突破（比如青霉素）都是通过这种意外偶得的奇遇诞生的。'
      }
    ],
    funUsageNotes: {
      culturalVibe: '被评为英语中最优美的单词之一。它不是单纯的瞎猫碰到死耗子（blind luck），而是强调一种开放、敏锐、与美好意外撞个满怀的情调。',
      scenarios: '旅途中误打误撞拐进神仙咖啡馆、偶遇多年未见挚友、无意中的尝试打开了新世界。',
      tone: '诗意、惊喜、温暖而感性',
      relatedWords: [
        {
          word: 'fluke',
          type: 'synonym',
          difference: 'fluke 仅仅指侥幸碰巧的成功，缺乏 serendipity 所蕴含的诗意与深刻美感。'
        },
        {
          word: 'epiphany',
          type: 'confusing_similar',
          difference: 'epiphany 是思想上的顿悟豁然开朗；serendipity 是外界机缘的巧合收获。'
        }
      ]
    },
    visualMemoryHook: {
      metaphor: '在一片平凡无奇的林间落叶小径上，漫步者随意翻开一块普通的小石头，下方竟然静静盛放着一颗散发着柔和金光的魔法四叶草与晶莹宝盒。',
      mnemonicTip: '记住“-dip-”音节带来的轻盈跃动感：随手一探（dip），便撞见天地赠予的奇妙偶遇。',
      focalPoints: ['被翻开的普通石块', '石下散发微光的金色四叶草', '寻访者脸上掩饰不住的灿烂惊喜']
    },
    imagePrompt: 'vivid editorial illustration of a traveler discovering a glowing treasure chest of luminous four-leaf clovers hidden under a simple stepping stone in an enchanted autumn path, radiant warm golden lighting, delightful joyful expression, whimsical and magical atmosphere',
    conceptKeyword: 'unexpected blessing pleasant surprise discovery'
  },
  'couch potato': {
    normalizedTerm: 'couch potato',
    phonetic: '/ˈkaʊtʃ pəˌteɪ.təʊ/',
    partOfSpeech: '日常俗语 (Slang)',
    naturalExplanation: '沙发土豆。极度形象地指那些整天懒洋洋瘫坐在沙发上看电视或刷手机、毫无运动意愿的慵懒一族。',
    examples: [
      {
        target: "After a grueling week, I just want to be a couch potato all weekend.",
        translation: '度过极其疲惫的一周后，我这个周末只想彻底当个瘫在沙发上的土豆。'
      },
      {
        target: "Stop being a couch potato and come outside for a brisk walk!",
        translation: '别再瘫在沙发上了，快出来透透气走两步！'
      }
    ],
    funUsageNotes: {
      culturalVibe: '完全没有恶意的调侃，反而是现代人在快节奏工作之余，对自己周末放松身心状态的心领神会的幽默解构。',
      scenarios: '周末宅家、节假日刷剧、互相取笑懒散状态。',
      tone: '轻松、亲昵调侃、无拘无束',
      relatedWords: [
        {
          word: 'slacker',
          type: 'confusing_similar',
          difference: 'slacker 偏指在工作学业中偷懒逃避责任的人；couch potato 专指生活起居上的慵懒休息。'
        }
      ]
    },
    visualMemoryHook: {
      metaphor: '一颗圆滚滚、戴着绒线袜的胖土豆，深深凹陷在松软的复古红色扶手沙发里，一手握着电视遥控器，一手抓着薯片，表情极其惬意。',
      mnemonicTip: '土豆（potato）长在了沙发（couch）上，生根发芽一动不动。',
      focalPoints: ['深陷沙发里胖乎乎的卡通土豆', '四散的零食碎屑与遥控器', '半眯着眼睛极度享受的惬意表情']
    },
    imagePrompt: 'cute and hilarious cartoon illustration of a plump potato character lounging deeply inside a giant cozy red armchair, holding TV remote control and munching chips, pure relaxation expression, vibrant warm living room, bold clean lines, pop art style',
    conceptKeyword: 'lazy comfortable lounging potato'
  },
  'pragmatic': {
    normalizedTerm: 'pragmatic',
    phonetic: '/præɡˈmæt.ɪk/',
    partOfSpeech: '形容词 (Adjective)',
    naturalExplanation: '务实的，重实效的。讲求从现实条件出发，注重解决实际问题而非空谈理论或追求不切实际的空想。',
    examples: [
      {
        target: 'We need a pragmatic solution that works within our current budget.',
        translation: '我们需要一个在现有预算范围内切实可行的务实方案。'
      },
      {
        target: 'His pragmatic approach helped the startup survive its toughest crisis.',
        translation: '他脚踏实地的务实做派帮助初创公司挺过了最严峻的危机。'
      }
    ],
    funUsageNotes: {
      culturalVibe: '高频职场与领导力赞美词。母语者在形容一个人成熟靠谱、不掉书袋时最爱用的词汇。',
      scenarios: '商业决策、产品设计讨论、评价团队伙伴的行事风格。',
      tone: '成熟、干练、理性客观',
      relatedWords: [
        {
          word: 'practical',
          type: 'synonym',
          difference: 'practical 是通用层面的“实用的/好用的”；pragmatic 更多用于思想决策与策略维度的“务实”。'
        },
        {
          word: 'idealistic',
          type: 'confusing_similar',
          difference: 'idealistic 是反义词，强调理想主义但可能脱离现实。'
        }
      ]
    },
    visualMemoryHook: {
      metaphor: '一位利落的工程师手握直尺与扳手，微笑着将空中漂浮的花哨气球轻轻引到结实的砖石基座上，打造成稳固实用的阶梯。',
      mnemonicTip: '“扑来个门”（pragmatic 音近）：与其空谈，不如扑下身子脚踏实地把门装好。',
      focalPoints: ['坚固稳准的实体砖石基底', '手中实用的工具直尺与扳手', '从浮夸空想变为稳健结构的对比']
    },
    imagePrompt: 'crisp graphic editorial illustration of a skilled artisan using a wrench and blueprint to build a solid stone bridge grounding floating dream clouds into reality, clear purposeful lighting, bold architectural lines, modern vector aesthetics',
    conceptKeyword: 'practical realistic efficient sensible'
  },
  'cognitive dissonance': {
    normalizedTerm: 'cognitive dissonance',
    phonetic: '/ˈkɒɡ.nə.tɪv ˈdɪs.ə.nəns/',
    partOfSpeech: '心理学专有名词 (Psychological Concept)',
    naturalExplanation: '认知失调。指当一个人的内在信念、态度与实际行为发生冲突矛盾时，心理上产生的那种如鲠在喉的极度不适与别扭感。',
    examples: [
      {
        target: 'Knowing that junk food is terrible for my health but eating it anyway creates acute cognitive dissonance.',
        translation: '明明深知垃圾食品对健康有害却仍大快朵颐，这带来了强烈的认知失调与内心撕扯。'
      },
      {
        target: 'To resolve cognitive dissonance, people often rationalize their questionable actions.',
        translation: '为了平复认知失调带来的难受，人们常常会给自己的不当行为找借口合理化。'
      }
    ],
    funUsageNotes: {
      culturalVibe: '现代社交网络与心理学高频词。当你发现自己“说一套做一套”并感到心虚抓狂时，用这个词既精准又带学术冷幽默。',
      scenarios: '自嘲破戒行为（如熬夜、乱花钱）、分析社会怪相与自我纠结。',
      tone: '理性深度、略带心理自我审视',
      relatedWords: [
        {
          word: 'hypocrisy',
          type: 'confusing_similar',
          difference: 'hypocrisy（虚伪）是故意对他人伪装道德；cognitive dissonance 是自己内心深处真实的自我冲突与痛苦。'
        }
      ]
    },
    visualMemoryHook: {
      metaphor: '一个人的大脑被具象化为两个性格迥异的齿轮小人：左边的小人在严正宣读健康食谱，右边的小人正把一整块巧克力塞进嘴里，齿轮相互卡死直冒火花。',
      mnemonicTip: '认知（cognitive）互相卡壳不和谐（dissonance），脑内小剧场打架。',
      focalPoints: ['两个反向旋转卡死的机械齿轮', '咬着巧克力的嘴与举着健康标语的手', '齿轮咬合处飞溅的滑稽小火星']
    },
    imagePrompt: 'expressive concept editorial art showing a character with dual conflicting thoughts, two interlocking gears sparking inside a transparent brain silhouette, one side eating cake the other holding fitness book, comical psychological tension, pop art colors',
    conceptKeyword: 'internal conflict contradiction mental struggle'
  },
  'gaslighting': {
    normalizedTerm: 'gaslighting',
    phonetic: '/ˈɡæsˌlaɪ.tɪŋ/',
    partOfSpeech: '名词/动名词 (Noun/Slang)',
    naturalExplanation: '煤气灯操纵（精神控制）。指通过不断否定事实、混淆视听、倒打一耙，让受害者逐渐怀疑自己的记忆力、判断力甚至神志清醒度的心理操纵手段。',
    examples: [
      {
        target: "He kept telling her she was imagining things until she realized it was manipulative gaslighting.",
        translation: '他不停地对她说“这都是你脑补出来的”，直到她猛然意识到这其实是一种险恶的精神操纵。'
      },
      {
        target: "Don't gaslight me; I saw what you did with my own eyes.",
        translation: '别想拿假话忽悠我颠倒黑白；我亲眼看到了你做的一切。'
      }
    ],
    funUsageNotes: {
      culturalVibe: '源自经典电影《煤气灯下》（Gaslight）。当今职场、恋爱与人际交往中最被警惕的“有毒”（toxic）沟通模式。',
      scenarios: '识别不良职场领导的甩锅行为、拆穿亲密关系中的洗脑与推卸责任。',
      tone: '警醒、严肃、犀利',
      relatedWords: [
        {
          word: 'manipulation',
          type: 'synonym',
          difference: 'manipulation 是广义的操纵；gaslighting 专指摧毁对方对自我现实感认知的操纵。'
        }
      ]
    },
    visualMemoryHook: {
      metaphor: '一个人站在一盏忽明忽暗的古典煤气路灯下，操纵者正悄悄在背后拧动阀门改变亮度，同时一本正经指着灯光对迷茫的主角说：“这灯亮得很稳，全是你眼睛花了”。',
      mnemonicTip: '煤气灯（gaslight）在闪，别人却硬说没有——警惕对方在动摇你的认知。',
      focalPoints: ['闪烁不定的复古铜质煤气灯', '背后操纵阀门的阴影之手', '主角眼眸中从困惑到恍然大悟的觉醒光彩']
    },
    imagePrompt: 'moody editorial illustration of an old Victorian streetlamp flickering curiously, shadowy figure manipulating the valve while telling a baffled person nothing changed, dramatic chiaroscuro lighting, deep mysterious blues and amber glow, modern stylized art',
    conceptKeyword: 'manipulation deception psychological control'
  },
  'procrastinate': {
    normalizedTerm: 'procrastinate',
    phonetic: '/prəˈkræs.tɪ.neɪt/',
    partOfSpeech: '动词 (Verb)',
    naturalExplanation: '习惯性拖延。明知应该立刻开始某项重要工作，却不断找借口将事情往后推迟，转而去做琐碎无关的消遣。',
    examples: [
      {
        target: 'I always procrastinate until the looming deadline forces me to panic-work.',
        translation: '我总是习惯性拖延，直到迫在眉睫的截止日期逼得我抓狂通宵。'
      },
      {
        target: 'Cleaning your desk when you have an essay due is classic procrastination.',
        translation: '在论文快交的时候突然跑去大扫除桌面，这是最经典的拖延症表现。'
      }
    ],
    funUsageNotes: {
      culturalVibe: '全球打工人与学生的共有灵魂共鸣。著名的 TED 演讲曾把拖延比作脑海里的“即时满足小猴子”。',
      scenarios: '写论文、备考、报税、启动新项目前的摸鱼逃避。',
      tone: '自嘲、幽默、人间真实',
      relatedWords: [
        {
          word: 'delay',
          type: 'synonym',
          difference: 'delay 可以是客观外部原因的推迟；procrastinate 纯粹是主观心理上的逃避拖延。'
        }
      ]
    },
    visualMemoryHook: {
      metaphor: '一只指针快要指到午夜 12 点的巨型闹钟前，主角正全神贯注地给一盆仙人掌数刺，桌上的厚重任务书落满了灰尘。',
      mnemonicTip: '“扑克拉死天”（procrastinate 音近）：把正事往后拉、往后拖，死命耗时间。',
      focalPoints: ['迫在眉睫狂响的倒计时闹钟', '正在认真数仙人掌刺的主角', '一旁被彻底冷落的重要任务卷轴']
    },
    imagePrompt: 'humorous editorial cartoon of a student carefully counting thorns on a cactus while a ticking monster clock towers in background with impending deadline, messy desk, expressive funny character, vivid pop palette, crisp line art',
    conceptKeyword: 'delay postponement avoidance time wasting'
  },
  'ambiguity': {
    normalizedTerm: 'ambiguity',
    phonetic: '/ˌæm.bɪˈɡjuː.ə.ti/',
    partOfSpeech: '名词 (Noun)',
    naturalExplanation: '模棱两可，含糊不清。指一句话、一种态度或局势存在两种或更多种可能的解释，缺乏明确界定与确定性。',
    examples: [
      {
        target: 'Great leaders are comfortable making tough decisions amidst ambiguity.',
        translation: '优秀的领导者善于在前景扑朔迷离、充满不确定性的迷雾中做出艰难抉择。'
      },
      {
        target: 'The ambiguity in the contract wording led to years of legal disputes.',
        translation: '合同措辞中的模棱两可导致了长达数年的法律纠纷。'
      }
    ],
    funUsageNotes: {
      culturalVibe: '常用于商业与文学。在文学中是“留白与双关的艺术”；在职场需求中则是让人抓狂的“不把话说清楚”。',
      scenarios: '评估项目风险、讨论艺术留白、吐槽需求文档不够明确。',
      tone: '客观、深刻、探讨性',
      relatedWords: [
        {
          word: 'vagueness',
          type: 'confusing_similar',
          difference: 'vagueness 是信息量太少而模糊（缺少细节）；ambiguity 则是同时有两种清晰但截然不同的解读可能。'
        }
      ]
    },
    visualMemoryHook: {
      metaphor: '一个站在交叉路口的路标牌，上面两支箭头分别指向左边与右边，但神奇的是路标由视觉双关图构成：既像一只优雅的天鹅，又像一只灵巧的兔子。',
      mnemonicTip: '“安比鬼题”（ambiguity 音近）：像猜谜鬼题一样，怎么看都既对又不对。',
      focalPoints: ['指向两个方向但相互融合的路标', '经典的双关图案（兔鸭错觉）', '路口若隐若现的晨雾']
    },
    imagePrompt: 'stylized graphic illustration of a traveler at a crossroad contemplating a paradoxical signpost shaped like an optical illusion duck-rabbit silhouette, mist swirling gently, philosophical mood, clean minimalist color palette',
    conceptKeyword: 'uncertainty multiple meanings double interpretation'
  },
  'epiphany': {
    normalizedTerm: 'epiphany',
    phonetic: '/ɪˈpɪf.ən.i/',
    partOfSpeech: '名词 (Noun)',
    naturalExplanation: '顿悟，灵光乍现。指长期苦思冥想或经历生活迷茫后，突然在某一瞬间彻底想通、豁然开朗的心灵领悟。',
    examples: [
      {
        target: 'While walking in the rain, she had an epiphany and solved the complex coding bug.',
        translation: '在雨中漫步时，她脑中突然灵光一闪，瞬间想通了困扰多时的复杂代码漏洞。'
      },
      {
        target: 'His sudden epiphany made him quit corporate life to pursue his painting dream.',
        translation: '那次突如其来的顿悟让他彻底下定决心辞去大厂工作，去追逐自己的绘画梦想。'
      }
    ],
    funUsageNotes: {
      culturalVibe: '充满戏剧性与仪式感的词。犹如电影中主角被一道金色圣光照耀，所有乱麻线索一秒全部理清的 Aha Moment！',
      scenarios: '科研突破、人生转折点、终于参透一道难题或人际关系真相。',
      tone: '震撼、庄重、启发人心',
      relatedWords: [
        {
          word: 'eureka',
          type: 'synonym',
          difference: 'eureka 是找到解答时的欢呼感叹词；epiphany 是指顿悟这一事件或体验本身。'
        }
      ]
    },
    visualMemoryHook: {
      metaphor: '一团本来缠绕得像毛线球一样的黑暗迷宫，在主角手指触碰的一瞬间，中心猛然绽放出一颗璀璨剔透的超新星灯泡，整片迷宫瞬间化为一条笔直明亮的金色大道。',
      mnemonicTip: '“一劈发泥”（epiphany）：如同一道闪电劈开混沌泥沼，豁然大亮。',
      focalPoints: ['瞬间解开的混乱毛线迷宫', '光芒四射的璀璨大灯泡', '主角瞳孔中倒映出的震撼顿悟']
    },
    imagePrompt: 'breathtaking concept art illustration of a person having a sudden breakthrough moment, an intricate glowing golden filament lightbulb blossoming from dark tangled threads, illuminating an open road ahead, vibrant contrast, radiant warm illumination',
    conceptKeyword: 'sudden realization aha moment breakthrough insight'
  },
  'lowkey': {
    normalizedTerm: 'lowkey',
    phonetic: '/ˌləʊˈkiː/',
    partOfSpeech: '副词/形容词 (Slang/Informal)',
    naturalExplanation: '暗地里，私底下；暗暗有点，暗戳戳。用来表达一种不想太张扬、悄悄在心里产生但又真实存在的情感、倾向或计划。',
    examples: [
      {
        target: 'I lowkey want to stay home tonight and just watch anime.',
        translation: '我暗戳戳其实挺想今晚就宅在家里看动漫的。'
      },
      {
        target: "She's lowkey one of the smartest people in our entire company.",
        translation: '她属于那种平时不显山露水、但私底下其实聪明绝顶的大神。'
      }
    ],
    funUsageNotes: {
      culturalVibe: '当代 Z 世代英语最高频词汇之一！反义词是 highkey（大张旗鼓、人尽皆知）。用来掩饰自己的害羞或者暗度陈仓的小心思。',
      scenarios: '表达难以启齿的小愿望、夸奖深藏不露的朋友、低调组局。',
      tone: '随和、地道、年轻化',
      relatedWords: [
        {
          word: 'secretly',
          type: 'synonym',
          difference: 'secretly 是严肃的“秘密地/偷偷地”；lowkey 更轻盈口语化，带有一种“其实心底里有点”的微妙语气。'
        }
      ]
    },
    visualMemoryHook: {
      metaphor: '一个戴着可爱兜帽的潮流猫咪，正用小爪子在嘴唇前比出“嘘”的手势，墨镜里倒映着小声密谋的俏皮微光。',
      mnemonicTip: '低调（low key）弹奏，不按大喇叭，悄悄办大事。',
      focalPoints: ['比在嘴唇上的轻柔“嘘”手势', '深色兜帽与墨镜', '神秘而俏皮的微表情']
    },
    imagePrompt: 'cool stylized cartoon illustration of a sly cute cat wearing a dark streetwear hoodie whispering a secret with paw on lips, mysterious but playful neon rim lighting, subtle stylish modern illustration, vector pop aesthetic',
    conceptKeyword: 'subtle discreet quiet secret modest'
  },
  'gatekeep': {
    normalizedTerm: 'gatekeep',
    phonetic: '/ˈɡeɪtˌkiːp/',
    partOfSpeech: '动词 (Slang/Neologism)',
    naturalExplanation: '私藏不肯分享；把持门槛。常指有些人发现了一家宝藏店铺、小众歌手或绝妙技巧后，故意藏着掖着不告诉别人，以此维持自己的优越感。',
    examples: [
      {
        target: "Please don't gatekeep where you bought that vintage leather jacket!",
        translation: '求求你别藏着掖着了，快告诉我你那件复古皮夹克是在哪儿淘到的！'
      },
      {
        target: 'She shared the secret recipe immediately because she hates gatekeeping good food.',
        translation: '她二话不说就把独家配方分享了出来，因为她最讨厌把美味藏私不分享。'
      }
    ],
    funUsageNotes: {
      culturalVibe: '社交媒体（TikTok/小红书/Instagram）爆款梗，常与 "Gaslight, Gatekeep, Girlboss" 连用。也是求链接、求种草时的幽默撒娇话术。',
      scenarios: '发现小众好物时、朋友不肯说底细时、求穿搭链接。',
      tone: '流行、幽默调侃、充满网感',
      relatedWords: [
        {
          word: 'hoard',
          type: 'synonym',
          difference: 'hoard 侧重囤积实体物品；gatekeep 专指把持信息和资源准入，阻挡别人参与。'
        }
      ]
    },
    visualMemoryHook: {
      metaphor: '一个守门人傲娇地锁紧一扇通往璀璨梦幻秘密花园的铁栅栏，花园里飘出诱人香气，外面围着一群好奇探头探脑的小伙伴。',
      mnemonicTip: '把守（keep）大门（gate），不让别人进去瞧个明白。',
      focalPoints: ['紧闭的复古雕花铁门与大铜锁', '花园内露出的炫目光彩与美味甜品', '守门人抱臂骄傲又神秘的滑稽神态']
    },
    imagePrompt: 'humorous graphic editorial illustration of a guard hugging a giant ornate key in front of a magical secret garden gate preventing curious visitors from peeking in, whimsical vibrant cartoon art, crisp bold lines, centered composition',
    conceptKeyword: 'withholding information secret keeping exclusivity'
  },
  'burn the midnight oil': {
    normalizedTerm: 'burn the midnight oil',
    phonetic: '/bɜːn ðə ˈmɪd.naɪt ɔɪl/',
    partOfSpeech: '日常成语 (Idiom)',
    naturalExplanation: '熬夜苦读，通宵达旦地工作。指到了深夜依然点灯熬夜，争分夺秒地完成工作或复习备考。',
    examples: [
      {
        target: 'The engineering team burned the midnight oil to push the software update before deadline.',
        translation: '工程师团队通宵达旦赶工，赶在最后期限前发布了软件更新。'
      },
      {
        target: 'I had to burn the midnight oil all week to ace the bar exam.',
        translation: '为了通过司法考试，我整整一周都在挑灯夜战。'
      }
    ],
    funUsageNotes: {
      culturalVibe: '源自古代电灯发明前人们点着煤油灯深夜攻读的历史。带有浓厚的勤奋、拼搏与专注色彩。',
      scenarios: '备考期末、考证冲刺、黑客马拉松、项目上线攻坚。',
      tone: '勤勉、拼搏、励志',
      relatedWords: [
        {
          word: 'pull an all-nighter',
          type: 'synonym',
          difference: 'pull an all-nighter 比较口语化，强调整晚没睡；burn the midnight oil 侧重长久以来的用功勤勉。'
        }
      ]
    },
    visualMemoryHook: {
      metaphor: '深夜窗外繁星点点，一位勤奋的书生或程序员正坐在堆满书籍与图纸的书桌前，桌上一盏金色的复古油灯正跳跃着明亮温暖的火焰，照亮了专注而兴奋的眼神。',
      mnemonicTip: '点燃（burn）午夜的灯油（midnight oil），照亮前进的奋斗长夜。',
      focalPoints: ['跳动着金色火苗的复古油灯', '窗外深邃宁静的午夜星空', '书桌上厚厚的笔记与专注的身影']
    },
    imagePrompt: 'warm glowing editorial illustration of an artist working late at a cozy wooden desk under starlit window, classic brass oil lamp with bright flame casting golden glow over sketchbooks, rich atmospheric colors, focus on dedication, beautiful digital painting',
    conceptKeyword: 'working late studying dedication midnight study'
  },
  'piece of cake': {
    normalizedTerm: 'piece of cake',
    phonetic: '/piːs əv keɪk/',
    partOfSpeech: '日常俗语 (Idiom)',
    naturalExplanation: '小菜一碟，轻而易举。指某件事极其简单轻松，不费吹灰之力就能搞定。',
    examples: [
      {
        target: "Don't worry about the driving test tomorrow; it's going to be a piece of cake.",
        translation: '别为明天的驾照路考担心，对你来说绝对是小菜一碟。'
      },
      {
        target: 'Setting up the new smart TV was a piece of cake thanks to the intuitive manual.',
        translation: '多亏了直观的说明书，安装这台新智能电视简直不费吹灰之力。'
      }
    ],
    funUsageNotes: {
      culturalVibe: '源自 19 世纪吃蛋糕的惬意享受。形容事情像吃下一块美味软糯的草莓蛋糕一样轻松享受，毫无负担。',
      scenarios: '安慰紧张的朋友、表达对某项任务的自信从容。',
      tone: '轻松、自信、鼓舞人心',
      relatedWords: [
        {
          word: 'walk in the park',
          type: 'synonym',
          difference: '两者意思非常相近，walk in the park 更强调过程悠闲顺畅。'
        },
        {
          word: 'no-brainer',
          type: 'confusing_similar',
          difference: 'no-brainer 侧重不需要动脑思考就能下的决定；piece of cake 侧重做起来很容易的事。'
        }
      ]
    },
    visualMemoryHook: {
      metaphor: '一块戴着小墨镜、头顶新鲜草莓的可爱草莓千层蛋糕，正悠闲地用吸管喝着果汁，身旁竖着一张写着“100分搞定”的金色奖牌。',
      mnemonicTip: '像吃蛋糕（piece of cake）一样甜美轻松，完全不用费力。',
      focalPoints: ['诱人的草莓奶油蛋糕切块', '酷酷的迷你墨镜与悠闲果汁', '象征满分通关的小奖牌']
    },
    imagePrompt: 'whimsical pop art cartoon illustration of a joyful strawberry slice of cake wearing cool sunglasses, relaxed pose, golden ribbon of victory, bright pastel background, cheerful confident vibe, crisp vector lines',
    conceptKeyword: 'easy effortless simple task cake'
  }
};

export function getCuratedEntry(query: string): CuratedDictionaryItem | null {
  if (!query || typeof query !== 'string') return null;
  const normalized = query.trim().toLowerCase().replace(/['"“”‘’]/g, "'");

  // Direct exact match
  if (CURATED_ENTRIES[normalized]) {
    return CURATED_ENTRIES[normalized];
  }

  // Without punctuation
  const cleanKey = normalized.replace(/[^\w\s]/g, '').trim();
  for (const [key, val] of Object.entries(CURATED_ENTRIES)) {
    const cleanEntryKey = key.toLowerCase().replace(/[^\w\s]/g, '').trim();
    if (cleanKey === cleanEntryKey) {
      return val;
    }
  }

  return null;
}
