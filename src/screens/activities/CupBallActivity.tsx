import { useEffect, useState } from 'react'
import ScreenLayout from '../../components/ScreenLayout'
import type { Activity } from '../../data/types'
import './CupBallActivity.css'

const FOUND_MS = 2800

type CupBallActivityType = Extract<Activity, { kind: 'cup-ball' }>

type Props = {
  activity: CupBallActivityType
  onDone: () => void
}

/** 컵 하나. 열리면 안에 든 것이 보인다 */
function Cup({ hasBall, isOpen }: { hasBall: boolean; isOpen: boolean }) {
  return (
    <svg viewBox="0 0 160 200" width="160" height="200" aria-hidden="true">
      {hasBall && isOpen ? (
        <circle cx="80" cy="150" r="30" fill="none" stroke="currentColor" strokeWidth="8" />
      ) : null}
      <g className="cup-ball__lid" fill="var(--color-bg)" stroke="currentColor" strokeWidth="8" strokeLinejoin="round">
        <path d="M36 60h88l-14 116H50z" />
        <rect x="28" y="46" width="104" height="18" rx="9" />
      </g>
    </svg>
  )
}

/**
 * 컵 속 공 찾기.
 * 개인 소재와 무관한 보조 활동이라 끝에 이야기를 청하지 않는다.
 */
export default function CupBallActivity({ activity, onDone }: Props) {
  const { cupCount, ballIndex } = activity.data
  const [opened, setOpened] = useState<number[]>([])

  const found = opened.includes(ballIndex)

  useEffect(() => {
    if (!found) return
    const timer = window.setTimeout(onDone, FOUND_MS)
    return () => window.clearTimeout(timer)
  }, [found, onDone])

  const cups = Array.from({ length: cupCount }, (_, index) => index)

  return (
    <ScreenLayout
      title="공은 어느 컵에 있을까요?"
      subtitle={found ? '여기 있었네요' : '컵을 눌러 열어보세요'}
    >
      <div className="activity__centered">
        <div className="cup-ball__row">
          {cups.map((index) => {
            const isOpen = opened.includes(index)
            return (
              <button
                type="button"
                key={index}
                className={`cup-ball__cup${isOpen ? ' cup-ball__cup--opened' : ''}`}
                disabled={isOpen}
                aria-label={`${index + 1}번 컵 열기`}
                onClick={() => setOpened((prev) => [...prev, index])}
              >
                <Cup hasBall={index === ballIndex} isOpen={isOpen} />
              </button>
            )
          })}
        </div>
      </div>
    </ScreenLayout>
  )
}
