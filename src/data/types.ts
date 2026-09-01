/*
 * 앱 전체가 공유하는 데이터 구조.
 *
 * 여기 정의된 모양은 나중에 AI가 만들어내는 데이터에도 그대로 적용된다.
 * (9단계에서 AI가 LifeStory 하나를 받아 Activity를 생성한다)
 * 구조를 바꾸면 뒤 단계 전체가 영향을 받으므로 신중하게 고친다.
 */

/** 어르신 */
export type Elder = {
  id: string
  /** 실제 이름 */
  name: string
  /** 화면에서 부르는 말. 예: "순자님" */
  callName: string
  profilePhotoUrl: string
}

/** 생애 소재의 갈래 */
export type LifeStoryCategory = 'food' | 'place' | 'song' | 'object' | 'person'

/** 가족·요양보호사가 입력한 생애 소재. 회상 활동의 재료가 된다. */
export type LifeStory = {
  id: string
  category: LifeStoryCategory
  /** 짧은 제목. 예: "김치찌개" */
  title: string
  /** 한두 문장 설명. 가족이 부담 없이 쓸 수 있는 분량 */
  description: string
  /**
   * 민감할 수 있는 주제인지 가족이 표시한 값.
   * true인 소재는 활동을 만들 때 우선순위를 낮춘다.
   */
  isSensitive: boolean
  photoUrl?: string
}

/** 문제를 보낸 가족 */
export type FamilyMember = {
  id: string
  name: string
  /** 어르신 기준 관계. 예: "손녀" */
  relation: string
  photoUrl: string
}

/** 손자녀가 낸 문제와 함께 보낸 메시지 */
export type FamilyQuestion = {
  id: string
  from: FamilyMember
  /** 문제 내용 */
  text: string
  /** 선택지는 항상 세 개다 */
  choices: [string, string, string]
  /**
   * 보낸 사람이 마음에 두고 있던 선택지.
   * 맞고 틀림을 가리는 값이 아니라, 고른 뒤 건넬 말을 정하는 데만 쓴다.
   * 어떤 선택지를 골라도 화면은 똑같이 다음으로 넘어간다.
   */
  senderChoiceIndex: 0 | 1 | 2
  /** 문제와 함께 보낸 메시지 */
  message: string
  photoUrl?: string
  /** 보낸 날짜 (YYYY-MM-DD) */
  sentAt: string
  isRead: boolean
}

/** 조리 순서 한 단계 */
export type RecipeStep = {
  id: string
  text: string
}

/**
 * 레시피 순서 맞히기에 쓰는 값.
 * steps의 배열 순서가 가족이 알려준 순서이긴 하지만, 어르신이 다르게 놓아도
 * 틀렸다고 말하지 않는다. 순서는 이야기를 꺼내기 위한 실마리일 뿐이다.
 */
export type RecipeOrderData = {
  /** 음식 이름. 예: "김치찌개" */
  dishName: string
  steps: RecipeStep[]
  /** 활동을 마친 뒤 이야기를 청하는 말 */
  invitation: string
}

/**
 * 빈칸에 들어갈 낱말 고르기.
 *
 * 격자형 크로스워드가 아니다. PRD 4.2가 크로스워드를 제외한 이유(난이도와
 * 문자 입력 부담)를 피하려고 문장 하나에 빈칸 하나만 둔다.
 *
 * choices는 셋 다 넣었을 때 말이 되는 낱말로 채운다.
 * 하나만 맞는 낱말을 두면 나머지 둘이 오답이 되어 판정이 생긴다.
 */
export type WordFillData = {
  /** 빈칸 앞부분. 예: "영도 골목에는" */
  before: string
  /** 빈칸 뒷부분. 예: "참 많았지요" */
  after: string
  choices: [string, string, string]
  invitation: string
}

/**
 * 노래 이어부르기.
 * 첫 소절을 보여드리고 그 다음을 불러주시도록 청한다.
 */
export type SongData = {
  songTitle: string
  /** 먼저 보여드리는 첫 소절 */
  openingLine: string
  invitation: string
}

type ActivityBase = {
  id: string
  /** 이 활동이 어떤 생애 소재에서 나왔는지 */
  lifeStoryId: string
}

/**
 * 회상 활동.
 * PRD 4.1의 나머지 활동(옛 동네 사진, 가족 사진 속 인물)은 만들 때 이 union에 더한다.
 */
export type Activity =
  | (ActivityBase & { kind: 'recipe-order'; data: RecipeOrderData })
  | (ActivityBase & { kind: 'word-fill'; data: WordFillData })
  | (ActivityBase & { kind: 'song-continue'; data: SongData })

export type ActivityKind = Activity['kind']

/** 활동 중에 어르신이 말한 내용 */
export type SpokenNote = {
  activityId: string
  /** 음성 인식 결과. 10단계 전까지는 채워지지 않는다 */
  text: string
}

/**
 * 하루 활동 기록.
 * 가족에게 "오늘 어떤 이야기에서 반응이 좋았는지" 전하는 데 쓴다.
 * 얼마나 잘했는지를 재는 값은 두지 않는다.
 */
export type SessionLog = {
  id: string
  /** YYYY-MM-DD */
  date: string
  /** 그날 참여한 활동 */
  activityIds: string[]
  spokenNotes: SpokenNote[]
  /** 이야기가 잘 이어졌던 소재. 다음 만남의 대화거리가 된다 */
  wellReceivedLifeStoryIds: string[]
}
