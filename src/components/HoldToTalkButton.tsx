import { useState } from 'react'
import './HoldToTalkButton.css'

function MicIcon() {
  return (
    <svg viewBox="0 0 96 96" width="112" height="112" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="36" y="12" width="24" height="44" rx="12" />
      <path d="M24 46c0 13.3 10.7 24 24 24s24-10.7 24-24" />
      <path d="M48 70v14" />
    </svg>
  )
}

type HoldToTalkButtonProps = {
  /** 손을 뗐을 때 부른다 */
  onFinish: () => void
}

/**
 * 누르고 있는 동안 말하는 버튼.
 * 10단계 전까지는 실제로 녹음하지 않고 표시만 바꾼다.
 */
export default function HoldToTalkButton({ onFinish }: HoldToTalkButtonProps) {
  const [isHolding, setIsHolding] = useState(false)

  return (
    <div className="hold-to-talk">
      <button
        type="button"
        className={`hold-to-talk__button${isHolding ? ' hold-to-talk__button--held' : ''}`}
        aria-label="누르고 있는 동안 녹음"
        onPointerDown={() => setIsHolding(true)}
        onPointerUp={() => {
          setIsHolding(false)
          onFinish()
        }}
        // 손가락이 버튼 밖으로 미끄러져도 눌린 채로 남지 않게 한다
        onPointerLeave={() => setIsHolding(false)}
        onPointerCancel={() => setIsHolding(false)}
      >
        <MicIcon />
      </button>
      <p className="hold-to-talk__hint">{isHolding ? '녹음 중...' : ''}</p>
    </div>
  )
}
