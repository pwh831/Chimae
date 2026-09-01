/*
 * 데모용 샘플 데이터.
 *
 * 여기 나오는 사람은 모두 가상 인물이다. 실제 개인정보를 넣지 않는다.
 * 9단계에서 AI가 활동을 만들다 실패하면 이 데이터로 대신 채운다.
 */

import type {
  Activity,
  Elder,
  FamilyMember,
  FamilyQuestion,
  LifeStory,
  SessionLog,
} from './types'

export const elder: Elder = {
  id: 'elder-1',
  name: '김순자',
  callName: '순자님',
  profilePhotoUrl: '/images/elder-sunja.svg',
}

const jimin: FamilyMember = {
  id: 'family-jimin',
  name: '지민',
  relation: '손녀',
  photoUrl: '/images/family-jimin.svg',
}

const junho: FamilyMember = {
  id: 'family-junho',
  name: '준호',
  relation: '손자',
  photoUrl: '/images/family-junho.svg',
}

export const familyMembers: FamilyMember[] = [jimin, junho]

export const lifeStories: LifeStory[] = [
  {
    id: 'story-kimchi-jjigae',
    category: 'food',
    title: '김치찌개',
    description:
      '명절이면 온 식구가 둘러앉아 먹던 음식. 묵은지를 들기름에 먼저 볶는 것이 순자님만의 방법이었다.',
    isSensitive: false,
    photoUrl: '/images/story-kimchi-jjigae.svg',
  },
  {
    id: 'story-yeongdo',
    category: 'place',
    title: '영도 골목',
    description:
      '스무 살까지 살던 부산 영도의 언덕 동네. 계단이 많아 물을 길어 오르내리던 이야기를 자주 하신다.',
    isSensitive: false,
    photoUrl: '/images/story-yeongdo.svg',
  },
  {
    id: 'story-dongbaek',
    category: 'song',
    title: '동백 아가씨',
    description:
      '라디오에서 나오면 늘 따라 부르시던 노래. 시장 일을 하며 흥얼거리곤 하셨다.',
    isSensitive: false,
  },
  {
    id: 'story-sewing-machine',
    category: 'object',
    title: '재봉틀',
    description:
      '아이들 옷을 직접 지어 입히던 발재봉틀. 손잡이를 돌리는 소리를 아이들이 좋아했다.',
    isSensitive: false,
  },
  {
    id: 'story-husband',
    category: 'person',
    title: '남편 이야기',
    description:
      '먼저 세상을 떠난 남편. 함께 시장에서 일하던 시절 이야기를 가끔 꺼내신다.',
    // 그리움이 큰 주제라 가족이 표시해 두었다. 활동을 만들 때 뒤로 미룬다.
    isSensitive: true,
  },
]

export const familyQuestions: FamilyQuestion[] = [
  {
    id: 'question-1',
    from: jimin,
    text: '할머니가 제일 잘 만드시던 음식은 무엇일까요?',
    choices: ['김치찌개', '된장국', '갈비찜'],
    senderChoiceIndex: 0,
    message:
      '할머니, 지민이에요. 오늘 학교에서 김치찌개가 나왔는데 할머니 생각이 났어요.',
    photoUrl: '/images/question-jimin-lunch.svg',
    sentAt: '2026-09-01',
    isRead: false,
  },
  {
    id: 'question-2',
    from: junho,
    text: '할머니가 어릴 때 사시던 동네는 어디일까요?',
    choices: ['부산 영도', '대구 수성', '광주 충장'],
    senderChoiceIndex: 0,
    message: '할머니, 준호예요. 다음에 그 동네 같이 가봐요.',
    sentAt: '2026-08-30',
    isRead: true,
  },
]

export const activities: Activity[] = [
  {
    id: 'activity-kimchi-order',
    kind: 'recipe-order',
    lifeStoryId: 'story-kimchi-jjigae',
    data: {
      dishName: '김치찌개',
      // 가족이 알려준 순서. 다르게 놓아도 틀렸다고 하지 않는다.
      steps: [
        { id: 'step-1', text: '묵은지를 들기름에 볶아요' },
        { id: 'step-2', text: '돼지고기를 넣고 같이 볶아요' },
        { id: 'step-3', text: '쌀뜨물을 붓고 끓여요' },
        { id: 'step-4', text: '두부와 파를 올려 마무리해요' },
      ],
    },
  },
  {
    id: 'activity-kimchi-talk',
    kind: 'free-talk',
    lifeStoryId: 'story-kimchi-jjigae',
    data: {
      invitation: '김치찌개에 얽힌 이야기가 있으신가요?',
    },
  },
]

export const sessionLogs: SessionLog[] = [
  {
    id: 'session-2026-08-31',
    date: '2026-08-31',
    activityIds: ['activity-kimchi-order', 'activity-kimchi-talk'],
    // 음성 기능은 10단계에서 붙는다. 그 전까지는 비어 있다.
    spokenNotes: [],
    wellReceivedLifeStoryIds: ['story-kimchi-jjigae'],
  },
]
