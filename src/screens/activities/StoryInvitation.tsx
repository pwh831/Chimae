import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import HoldToTalkButton from '../../components/HoldToTalkButton'
import ScreenLayout from '../../components/ScreenLayout'

/** 인사가 머무는 시간 */
const THANKS_MS = 2800

type StoryInvitationProps = {
  title: string
  subtitle?: string
  /** 마이크 위에 함께 보여줄 것. 노래 첫 소절 같은 것 */
  lead?: ReactNode
  /** 말씀을 마친 뒤 보여줄 화면의 제목 */
  thanksTitle: string
  thanksWords?: string
  /** 실제 말한 내용은 10단계에서 채워진다 */
  onSpoken: (text: string) => void
  onDone: () => void
}

/**
 * 활동 끝에 이야기를 청하는 부분.
 * 활동 종류가 달라도 이 마무리는 같다.
 */
export default function StoryInvitation({
  title,
  subtitle,
  lead,
  thanksTitle,
  thanksWords = '이야기 잘 들었어요',
  onSpoken,
  onDone,
}: StoryInvitationProps) {
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    if (!isDone) return
    const timer = window.setTimeout(onDone, THANKS_MS)
    return () => window.clearTimeout(timer)
  }, [isDone, onDone])

  if (isDone) {
    return (
      <ScreenLayout title={thanksTitle}>
        <div className="activity__centered">
          <p className="activity__reaction-text">{thanksWords}</p>
        </div>
      </ScreenLayout>
    )
  }

  return (
    <ScreenLayout title={title} subtitle={subtitle}>
      <div className="activity__centered">
        {lead}
        <HoldToTalkButton
          onFinish={() => {
            onSpoken('')
            setIsDone(true)
          }}
        />
      </div>
    </ScreenLayout>
  )
}
