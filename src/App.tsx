import { useCallback, useMemo, useState } from 'react'
import ActivityScreen from './screens/ActivityScreen'
import ClosingScreen from './screens/ClosingScreen'
import type { ClosingSummaryItem } from './screens/ClosingScreen'
import HomeScreen from './screens/HomeScreen'
import MessageScreen from './screens/MessageScreen'
import QuestionScreen from './screens/QuestionScreen'
import { activities, elder, familyQuestions, lifeStories } from './data/sampleData'
import type { Activity, FamilyQuestion, SessionLog } from './data/types'
import './App.css'

type Step = 'home' | 'question' | 'message' | 'activity' | 'closing'

type RecipeOrderActivity = Extract<Activity, { kind: 'recipe-order' }>

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function createLog(): SessionLog {
  return {
    id: `session-${todayKey()}`,
    date: todayKey(),
    activityIds: [],
    spokenNotes: [],
    wellReceivedLifeStoryIds: [],
  }
}

/* 오늘 쓸 활동 재료. 9단계에서 AI가 만든 것으로 바뀔 자리다. */
const recipeActivity = activities.find(
  (item): item is RecipeOrderActivity => item.kind === 'recipe-order',
)
const talkActivity = activities.find((item) => item.kind === 'free-talk')
const activityStory = lifeStories.find((item) => item.id === recipeActivity?.lifeStoryId)

/**
 * 하루 흐름을 잇는다.
 * 홈 → 문제 풀기 → 메시지 확인 → 답장 → 회상 활동 → 마무리
 *
 * 뒤로 가기는 두지 않는다. 되돌아갈 곳이 있으면 길을 잃으신다.
 */
export default function App() {
  const [step, setStep] = useState<Step>('home')
  const [activeQuestion, setActiveQuestion] = useState<FamilyQuestion | null>(null)
  const [readQuestionIds, setReadQuestionIds] = useState<string[]>(() =>
    familyQuestions.filter((item) => item.isRead).map((item) => item.id),
  )
  const [log, setLog] = useState<SessionLog>(createLog)

  const newQuestion = familyQuestions.find(
    (item) => !readQuestionIds.includes(item.id),
  )

  /** 활동 재료가 갖춰졌을 때만 회상 활동으로 간다. 없으면 조용히 마무리로 넘어간다 */
  const canDoActivity = Boolean(recipeActivity && activityStory)

  const handleStart = useCallback(() => {
    if (newQuestion) {
      setActiveQuestion(newQuestion)
      setStep('question')
      return
    }
    setStep(canDoActivity ? 'activity' : 'closing')
  }, [newQuestion, canDoActivity])

  const handleQuestionDone = useCallback(() => setStep('message'), [])

  const handleMessageDone = useCallback(() => {
    if (activeQuestion) {
      setReadQuestionIds((ids) => [...ids, activeQuestion.id])
    }
    setStep(canDoActivity ? 'activity' : 'closing')
  }, [activeQuestion, canDoActivity])

  const handleSpoken = useCallback((text: string) => {
    if (!recipeActivity || !activityStory) return
    setLog((current) => ({
      ...current,
      spokenNotes: [
        ...current.spokenNotes,
        { activityId: talkActivity?.id ?? recipeActivity.id, text },
      ],
      // 이야기가 이어진 소재로 남겨 가족에게 전한다
      wellReceivedLifeStoryIds: [
        ...current.wellReceivedLifeStoryIds,
        activityStory.id,
      ],
    }))
  }, [])

  const handleActivityDone = useCallback(() => {
    if (recipeActivity) {
      const done = [recipeActivity.id, ...(talkActivity ? [talkActivity.id] : [])]
      setLog((current) => ({
        ...current,
        activityIds: [...current.activityIds, ...done],
      }))
    }
    setStep('closing')
  }, [])

  const summary = useMemo<ClosingSummaryItem[]>(() => {
    const items: ClosingSummaryItem[] = []
    if (activeQuestion) {
      items.push({ id: activeQuestion.id, icon: 'talk', label: '문제 풀기' })
    }
    if (recipeActivity && log.activityIds.includes(recipeActivity.id)) {
      items.push({
        id: recipeActivity.id,
        icon: 'pot',
        label: `${recipeActivity.data.dishName} 이야기`,
      })
    }
    return items
  }, [activeQuestion, log.activityIds])

  return (
    <div className="app__screen" key={step}>
      {step === 'home' ? (
        <HomeScreen
          elder={elder}
          newQuestion={newQuestion}
          onStart={handleStart}
          onOpenPastStories={() => console.log('지난 이야기 보기')}
        />
      ) : null}

      {step === 'question' && activeQuestion ? (
        <QuestionScreen question={activeQuestion} onDone={handleQuestionDone} />
      ) : null}

      {step === 'message' && activeQuestion ? (
        <MessageScreen question={activeQuestion} onDone={handleMessageDone} />
      ) : null}

      {step === 'activity' && recipeActivity && activityStory ? (
        <ActivityScreen
          elder={elder}
          activity={recipeActivity}
          story={activityStory}
          invitation={
            talkActivity?.kind === 'free-talk'
              ? talkActivity.data.invitation
              : `${activityStory.title} 이야기를 들려주시겠어요?`
          }
          onSpoken={handleSpoken}
          onDone={handleActivityDone}
        />
      ) : null}

      {step === 'closing' ? <ClosingScreen summary={summary} /> : null}
    </div>
  )
}
