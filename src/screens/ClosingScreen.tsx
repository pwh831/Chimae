import ScreenLayout from '../components/ScreenLayout'
import './ClosingScreen.css'

function TalkIcon() {
  return (
    <svg viewBox="0 0 96 96" width="96" height="96" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M84 56c0 6.6-5.4 12-12 12H40L20 84V28c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12z" />
      <path d="M36 38h32M36 52h20" />
    </svg>
  )
}

function PotIcon() {
  return (
    <svg viewBox="0 0 96 96" width="96" height="96" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 40h60v22a16 16 0 0 1-16 16H34a16 16 0 0 1-16-16z" />
      <path d="M10 40h76" />
      <path d="M36 26c0-5 6-5 6-10M52 26c0-5 6-5 6-10" />
    </svg>
  )
}

function WordIcon() {
  return (
    <svg viewBox="0 0 96 96" width="96" height="96" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="12" y="24" width="72" height="48" rx="8" />
      <path d="M28 44h12M56 44h12M28 58h40" />
    </svg>
  )
}

function SongIcon() {
  return (
    <svg viewBox="0 0 96 96" width="96" height="96" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M40 68V22l32-8v46" />
      <circle cx="30" cy="70" r="10" />
      <circle cx="62" cy="60" r="10" />
    </svg>
  )
}

const ICONS = {
  talk: TalkIcon,
  pot: PotIcon,
  word: WordIcon,
  song: SongIcon,
}

/** 오늘 한 일 하나. 그림과 글자를 함께 보여준다 */
export type ClosingSummaryItem = {
  id: string
  icon: keyof typeof ICONS
  label: string
}

type ClosingScreenProps = {
  summary: ClosingSummaryItem[]
}

/**
 * 오늘 활동을 마치는 화면.
 * 다시 하도록 이끄는 버튼이나 문구를 두지 않는다.
 */
export default function ClosingScreen({ summary }: ClosingScreenProps) {
  return (
    <ScreenLayout
      title="오늘도 좋은 이야기 들려주셔서 고마워요"
      footer={<p className="closing__farewell">내일 또 이야기해요</p>}
    >
      <div className="closing__body">
        <div className="closing__summary">
          {summary.map((item) => {
            const Icon = ICONS[item.icon]
            return (
              <div className="closing__card" key={item.id}>
                <span className="closing__card-icon">
                  <Icon />
                </span>
                <span className="closing__card-label">{item.label}</span>
              </div>
            )
          })}
        </div>

        <p className="closing__shared">가족에게 오늘 이야기를 전했어요</p>
      </div>
    </ScreenLayout>
  )
}
