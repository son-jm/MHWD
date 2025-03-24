//아래 주석도 뭐가 필요해서 쓴걸까?
/**
 * Monster Hunter 게임의 몬스터 생성자 함수
 * @param {Object}config 몬스터 구성에 필요한 설정 객체
 */

//config이 무슨 뜻이지? 내가 이해 하기로는 매개변수 받은 것 같은데 다른게 있으면 알려줘으면해
function Monster(config) {
  //||이걸 쓴 이유가 뭘까  내가 아는건 ||이건 or이라는 건데
  //config.id 아니면 0을 넣는다? 이런 개념이야? 아니면 무슨 개념이야?
  //그리고 this.이건 전걸? 밖에있는 위치를 가르킨다고 배웠는데 여기서 밖은 window만 있지 않아? 뭘 가르치는거야?
  //"Unknown"이건 무슨 의미가 있는거야? 아직은 모른다는거 아냐? 다른 의미나 다른 쓰임세가 있으면 알려줘
  this.id = config.id || 0;
  this.name = config.name || "Unknown";
  this.species = config.species || "Unknown";
  this.classification = config.classification || "Unknown";
  this.title = config.title || "";
  this.description = config.description || "";
  //사이즈를 정하는 부분 같은데 size뒤에 ? 이게 어떤 역활 한는거야?
  this.size = {
    average: config.size?.average || { length: 0, height: 0 },
    variation: config.size?.variation || { min: 0, max: 1.1 },
    crown: {
      small: config.size?.crown?.small || 0.9,
      large: config.size?.crown?.large || 1.1,
    },
  };
  this.stats = {
    health: {
      base: config.stats?.health?.base || 1000,
      modifier: {
        lowRank: config.stats?.health?.modifier?.lowRank || 1.0,
        highRank: config.stats?.health?.modifier?.highRank || 1.8,
        masterRank: config.stats?.health?.modifier?.masterRank || 3.2,
      },
    },
    stamina: config.stats?.stamina || 100,
    attackPower: config.stats?.attackPower || 100,
    defense: config.stats?.defense || 100,
    enrageThreshold: config.stats?.enrageThreshold || 100,
    exhaustThreshold: config.stats?.exhaustThreshold || 200,
    staggerThreshold: config.stats?.staggerThreshold || 150,
  };

  this.elements = config.elements || [];
  this.ailments = config.ailments || [];
  this.resistances = {
    elements: config.resistances?.elements || {
      fire: 0,
      water: 0,
      thunder: 0,
      ice: 0,
      dragon: 0,
    },
    ailments: config.resistances?.ailments || {
      poison: 0,
      paralysis: 0,
      sleep: 0,
      blast: 0,
      stun: 0,
    },
  };

  this.weaknesses = {
    elements: config.weaknesses?.elements || {
      fire: 0,
      water: 0,
      thunder: 0,
      ice: 0,
      dragon: 0,
    },
    damage: config.weaknesses?.damage || {
      cutting: 0,
      impact: 0,
      ammo: 0,
    },
  };

  //예시가 있는데 []안에 쓰면 된다는거야? 무슨 의미인지 잘 모르겠어 뒤에 코드 보면 여러가지가 있긴한데 아직||이게 이해가 안되서 무슨 의미인지 모르겠어
  this.bodyParts =
    config.bodyParts ||
    [
      //예시 : {id:"head", name:"머리", health:200, damageMultipliers:{cutting:1.5, impact:2.0, ammo:1.8}}
    ];
  this.breakableParts =
    config.breakableParts ||
    [
      //예시 : {id: "horns", name:"뿔", health:150, brokenState:false}
    ];
  this.severableParts =
    config.severableParts ||
    [
      //예시 : {id: "tail", name : "꼬리", health:180, severed:false}
    ];

  this.behavior = {
    aggressionLevel: config.behavior?.aggressionLevel || 1, // 1~5공격성 수준
    territorialRange: config.behavior?.territorialRange || 50, // 영역 보호 범위
    fleeTreshold: config.behavior?.fleeTreshold || 0.15, //도주 시작 체력 비율 (기본 15%)
    naturalPreys: config.behavior?.naturalPreys || [], //자연스럽게 사냥 하는 몬스터
    naturalPredators: config.behavior?.naturalPredators || [], // 천적 몬스터
    stateChangeThresHolds: config.behavior?.stateChangeThresHolds || {
      enraged: 0.8, // 분노 산태 진입 체력 비율
      exhausted: 0.5, //탈진 상태 진입 체력 비율
      limping: 0.3, //절뚝임 상태 진입 체력 비율
    },
  };

  this.abilities =
    config.abilities ||
    [
      //예시 : {id:"fireball", name:"화염구", damage : 120, element: "fire", cooldown: 30}
    ];
  this.drops = {
    materials: config.drops?.materials || [],
    carves: config.drops?.carves || {
      body: 3, //본체 벌채 회수
      tail: 1, //꼬리 벌체 횟수
    },
  };

  this.habitats =
    config.habitats ||
    [
      //예시 {id: "ancient_forest", name: "고대수림", probability:0.8 areas :[1, 2, 3, 6, 8]}
    ];

  this.currentState = {
    health: this.stats.health.base,
    stamina: this.stats.stamina,
    isEnraged: false,
    isExhausted: false,
    isLimping: false,
    currentArea: null,
    target: null,
    stunTime: 0,
    paralysisTime: 0,
    sleepTime: 0,
    poisonTime: 0,
    poisonDamage: 0,
  };
}
