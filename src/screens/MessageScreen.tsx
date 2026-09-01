import { useState } from 'react'
import BigButton from '../components/BigButton'
import ScreenLayout from '../components/ScreenLayout'
import { familyQuestions } from '../data/sampleData'
import './MessageScreen.css'

/** 미리 준비된 답장 문구. 타이핑을 요구하지 않기 위한 길이다. */
const PHRASES = ['고마워', '보고 싶다', '잘 지내니', '사랑한다']

type Phase = 'reading' | 'recording' | 'phrases' | 'sent'

/**
 * 이름 끝 글자에 받침이 있는지 본다. 뒤에 붙는 조사가 이것으로 갈린다.
 * 홈 화면에도 같은 판별이 있다. 7단계에서 전체를 이을 때 한곳으로 모으는 것이 좋겠다.
 */
function hasFinalConsonant(name: string): boolean {
  const lastChar = name.at(-1)
  if (!lastChar) return false
  const code = lastChar.charCodeAt(0)
  // 한글 음절이 아니면 판단하지 않는다
  if (code < 0xac00 || code > 0xd7a3) return false
  return (code - 0xac00) % 28 !== 0
}

/** 지민 → "지민이에게", 준호 → "준호에게" */
function toParticle(name: string): string {
  return hasFinalConsonant(name) ? '이에게' : '에게'
}

/** 지민 → "지민이가", 준호 → "준호가" */
function subjectParticle(name: string): string {
  return hasFinalConsonant(name) ? '이가' : '가'
}

function MicIcon() {
  return (
    <svg viewBox="0 0 96 96" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="36" y="12" width="24" height="44" rx="12" />
      <path d="M24 46c0 13.3 10.7 24 24 24s24-10.7 24-24" />
      <path d="M48 70v14" />
    </svg>
  )
}

/**
 * 문제를 푼 뒤 손자녀 메시지를 보고 답장하는 화면.
 * 타이핑은 요구하지 않는다. 말로 하거나 준비된 문구를 고른다.
 */
export default function MessageScreen() {
  const question = familyQuestions.find((item) => !item.isRead) ?? familyQuestions[0]
  const sender = question.from

  const [phase, setPhase] = useState<Phase>('reading')
  const [isHolding, setIsHolding] = useState(false)

  if (phase === 'sent') {
    return (
      <ScreenLayout title="답장">
        <div className="message__sent">
          <p className="message__sent-text">
            {sender.name}
            {toParticle(sender.name)} 전했어요
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
    /*
     * 10단계 전까지는 실제로 녹음하지 않는다.
     * 누르고 있는 동안 표시만 바꾸고, 손을 떼면 전한 것으로 넘어간다.
     */
    return (
      <ScreenLayout title="누르고 계신 동안 말씀해 주세요">
        <div className="message__mic-area">
          <button
            type="button"
            className={`message__mic${isHolding ? ' message__mic--held' : ''}`}
            aria-label="누르고 있는 동안 녹음"
            onPointerDown={() => setIsHolding(true)}
            onPointerUp={() => {
              setIsHolding(false)
              setPhase('sent')
            }}
            // 손가락이 버튼 밖으로 미끄러져도 멈춘 채로 남지 않게 한다
            onPointerLeave={() => setIsHolding(false)}
            onPointerCancel={() => setIsHolding(false)}
          >
            <MicIcon />
          </button>
          <p className="message__mic-hint">{isHolding ? '녹음 중...' : ''}</p>
        </div>
      </ScreenLayout>
    )
  }

  return (
    <ScreenLayout
      title={`${sender.relation} ${sender.name}${subjectParticle(sender.name)} 보낸 메시지`}
      footer={
        <>
          <BigButton
            label="말로 답하기"
            onClick={() => setPhase('recording')}
          />
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
