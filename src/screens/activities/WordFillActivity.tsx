import { useEffect, useState } from 'react'
import BigButton from '../../components/BigButton'
import ScreenLayout from '../../components/ScreenLayout'
import type { Activity, LifeStory } from '../../data/types'
import StoryInvitation from './StoryInvitation'
import './WordFillActivity.css'

const REACTION_MS = 2800

type WordFillActivityType = Extract<Activity, { kind: 'word-fill' }>

type Props = {
  activity: WordFillActivityType
  story: LifeStory
  onSpoken: (text: string) => void
  onDone: () => void
}

/**
 * 문장의 빈칸에 들어갈 낱말을 고르는 활동.
 *
 * 고른 낱말로 문장이 완성되어 그대로 보인다.
 * 어떤 낱말을 골라도 문장이 말이 되도록 데이터를 짜 두었으므로,
 * 화면은 고른 것을 그대로 읽어줄 뿐 맞고 틀림을 가리지 않는다.
 */
export default function WordFillActivity({
  activity,
  story,
  onSpoken,
  onDone,
}: Props) {
  const [chosen, setChosen] = useState<string | null>(null)
  const [askStory, setAskStory] = useState(false)

  const { before, after, choices } = activity.data

  useEffect(() => {
    if (chosen === null) return
    const timer = window.setTimeout(() => setAskStory(true), REACTION_MS)
    return () => window.clearTimeout(timer)
  }, [chosen])

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

  const sentence = (
    <p className="word-fill__sentence">
      <span>{before}</span>
      <span className={`word-fill__blank${chosen ? '' : ' word-fill__blank--empty'}`}>
        {chosen ?? ' '}
      </span>
      <span>{after}</span>
    </p>
  )

  // 고르고 난 뒤에는 완성된 문장만 크게 보여준다
  if (chosen !== null) {
    return (
      <ScreenLayout title={`${story.title} 이야기`}>
        <div className="activity__centered">{sentence}</div>
      </ScreenLayout>
    )
  }

  return (
    <ScreenLayout
      title={`${story.title} 이야기예요`}
      subtitle="빈칸에 들어갈 말을 골라볼까요?"
    >
      <div className="word-fill__body">
        {sentence}
        <div className="word-fill__choices">
          {choices.map((choice, index) => (
            <BigButton
              // 선택지는 순서가 바뀌지 않으므로 자리로 구분한다
              key={index}
              label={choice}
              variant="secondary"
              onClick={() => setChosen(choice)}
            />
          ))}
        </div>
      </div>
    </ScreenLayout>
  )
}
