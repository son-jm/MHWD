import { rawListeners } from "process";

function Monster(config) {
  //기본 정보
  this.id = config.id || 0;
  this.name = config.name || "Unknown";
  this.species = config.species || "Unknown";
  this.classification = config.classification || "Unknown";
  this.title = config.title || "";
  this.description = config.description || "";
  this.size = {
    average: config.size?.average || { length: 0, height: 0 },
    variation: config.size?.variation || { min: 0, max: 1.1 },
    crown: {
      small: config.size?.crown?.small || 0.9,
      large: config.size?.crown?.large || 1.1,
    },
  };
  //상태 정보
  this.stats = {
    health: {
      base: config.stats?.health?.base || 1000,
      modifier: {
        //난이도별 체력 배율
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

  //속성 및 상태이상
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

  //약점(0~3, 수치가 높을수록 약점이 심함)
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

  //신체 부위별 데미지 배율 및 체력
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
    stateChangeThreHolds: config.behavior?.stateChangeThreHolds || {
      enraged: 0.8, // 분노 산태 진입 체력 비율
      exhausted: 0.5, //탈진 상태 진입 체력 비율
      limping: 0.3, //절뚝임 상태 진입 체력 비율
    },
  };

  //특수 능력 및 공격
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

  //서식지 및 위치 정보
  this.habitats =
    config.habitats ||
    [
      //예시 {id: "ancient_forest", name: "고대수림", probability:0.8 areas :[1, 2, 3, 6, 8]}
    ];

  //현제상태
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
