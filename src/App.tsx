import { useCallback, useState } from 'react'
import ElderApp from './ElderApp'
import FamilyApp from './family/FamilyApp'
import {
  activities,
  elder,
  facilityGoal,
  familyMembers,
  familyQuestions,
  lifeStories,
} from './data/sampleData'
import type { FamilyQuestion, LifeStory, SessionLog } from './data/types'
import './App.css'

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

/**
 * 어르신 화면과 가족 화면을 함께 담는다.
 *
 * 두 화면이 같은 소재·문제·기록을 본다. 가족이 넣은 소재가 어르신 쪽에 보이고,
 * 어르신이 한 활동이 가족 쪽에 보인다.
 * 저장소를 쓰지 않으므로 새로고침하면 처음 상태로 돌아간다 (데모 범위).
 */
export default function App() {
  const [mode, setMode] = useState<'elder' | 'family'>('elder')
  const [stories, setStories] = useState<LifeStory[]>(lifeStories)
  const [questions, setQuestions] = useState<FamilyQuestion[]>(familyQuestions)
  const [log, setLog] = useState<SessionLog>(createLog)

  const handleLogChange = useCallback(
    (update: (current: SessionLog) => SessionLog) => setLog(update),
    [],
  )

  if (mode === 'family') {
    return (
      <FamilyApp
        elder={elder}
        me={familyMembers[0]}
        stories={stories}
        questions={questions}
        log={log}
        goal={facilityGoal}
        onAddStory={(story) => setStories((prev) => [story, ...prev])}
        onAddQuestion={(question) => setQuestions((prev) => [...prev, question])}
        onLeave={() => setMode('elder')}
      />
    )
  }

  return (
    <ElderApp
      elder={elder}
      questions={questions}
      activities={activities}
      stories={stories}
      onLogChange={handleLogChange}
      onSwitchMode={() => setMode('family')}
    />
  )
}
