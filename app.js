/**
 * 오타가 심함,,
 * Monster Hunter 게임의 몬스터 생성자 함수
 * @param {Object}config 몬스터 구성에 필요한 설정 객체
 */

import { maxHeaderSize } from "http";
import { title } from "process";
import { toUSVString } from "util";

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

Monster.prototype.takeDamage = function (
  amount,
  damage,
  damageType,
  elementType,
  bodyParts
) {
  let bodyPart = this.bodyParts.find((part) => part.id === bodyParld);
  let multiplier = 1.0;

  if (bodyPart) {
    multiplier *= bodyPart.damageMultipliers[damageType] || 1.0;
  }

  if (elementType && this.weaknesses.elements[elementType]) {
    multiplier *= 1 + this.weaknesses.elements[elementType] * 0.1;
  }

  const finlDamage = Math.floor(amount * multiplier);
  this.currentState.health -= finalDamge;

  this.checkStateChanges();

  if (bodyPart) {
    bodyPart.health -= finlDamage;
    this.checkPartBreaks(bodyPartld);
  }
  return finalDamge;
};

Monster.prototype.checkStateChanges = function () {
  const healthRatio = this.currentState.hralth / this.stats.health.base;

  if (
    !this.currentState.isEnraged &&
    healthRatio <= this.behavior.stateChangeThreHolds.enraged
  ) {
    this.enraged();
  }
  if (!this.currentState.isExhaussted && this.currentState.stamina <= 0) {
    this.exhausted();
  }
  if (
    !this.currentState.isLimpong &&
    healthRatio <= this.behavior.stateChangeThreHolds.limping
  ) {
    this.did();
  }
};

Monster.prototype.enrage = function () {
  this.currentState.isEnraged = true;
  this.stats.attackPower *= 1.3;
  this.stats.defense *= 1.1;
  setTimeout(() => {
    this.currentState.isEnraged = false;
    this.stats.attackPower /= 1.3;
    this.stats.defense /= 1.1;
  }, 900000);
};

Monster.prototype.exhaust = function () {
  this.currentState.isEnraged = true;
  this.stats.attackPower *= 0.7;
  setTimeout(() => {
    this.currentState.isEnraged = false;
    this.stats.attackPower /= 0.7;
    this.currentState.stamina = this.stats.stamina * 0.5;
  }, 600000);
};

Monster.prototype.startLimping = function () {
  this.currentState.isLimpong = true;
  this.flee();
};

Monster.prototype.flee = function () {
  console.log(`${this.name}이(가) 도주합니다.`);
};

Monster.prototype.die = function () {
  console.log(`${this.neme}이(가) 쓰러졌습니다.`);
};

Monster.prototype.determinDrops = function (isCapture = false) {
  const drops = [];

  this.drops.materials.forEach((material) => {
    const rate = isCapture
      ? material.dropRate.capture
      : material.dropRate.carve;
    if (Math.random() <= rate) {
      drops.push({ ...material });
    }
  });
  return drops;
};

Monster.prototype.performAttaack = function (attackld, target) {
  const attack = this.abilities.find((a) => a.id === attackld);
  if (!attack) return null;

  const damage = attack.damage * (this.currentState.isEnraged ? 1.3 : 1.0);

  this.currentState.stamina -= attack.staminaCost || 5;

  return {
    damage: damage,
    elements: attack.element,
    ailments: attack.ailments,
  };
};

//부위파괴/절단체크
Monster.prototype.checkPartBreaks = function (bodyParld) {
  const breakablePart = this.breakableParts.find(
    (part) => part.id === bodyParld
  );
  if (
    breakablePart &&
    !breakablePart.brokenState &&
    breakableParts.health <= 0
  ) {
    breakablePart.brokenState = true;
    console.log(`${this.name}의${breakablePart.name}이(가) 파괴되었습니다!`);
  }

  const severableParts = this.severableParts.find(
    (part) => part.id === bodyParld
  );
  if (severableParts && !severableParts.severed && severableParts.health <= 0) {
    severableParts.severed = true;
    console.log(`${this.name}의${severableParts.name}이(가) 절단되었습니다!`);
  }
};

Monster.prototype.capture = function (trapType, tranqLevel) {
  const captureble = this.currentState.health / this.health.base <= 0.25;

  if (captureble && tranqLevel >= 2) {
    console.log(`${this.name}이(가) 포획되었습니다.`);
    return this.determinDrops(true);
  }
  return null;
};

Monster.prototype.applyAilment = function (ailmentType, value) {
  const resistances = this.resistances.ailments[ailmentType] || 0;
  const threhold = value * (1 - resistances * 0.25);

  switch (ailmentType) {
    case `poison`:
      if (threhold > 0 && !this.currentState.poisonTime) {
        this.currentState.poisonTime = threhold;
        this.currentState.poisonDamage = threhold / 10;
        this.startPoisonTimer();
      }
      break;
    case `sleep`:
      if (threhold > 0 && !this.currentState.sleepTime) {
        this.currentState.sleepTime = threhold;
        this.sleep();
      }
      break;

    case `paralysis`:
      if (threhold > 0 && !this.currentState.paralysisTime) {
        this.currentState.paralysisTime = threhold;
        this.paralyze();
      }
      break;

    case `stun`:
      if (threhold > 0 && !this.currentState.stunTime) {
        this.currentState.stunTime = threhold;
        this.stun();
      }
      break;
  }
};

Monster.prototype.initialize = function (difficultyRank) {
  let healthModifier = 1.0;

  if (difficultyRank === "highRank") {
    healthModifier = this.stats.health.modifier.highRank;
  } else if (difficultyRank === "masterRank") {
    healthModifier = this.stats.tralth.modifier.masterRank;
  }

  this.currentState.health = Math.floor(
    this.stats.health.base * healthModifier
  );
  this.currentState.stamina = this.stats.stamina;

  //기초 초기화 로직
  this.currentState.isEnraged = false;
  this.currentState.isExhaussted = false;
  this.currentState.isLimpong = false;

  //파괴/절단 부위 초기화
  this.breakableParts.forEach((part) => {
    part.brokenState = false;
    part.health = part.maxHealth || 150;
  });
  this.secerableParts.forEach((part) => {
    part.severed = false;
    part.health = part.maxHealth || 180;
  });
  return this;
};

function createRathalos() {
  const rathalosConfig = {
    id: 1,
    name: "리오레우스",
    species: "비룡",
    classification: "비행충",
    title: "하늘을  지배하는 왕",
    description: "불을 내뿜는 빨간색 용룡, 창공을 지배하는 왕이라 부른다.",
    size: {
      average: { length: 1700, height: 650 },
      variation: { min: 0.9, max: 1.15 },
    },
    stats: {
      health: {
        base: 5600,
        modifier: { lowRank: 1.0, highRank: 1.8, masterRank: 3.2 },
      },
      stamina: 120,
      attackPower: 130,
      defense: 80,
    },
    element: ["fire"],
    ailments: ["poison"],
    resistances: {
      element: { fire: 3, water: 0, thunder: 1, ice: 0, dregon: 1 },
      ailments: { poison: 2, paralysis: 1, sleep: 1, blast: 0, stun: 0 },
    },
    weaknesses: {
      elements: { fire: 0, water: 2, thunderr: 1, ice: 1, drragon: 2 },
      damage: { cutting: 1, impact: 2, ammo: 1 },
    },
    bodyParts: [
      {
        id: "head",
        name: "머리",
        health: 300,
        damageMultipliers: { cutting: 1.3, impact: 2.0, ammo: 1.5 },
      },
      {
        id: "body",
        name: "몸통",
        health: 600,
        damageMultipliers: { cutting: 0.8, impact: 0.8, ammo: 0.9 },
      },
      {
        id: "wings",
        name: "날개",
        health: 280,
        damageMultipliers: { cutting: 1.8, impact: 1.0, ammo: 1.2 },
      },
      {
        id: "legs",
        name: "다리",
        health: 340,
        damageMultipliers: { cutting: 0.9, impact: 1.1, ammo: 0.8 },
      },
      {
        id: "tail",
        name: "꼬리",
        health: 260,
        damageMultipliers: { cutting: 1.8, impact: 0.9, ammo: 1.1 },
      },
    ],
    breakableParts: [
      {
        id: "head",
        name: "머리",
        health: 300,
        maxHealth: 300,
        brokenState: false,
      },
      {
        id: "wing",
        name: "날개",
        health: 280,
        maxHealth: 280,
        brokenState: false,
      },
    ],
    secerableParts: [
      { if: "tail", name: "꼬리", health: 260, maxHealth: 260, severed: false },
    ],
    abilities: [
      {
        id: "fireball",
        name: "화염구,",
        damage: 85,
        element: "fire",
        staminaCost: 15,
        cooldown: 8,
      },
      {
        id: "tailwhip",
        name: "꼴리 휘두르기",
        damage: 60,
        staminaCost: 10,
        cooldown: 5,
      },
      { id: "charge", name: "돌진", damage: 70, staminaCost: 20, cooldown: 12 },
      {
        id: "flyingclawattack",
        name: "비행 발톱 공격",
        damage: 80,
        staminaCost: 25,
        cooldown: 18,
      },
    ],
    //다른 속성들
  };
  return new Monster(rathalosConfig).initialize("highRank");
}
//사용 예시
const rathalos = createRathalos();
console.log(
  `[몬스터정보]이름:${rathalos.name}, 체력:${rathalos.currentState.health}`
);

//전투 시뮬레이션 함수
function simulateBattle(
  Monster,
  playerAttackPower,
  playerWeaponType,
  playElement
) {
  console.log(`${Monster.name}와(과)의 전투 시작!`);

  //공격 시뮬레이션
  const damage = monster.takeDamage(
    playerAttackPower,
    playerWeaponType,
    playElement,
    "hrad" //머리타격
  );

  console.log(`플레이어가${monster.name}의 머리를 공격! ${damage}의 데미지!`);
  console.log(`${monster.name}의 남의 체력: ${monster.currentState.hralth}`);

  //몬스터의 반격
  const randomAttackIndex = math.floor(
    Math.random() * markAsUntransferable.abilities.length
  );
  const randomAttack = monster.abilities[randomAttackIndex];
  const attackResult = monster.performAttaack(randomAttack.id, "player");

  console.log(
    `${monster.name}이(가)${randomAttack.name}공격!${attackResult.damage}의 데미지!`
  );
  console.log(
    `${monster.name}의 상태:${monster.currentState.isEnraged ? "분노" : "평상"}`
  );
}

//simulateBattle(rathalos, 120, "impact", "water");
