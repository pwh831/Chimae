import { useEffect, useState } from 'react'
import BigButton from '../components/BigButton'
import ScreenLayout from '../components/ScreenLayout'
import { familyQuestions } from '../data/sampleData'
import './QuestionScreen.css'

/** 반응 문구가 머무는 시간. 읽고 넘어가기에 충분하되 지루하지 않게 */
const REACTION_MS = 2800

type Phase = 'asking' | 'reacting' | 'message'

/**
 * 손자녀가 낸 문제를 푸는 화면.
 *
 * 고른 답을 채점하지 않는다. 어떤 선택지를 눌러도 같은 방식으로,
 * 같은 시간 동안 따뜻한 말을 건네고 다음으로 넘어간다.
 * 고르고 난 뒤 어떤 선택지가 어떠했는지는 화면에 남기지 않는다.
 */
export default function QuestionScreen() {
  const question = familyQuestions.find((item) => !item.isRead) ?? familyQuestions[0]

  const [phase, setPhase] = useState<Phase>('asking')
  const [chosenIndex, setChosenIndex] = useState<number | null>(null)

  useEffect(() => {
    if (phase !== 'reacting') return
    const timer = window.setTimeout(() => setPhase('message'), REACTION_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  function handleChoose(index: number) {
    setChosenIndex(index)
    setPhase('reacting')
  }

  if (phase === 'message') {
    return (
      <ScreenLayout title="메시지">
        <div className="question__placeholder">
          <p className="question__placeholder-text">메시지 화면 예정</p>
        </div>
      </ScreenLayout>
    )
  }

  if (phase === 'reacting') {
    /*
     * 보낸 사람이 마음에 두었던 선택지인지에 따라 건네는 말만 달라진다.
     * 맞고 틀림을 알리는 것이 아니라 이야기를 이어가기 위한 맞장구다.
     */
    const matchesSender = chosenIndex === question.senderChoiceIndex
    const words = matchesSender ? '맞아요!' : '그럴 수도 있겠네요'

    return (
      <ScreenLayout title={question.text}>
        <div className="question__reaction">
          <p className="question__reaction-text">{words}</p>
        </div>
      </ScreenLayout>
    )
  }

  return (
    <ScreenLayout title={question.text}>
      <div className="question__choices">
        {question.choices.map((choice, index) => (
          <BigButton
            // 선택지는 순서가 바뀌지 않으므로 자리로 구분한다 (같은 문구가 와도 안전)
            key={index}
            label={choice}
            variant="secondary"
            full
            onClick={() => handleChoose(index)}
          />
        ))}
      </div>
    </ScreenLayout>
  )
}
