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

function PhotoIcon() {
  return (
    <svg viewBox="0 0 96 96" width="96" height="96" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="12" y="20" width="72" height="56" rx="8" />
      <circle cx="34" cy="40" r="7" />
      <path d="M16 64l20-18 14 12 12-10 18 16" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 96 96" width="96" height="96" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="34" cy="34" r="14" />
      <circle cx="66" cy="38" r="11" />
      <path d="M12 76c0-13 10-22 22-22s22 9 22 22M60 76c0-11 7-18 16-18" />
    </svg>
  )
}

function CupIcon() {
  return (
    <svg viewBox="0 0 96 96" width="96" height="96" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M26 30h44l-8 46H34z" />
      <rect x="20" y="20" width="56" height="12" rx="6" />
    </svg>
  )
}

function MazeIcon() {
  return (
    <svg viewBox="0 0 96 96" width="96" height="96" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="14" y="14" width="68" height="68" rx="6" />
      <path d="M32 14v34h18V32h18M32 82V64h34" />
    </svg>
  )
}

const ICONS = {
  talk: TalkIcon,
  pot: PotIcon,
  word: WordIcon,
  song: SongIcon,
  photo: PhotoIcon,
  people: PeopleIcon,
  cup: CupIcon,
  maze: MazeIcon,
}

/** 오늘 한 일 하나. 그림과 글자를 함께 보여준다 */
export type ClosingSummaryItem = {
  id: string
  icon: keyof typeof ICONS
  label: string
}

/*
 * 마무리 화면에 보여줄 카드 수의 한계.
 * 오늘 한 일을 전부 늘어놓으면 점검표가 된다. 몇 가지만 짚고 끝낸다.
 * 전체 기록은 가족 화면에서 본다.
 */
const MAX_CARDS = 4

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
          {summary.slice(0, MAX_CARDS).map((item) => {
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
