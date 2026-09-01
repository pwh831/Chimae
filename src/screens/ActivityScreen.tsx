import { useEffect, useState } from 'react'
import HoldToTalkButton from '../components/HoldToTalkButton'
import ScreenLayout from '../components/ScreenLayout'
import type { Activity, Elder, LifeStory, RecipeStep } from '../data/types'
import { copula, subjectMarker } from '../lib/korean'
import './ActivityScreen.css'

/** 반응 문구가 머무는 시간 */
const REACTION_MS = 2800

/**
 * 어떤 순서로 놓든 건네는 말은 하나다.
 * 순서에 따라 말을 다르게 하면 그것이 곧 채점이 된다.
 */
const REACTION_WORDS = '이렇게 만드는 분도 계시죠'

/** 이야기를 들은 뒤 건네는 말 */
const THANKS_WORDS = '이야기 잘 들었어요'

type RecipeOrderActivity = Extract<Activity, { kind: 'recipe-order' }>

type Phase = 'ordering' | 'reaction' | 'talking' | 'thanks'

type ActivityScreenProps = {
  elder: Elder
  activity: RecipeOrderActivity
  story: LifeStory
  /** 이야기를 청하는 문장. 예: "김치찌개에 얽힌 이야기가 있으신가요?" */
  invitation: string
  /** 어르신이 말을 마쳤을 때 부른다. 실제 말한 내용은 10단계에서 채워진다 */
  onSpoken: (text: string) => void
  onDone: () => void
}

/**
 * 회상 활동 화면. 조리 순서를 탭으로 배열한 뒤,
 * 그 음식에 얽힌 이야기를 청한다.
 *
 * 순서가 맞았는지 따지지 않는다. 고른 순서를 그대로 보여줄 뿐,
 * 어느 자리가 어떠했는지 표시하지 않는다.
 */
export default function ActivityScreen({
  elder,
  activity,
  story,
  invitation,
  onSpoken,
  onDone,
}: ActivityScreenProps) {
  const [phase, setPhase] = useState<Phase>('ordering')
  const [picked, setPicked] = useState<RecipeStep[]>([])

  const steps = activity.data.steps

  useEffect(() => {
    if (phase !== 'reaction') return
    const timer = window.setTimeout(() => setPhase('talking'), REACTION_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'thanks') return
    const timer = window.setTimeout(onDone, REACTION_MS)
    return () => window.clearTimeout(timer)
  }, [phase, onDone])

  function handlePick(step: RecipeStep) {
    const next = [...picked, step]
    setPicked(next)
    if (next.length === steps.length) setPhase('reaction')
  }

  function handleSpoken() {
    // 실제 말한 내용은 10단계에서 채워진다
    onSpoken('')
    setPhase('thanks')
  }

  if (phase === 'thanks') {
    return (
      <ScreenLayout title={`${story.title} 이야기`}>
        <div className="activity__centered">
          <p className="activity__reaction-text">{THANKS_WORDS}</p>
        </div>
      </ScreenLayout>
    )
  }

  if (phase === 'talking') {
    return (
      <ScreenLayout title={invitation}>
        <div className="activity__centered">
          <HoldToTalkButton onFinish={handleSpoken} />
        </div>
      </ScreenLayout>
    )
  }

  if (phase === 'reaction') {
    return (
      <ScreenLayout title={`${story.title} 이야기`}>
        <div className="activity__centered">
          <p className="activity__reaction-text">{REACTION_WORDS}</p>
        </div>
      </ScreenLayout>
    )
  }

  const dish = activity.data.dishName

  return (
    <ScreenLayout
      title={`${elder.callName}${subjectMarker(elder.callName)} 잘 만드시던 ${dish}${copula(dish)}`}
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
