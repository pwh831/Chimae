import { useCallback, useMemo, useState } from 'react'
import ActivityScreen from './screens/ActivityScreen'
import ClosingScreen from './screens/ClosingScreen'
import type { ClosingSummaryItem } from './screens/ClosingScreen'
import HomeScreen from './screens/HomeScreen'
import MessageScreen from './screens/MessageScreen'
import QuestionScreen from './screens/QuestionScreen'
import { activities, elder, familyQuestions, lifeStories } from './data/sampleData'
import type { Activity, FamilyQuestion, LifeStory, SessionLog } from './data/types'
import './App.css'

type Step = 'home' | 'question' | 'message' | 'activity' | 'closing'

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

/*
 * 오늘 할 활동. 소재를 찾지 못한 활동은 조용히 뺀다.
 * 9단계에서 AI가 만든 활동이 이 자리에 들어온다.
 *
 * 지금은 있는 활동을 모두 이어서 한다. PRD 3장의 하루 분량은 1~2개이므로
 * 11단계에서 시연 길이에 맞게 줄인다.
 */
const sessionActivities = activities
  .map((activity) => ({
    activity,
    story: lifeStories.find((item) => item.id === activity.lifeStoryId),
  }))
  .filter(
    (entry): entry is { activity: Activity; story: LifeStory } =>
      entry.story !== undefined,
  )

/** 마무리 화면에 보여줄 그림과 이름 */
function summarize(activity: Activity): ClosingSummaryItem {
  switch (activity.kind) {
    case 'recipe-order':
      return { id: activity.id, icon: 'pot', label: `${activity.data.dishName} 이야기` }
    case 'word-fill':
      return { id: activity.id, icon: 'word', label: '낱말 채우기' }
    case 'song-continue':
      return { id: activity.id, icon: 'song', label: `${activity.data.songTitle} 부르기` }
  }
}

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
  const [activityIndex, setActivityIndex] = useState(0)
  const [log, setLog] = useState<SessionLog>(createLog)

  const newQuestion = familyQuestions.find(
    (item) => !readQuestionIds.includes(item.id),
  )

  const current = sessionActivities[activityIndex]
  const hasActivity = activityIndex < sessionActivities.length

  const handleStart = useCallback(() => {
    if (newQuestion) {
      setActiveQuestion(newQuestion)
      setStep('question')
      return
    }
    setStep(sessionActivities.length > 0 ? 'activity' : 'closing')
  }, [newQuestion])

  const handleQuestionDone = useCallback(() => setStep('message'), [])

  const handleMessageDone = useCallback(() => {
    if (activeQuestion) {
      setReadQuestionIds((ids) => [...ids, activeQuestion.id])
    }
    setStep(sessionActivities.length > 0 ? 'activity' : 'closing')
  }, [activeQuestion])

  const handleSpoken = useCallback(
    (text: string) => {
      const entry = sessionActivities[activityIndex]
      if (!entry) return
      setLog((prev) => ({
        ...prev,
        spokenNotes: [...prev.spokenNotes, { activityId: entry.activity.id, text }],
        // 이야기가 이어진 소재로 남겨 가족에게 전한다
        wellReceivedLifeStoryIds: [...prev.wellReceivedLifeStoryIds, entry.story.id],
      }))
    },
    [activityIndex],
  )

  const handleActivityDone = useCallback(() => {
    const entry = sessionActivities[activityIndex]
    if (entry) {
      setLog((prev) => ({
        ...prev,
        activityIds: [...prev.activityIds, entry.activity.id],
      }))
    }
    const next = activityIndex + 1
    setActivityIndex(next)
    if (next >= sessionActivities.length) setStep('closing')
  }, [activityIndex])

  const summary = useMemo<ClosingSummaryItem[]>(() => {
    const items: ClosingSummaryItem[] = []
    if (activeQuestion) {
      items.push({ id: activeQuestion.id, icon: 'talk', label: '문제 풀기' })
    }
    for (const id of log.activityIds) {
      const entry = sessionActivities.find((item) => item.activity.id === id)
      if (entry) items.push(summarize(entry.activity))
    }
    return items
  }, [activeQuestion, log.activityIds])

  return (
    <div className="app__screen" key={`${step}-${activityIndex}`}>
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

      {step === 'activity' && hasActivity ? (
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
