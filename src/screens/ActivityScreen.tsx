import { useEffect, useRef, useState } from 'react'
import ScreenLayout from '../components/ScreenLayout'
import { activities, elder, lifeStories } from '../data/sampleData'
import type { RecipeStep, SessionLog } from '../data/types'
import './ActivityScreen.css'

/** 반응 문구가 머무는 시간 */
const REACTION_MS = 2800

/**
 * 어떤 순서로 놓든 건네는 말은 하나다.
 * 순서에 따라 말을 다르게 하면 그것이 곧 채점이 된다.
 */
const REACTION_WORDS = '이렇게 만드는 분도 계시죠'

type Phase = 'ordering' | 'reaction' | 'talking' | 'done'

/**
 * 이름 끝 글자에 받침이 있는지 본다.
 * 홈 화면과 메시지 화면에도 같은 판별이 있다. 7단계에서 한곳으로 모으는 것이 좋겠다.
 */
function hasFinalConsonant(word: string): boolean {
  const lastChar = word.at(-1)
  if (!lastChar) return false
  const code = lastChar.charCodeAt(0)
  if (code < 0xac00 || code > 0xd7a3) return false
  return (code - 0xac00) % 28 !== 0
}

function MicIcon() {
  return (
    <svg viewBox="0 0 96 96" width="112" height="112" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="36" y="12" width="24" height="44" rx="12" />
      <path d="M24 46c0 13.3 10.7 24 24 24s24-10.7 24-24" />
      <path d="M48 70v14" />
    </svg>
  )
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * 회상 활동 화면. 김치찌개 조리 순서를 탭으로 배열한 뒤,
 * 그 음식에 얽힌 이야기를 청한다.
 *
 * 순서가 맞았는지 따지지 않는다. 고른 순서를 그대로 보여줄 뿐,
 * 어느 자리가 어떠했는지 표시하지 않는다.
 */
export default function ActivityScreen() {
  const orderActivity = activities.find((item) => item.kind === 'recipe-order')
  const talkActivity = activities.find((item) => item.kind === 'free-talk')
  const story = lifeStories.find((item) => item.id === orderActivity?.lifeStoryId)

  const [phase, setPhase] = useState<Phase>('ordering')
  const [picked, setPicked] = useState<RecipeStep[]>([])
  const [isHolding, setIsHolding] = useState(false)

  /*
   * 하루 활동 기록. 지금은 메모리에만 둔다.
   * 어르신이 말한 내용이 여기 쌓여 가족에게 전해진다.
   * 화면에 그리는 값이 아니라 쌓아 두는 값이라 ref로 둔다.
   * 7단계에서 화면 전체가 이어지면 이 기록은 위로 올라간다.
   */
  const sessionLogRef = useRef<SessionLog>({
    id: `session-${todayKey()}`,
    date: todayKey(),
    activityIds: [],
    spokenNotes: [],
    wellReceivedLifeStoryIds: [],
  })

  useEffect(() => {
    if (phase !== 'reaction') return
    const timer = window.setTimeout(() => setPhase('talking'), REACTION_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  // 활동을 만들 재료가 없으면 조용히 아무것도 하지 않는다
  if (!orderActivity || orderActivity.kind !== 'recipe-order' || !story) return null

  // 위 검사로 좁혀진 값을 그대로 두면 함수 안에서 다시 넓어진다. 여기서 붙잡아 둔다
  const recipe = orderActivity
  const activityStory = story
  const steps = recipe.data.steps

  function handlePick(step: RecipeStep) {
    const next = [...picked, step]
    setPicked(next)
    if (next.length === steps.length) {
      const log = sessionLogRef.current
      sessionLogRef.current = {
        ...log,
        activityIds: [...log.activityIds, recipe.id],
      }
      setPhase('reaction')
    }
  }

  function handleTalkEnd() {
    setIsHolding(false)
    const log = sessionLogRef.current
    const updated: SessionLog = {
      ...log,
      activityIds: talkActivity ? [...log.activityIds, talkActivity.id] : log.activityIds,
      spokenNotes: [
        ...log.spokenNotes,
        // 실제 말한 내용은 10단계에서 채워진다
        { activityId: talkActivity?.id ?? recipe.id, text: '' },
      ],
      // 이야기가 이어진 소재로 남겨 가족에게 전한다
      wellReceivedLifeStoryIds: [...log.wellReceivedLifeStoryIds, activityStory.id],
    }
    sessionLogRef.current = updated
    console.log('오늘 기록', updated)
    setPhase('done')
  }

  if (phase === 'done') {
    return (
      <ScreenLayout title="오늘 이야기">
        <div className="activity__centered">
          <p className="activity__placeholder-text">마무리 화면 예정</p>
        </div>
      </ScreenLayout>
    )
  }

  if (phase === 'talking') {
    return (
      <ScreenLayout
        title={talkActivity?.kind === 'free-talk' ? talkActivity.data.invitation : ''}
      >
        <div className="activity__centered">
          <button
            type="button"
            className={`activity__mic${isHolding ? ' activity__mic--held' : ''}`}
            aria-label="누르고 있는 동안 녹음"
            onPointerDown={() => setIsHolding(true)}
            onPointerUp={handleTalkEnd}
            onPointerLeave={() => setIsHolding(false)}
            onPointerCancel={() => setIsHolding(false)}
          >
            <MicIcon />
          </button>
          <p className="activity__hint">{isHolding ? '녹음 중...' : ''}</p>
        </div>
      </ScreenLayout>
    )
  }

  if (phase === 'reaction') {
    return (
      <ScreenLayout title={`${activityStory.title} 이야기`}>
        <div className="activity__centered">
          <p className="activity__reaction-text">{REACTION_WORDS}</p>
        </div>
      </ScreenLayout>
    )
  }

  const dish = recipe.data.dishName
  const subjectParticle = hasFinalConsonant(elder.callName) ? '이' : '가'

  return (
    <ScreenLayout
      title={`${elder.callName}${subjectParticle} 잘 만드시던 ${dish}${hasFinalConsonant(dish) ? '이에요' : '예요'}`}
      subtitle="순서를 맞춰볼까요?"
    >
      <div className="activity__cards">
        {steps.map((step) => {
          const order = picked.findIndex((chosen) => chosen.id === step.id)
          const isPicked = order !== -1
          return (
            <button
              type="button"
              key={step.id}
              className={`activity__card${isPicked ? ' activity__card--picked' : ''}`}
              disabled={isPicked}
              onClick={() => handlePick(step)}
            >
              <span
                className={`activity__order${isPicked ? '' : ' activity__order--empty'}`}
                aria-hidden={!isPicked}
              >
                {isPicked ? order + 1 : ''}
              </span>
              <span>{step.text}</span>
            </button>
          )
        })}
      </div>
    </ScreenLayout>
  )
}
