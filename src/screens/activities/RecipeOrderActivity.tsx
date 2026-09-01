import { useEffect, useState } from 'react'
import ScreenLayout from '../../components/ScreenLayout'
import type { Activity, Elder, LifeStory, RecipeStep } from '../../data/types'
import { copula, subjectMarker } from '../../lib/korean'
import StoryInvitation from './StoryInvitation'
import './RecipeOrderActivity.css'

const REACTION_MS = 2800

/**
 * 어떤 순서로 놓든 건네는 말은 하나다.
 * 순서에 따라 말을 다르게 하면 그것이 곧 채점이 된다.
 */
const REACTION_WORDS = '이렇게 만드는 분도 계시죠'

type RecipeOrderActivityType = Extract<Activity, { kind: 'recipe-order' }>

type Props = {
  elder: Elder
  activity: RecipeOrderActivityType
  story: LifeStory
  onSpoken: (text: string) => void
  onDone: () => void
}

/**
 * 조리 순서를 탭으로 배열하는 활동.
 *
 * 순서가 맞았는지 따지지 않는다. 고른 순서를 그대로 보여줄 뿐,
 * 어느 자리가 어떠했는지 표시하지 않는다.
 */
export default function RecipeOrderActivity({
  elder,
  activity,
  story,
  onSpoken,
  onDone,
}: Props) {
  const [picked, setPicked] = useState<RecipeStep[]>([])
  const [showReaction, setShowReaction] = useState(false)
  const [askStory, setAskStory] = useState(false)

  const steps = activity.data.steps

  useEffect(() => {
    if (!showReaction) return
    const timer = window.setTimeout(() => setAskStory(true), REACTION_MS)
    return () => window.clearTimeout(timer)
  }, [showReaction])

  if (askStory) {
    return (
      <StoryInvitation
        title={activity.data.invitation}
        thanksTitle={`${story.title} 이야기`}
        onSpoken={onSpoken}
        onDone={onDone}
      />
    )
  }

  if (showReaction) {
    return (
      <ScreenLayout title={`${story.title} 이야기`}>
        <div className="activity__centered">
          <p className="activity__reaction-text">{REACTION_WORDS}</p>
        </div>
      </ScreenLayout>
    )
  }

  function handlePick(step: RecipeStep) {
    const next = [...picked, step]
    setPicked(next)
    if (next.length === steps.length) setShowReaction(true)
  }

  const dish = activity.data.dishName

  return (
    <ScreenLayout
      title={`${elder.callName}${subjectMarker(elder.callName)} 잘 만드시던 ${dish}${copula(dish)}`}
      subtitle="순서를 맞춰볼까요?"
    >
      <div className="recipe__cards">
        {steps.map((step) => {
          const order = picked.findIndex((chosen) => chosen.id === step.id)
          const isPicked = order !== -1
          return (
            <button
              type="button"
              key={step.id}
              className={`recipe__card${isPicked ? ' recipe__card--picked' : ''}`}
              disabled={isPicked}
              onClick={() => handlePick(step)}
            >
              <span
                className={`recipe__order${isPicked ? '' : ' recipe__order--empty'}`}
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
