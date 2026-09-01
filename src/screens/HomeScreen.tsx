import BigButton from '../components/BigButton'
import ScreenLayout from '../components/ScreenLayout'
import type { Elder, FamilyQuestion } from '../data/types'
import { nameSubject } from '../lib/korean'
import './HomeScreen.css'

/** 오늘 날짜를 "2026년 9월 1일 화요일"처럼 적는다 */
function formatToday(today: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(today)
}

type HomeScreenProps = {
  elder: Elder
  /** 아직 읽지 않은 문제. 없으면 오늘의 이야기부터 시작한다 */
  newQuestion?: FamilyQuestion
  onStart: () => void
  onOpenPastStories: () => void
}

/**
 * 어르신용 홈 화면. 앱을 켜면 처음 보이는 화면이다.
 * 누를 수 있는 것은 가운데 카드와 아래 버튼 둘뿐이다.
 */
export default function HomeScreen({
  elder,
  newQuestion,
  onStart,
  onOpenPastStories,
}: HomeScreenProps) {
  return (
    <ScreenLayout
      title={`${elder.callName}, 안녕하세요`}
      subtitle={formatToday(new Date())}
      footer={
        <BigButton
          label="지난 이야기 보기"
          variant="secondary"
          onClick={onOpenPastStories}
        />
      }
    >
      <button type="button" className="home-card" onClick={onStart}>
        {newQuestion ? (
          <>
            <img
              className="home-card__photo"
              src={newQuestion.from.photoUrl}
              alt=""
            />
            <span className="home-card__text">
              {newQuestion.from.relation} {newQuestion.from.name}
              {nameSubject(newQuestion.from.name)}
              <br />
              문제를 보냈어요
            </span>
          </>
        ) : (
          <span className="home-card__text home-card__text--alone">
            오늘의 이야기를 시작해요
          </span>
        )}
      </button>
    </ScreenLayout>
  )
}
