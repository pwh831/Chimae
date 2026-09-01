import { useEffect, useState } from 'react'
import BigButton from '../components/BigButton'
import HoldToTalkButton from '../components/HoldToTalkButton'
import ScreenLayout from '../components/ScreenLayout'
import type { FamilyQuestion } from '../data/types'
import { nameDative, nameSubject } from '../lib/korean'
import './MessageScreen.css'

/** 미리 준비된 답장 문구. 타이핑을 요구하지 않기 위한 길이다. */
const PHRASES = ['고마워', '보고 싶다', '잘 지내니', '사랑한다']

/** 전했다는 안내가 머무는 시간 */
const SENT_MS = 2800

type Phase = 'reading' | 'recording' | 'phrases' | 'sent'

type MessageScreenProps = {
  question: FamilyQuestion
  /** 답장을 전한 뒤 다음 화면으로 넘어갈 때 부른다 */
  onDone: () => void
}

/**
 * 문제를 푼 뒤 손자녀 메시지를 보고 답장하는 화면.
 * 타이핑은 요구하지 않는다. 말로 하거나 준비된 문구를 고른다.
 *
 * 프롬프트 문서는 마이크와 문구 넷을 한 화면에 두라고 했으나 그러면 누를 수 있는
 * 요소가 다섯이 되어 "화면당 최대 네 개"를 넘는다. 방법을 먼저 고르게 나눴다.
 */
export default function MessageScreen({ question, onDone }: MessageScreenProps) {
  const sender = question.from
  const [phase, setPhase] = useState<Phase>('reading')

  useEffect(() => {
    if (phase !== 'sent') return
    const timer = window.setTimeout(onDone, SENT_MS)
    return () => window.clearTimeout(timer)
  }, [phase, onDone])

  if (phase === 'sent') {
    return (
      <ScreenLayout title="답장">
        <div className="message__sent">
          <p className="message__sent-text">
            {sender.name}
            {nameDative(sender.name)} 전했어요
          </p>
        </div>
      </ScreenLayout>
    )
  }

  if (phase === 'phrases') {
    return (
      <ScreenLayout title="어떤 말을 전할까요?">
        <div className="message__phrases">
          {PHRASES.map((phrase, index) => (
            <BigButton
              key={index}
              label={phrase}
              variant="secondary"
              full
              onClick={() => setPhase('sent')}
            />
          ))}
        </div>
      </ScreenLayout>
    )
  }

  if (phase === 'recording') {
    return (
      <ScreenLayout title="누르고 계신 동안 말씀해 주세요">
        <div className="message__mic-area">
          <HoldToTalkButton onFinish={() => setPhase('sent')} />
        </div>
      </ScreenLayout>
    )
  }

  return (
    <ScreenLayout
      title={`${sender.relation} ${sender.name}${nameSubject(sender.name)} 보낸 메시지`}
      footer={
        <>
          <BigButton label="말로 답하기" onClick={() => setPhase('recording')} />
          <BigButton
            label="골라서 답하기"
            variant="secondary"
            onClick={() => setPhase('phrases')}
          />
        </>
      }
    >
      <div className="message__body">
        <div className={`message__from${question.photoUrl ? '' : ' message__from--wide'}`}>
          <img className="message__profile" src={sender.photoUrl} alt="" />
          <p className="message__text">{question.message}</p>
        </div>
        {question.photoUrl ? (
          <img className="message__photo" src={question.photoUrl} alt="" />
        ) : null}
      </div>
    </ScreenLayout>
  )
}
