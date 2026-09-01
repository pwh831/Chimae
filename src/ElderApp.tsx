import { useCallback, useMemo, useState } from 'react'
import ActivityScreen from './screens/ActivityScreen'
import ClosingScreen from './screens/ClosingScreen'
import type { ClosingSummaryItem } from './screens/ClosingScreen'
import HomeScreen from './screens/HomeScreen'
import MessageScreen from './screens/MessageScreen'
import QuestionScreen from './screens/QuestionScreen'
import type {
  Activity,
  Elder,
  FamilyQuestion,
  LifeStory,
  SessionLog,
} from './data/types'

/**
 * 하루에 할 활동 수.
 * PRD 3장의 하루 분량은 1~2개다. 지금은 만든 활동을 모두 보여주려고 열어 두었다.
 * 결선 시연에서 3~5분에 맞추려면 여기에 2를 넣으면 된다.
 */
const ACTIVITY_LIMIT: number | null = null

type Step = 'home' | 'question' | 'message' | 'activity' | 'closing'

type ActivityEntry = { activity: Activity; story?: LifeStory }

/** 마무리 화면에 보여줄 그림과 이름 */
function summarize(activity: Activity): ClosingSummaryItem {
  switch (activity.kind) {
    case 'recipe-order':
      return { id: activity.id, icon: 'pot', label: `${activity.data.dishName} 이야기` }
    case 'word-fill':
      return { id: activity.id, icon: 'word', label: '낱말 채우기' }
    case 'song-continue':
      return { id: activity.id, icon: 'song', label: `${activity.data.songTitle} 부르기` }
    case 'photo-recall':
      return { id: activity.id, icon: 'photo', label: '사진 보고 이야기' }
    case 'photo-people':
      return { id: activity.id, icon: 'people', label: '사진 속 사람 찾기' }
    case 'cup-ball':
      return { id: activity.id, icon: 'cup', label: '공 찾기' }
    case 'maze':
      return { id: activity.id, icon: 'maze', label: '길 따라가기' }
  }
}

type ElderAppProps = {
  elder: Elder
  questions: FamilyQuestion[]
  activities: Activity[]
  stories: LifeStory[]
  onLogChange: (update: (log: SessionLog) => SessionLog) => void
  onSwitchMode: () => void
}

/**
 * 어르신 쪽 하루 흐름.
 * 홈 → 문제 풀기 → 메시지 확인 → 답장 → 회상 활동 → 마무리
 *
 * 뒤로 가기는 두지 않는다. 되돌아갈 곳이 있으면 길을 잃으신다.
 */
export default function ElderApp({
  elder,
  questions,
  activities,
  stories,
  onLogChange,
  onSwitchMode,
}: ElderAppProps) {
  const [step, setStep] = useState<Step>('home')
  const [activeQuestion, setActiveQuestion] = useState<FamilyQuestion | null>(null)
  const [readQuestionIds, setReadQuestionIds] = useState<string[]>(() =>
    questions.filter((item) => item.isRead).map((item) => item.id),
  )
  const [activityIndex, setActivityIndex] = useState(0)
  const [doneActivities, setDoneActivities] = useState<Activity[]>([])

  /*
   * 오늘 할 활동.
   * 민감 주제로 표시된 소재에서 나온 활동은 뒤로 미룬다 (PRD 5.3).
   * 빼지는 않는다 — 가족이 넣어둔 소재이고, 어느 날은 그 이야기를 하고 싶으실 수 있다.
   */
  const sessionActivities = useMemo<ActivityEntry[]>(() => {
    const entries = activities.map((activity) => ({
      activity,
      story: stories.find((item) => item.id === activity.lifeStoryId),
    }))
    entries.sort(
      (a, b) =>
        Number(a.story?.isSensitive ?? false) - Number(b.story?.isSensitive ?? false),
    )
    return ACTIVITY_LIMIT === null ? entries : entries.slice(0, ACTIVITY_LIMIT)
  }, [activities, stories])

  const newQuestion = questions.find((item) => !readQuestionIds.includes(item.id))
  const current = sessionActivities[activityIndex]

  const handleStart = useCallback(() => {
    if (newQuestion) {
      setActiveQuestion(newQuestion)
      setStep('question')
      return
    }
    setStep(sessionActivities.length > 0 ? 'activity' : 'closing')
  }, [newQuestion, sessionActivities.length])

  const handleQuestionDone = useCallback(() => setStep('message'), [])

  const handleMessageDone = useCallback(() => {
    if (activeQuestion) {
      setReadQuestionIds((ids) => [...ids, activeQuestion.id])
    }
    setStep(sessionActivities.length > 0 ? 'activity' : 'closing')
  }, [activeQuestion, sessionActivities.length])

  const handleSpoken = useCallback(
    (text: string) => {
      const entry = sessionActivities[activityIndex]
      if (!entry) return
      onLogChange((log) => ({
        ...log,
        spokenNotes: [...log.spokenNotes, { activityId: entry.activity.id, text }],
        // 이야기가 이어진 소재로 남겨 가족에게 전한다
        wellReceivedLifeStoryIds: entry.story
          ? [...log.wellReceivedLifeStoryIds, entry.story.id]
          : log.wellReceivedLifeStoryIds,
      }))
    },
    [activityIndex, sessionActivities, onLogChange],
  )

  const handleActivityDone = useCallback(() => {
    const entry = sessionActivities[activityIndex]
    if (entry) {
      setDoneActivities((prev) => [...prev, entry.activity])
      onLogChange((log) => ({
        ...log,
        activityIds: [...log.activityIds, entry.activity.id],
      }))
    }
    const next = activityIndex + 1
    setActivityIndex(next)
    if (next >= sessionActivities.length) setStep('closing')
  }, [activityIndex, sessionActivities, onLogChange])

  const summary = useMemo<ClosingSummaryItem[]>(() => {
    const items: ClosingSummaryItem[] = []
    if (activeQuestion) {
      items.push({ id: activeQuestion.id, icon: 'talk', label: '문제 풀기' })
    }
    for (const activity of doneActivities) items.push(summarize(activity))
    return items
  }, [activeQuestion, doneActivities])

  return (
    <div className="app__screen" key={`${step}-${activityIndex}`}>
      {step === 'home' ? (
        <>
          <HomeScreen
            elder={elder}
            newQuestion={newQuestion}
            onStart={handleStart}
            onOpenPastStories={() => console.log('지난 이야기 보기')}
          />
          {/*
            시연용 전환 버튼. 어르신이 쓰는 것이 아니라 보여주는 사람이 쓴다.
            홈에서만 보여 다른 화면의 "누를 수 있는 것 최대 네 개"를 건드리지 않는다.
            11단계에서 개발자 도구와 함께 정리한다.
          */}
          <button
            type="button"
            className="app__mode-switch"
            // 어르신용 UI 기준을 재는 대상에서 빼기 위한 표시.
            // 어르신이 쓰는 것이 아니라 보여주는 사람이 쓰는 버튼이다.
            data-demo-tool="true"
            onClick={onSwitchMode}
          >
            가족 화면
          </button>
        </>
      ) : null}

      {step === 'question' && activeQuestion ? (
        <QuestionScreen question={activeQuestion} onDone={handleQuestionDone} />
      ) : null}

      {step === 'message' && activeQuestion ? (
        <MessageScreen question={activeQuestion} onDone={handleMessageDone} />
      ) : null}

      {step === 'activity' && current ? (
        <ActivityScreen
          elder={elder}
          activity={current.activity}
          story={current.story}
          onSpoken={handleSpoken}
          onDone={handleActivityDone}
        />
      ) : null}

      {step === 'closing' ? <ClosingScreen summary={summary} /> : null}
    </div>
  )
}
