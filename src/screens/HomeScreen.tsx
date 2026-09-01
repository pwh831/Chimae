import BigButton from '../components/BigButton'
import ScreenLayout from '../components/ScreenLayout'
import { elder, familyQuestions } from '../data/sampleData'
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

/** 이름 뒤에 붙는 조사를 고른다. 받침이 있으면 "이가", 없으면 "가" */
function subjectParticle(name: string): string {
  const lastChar = name.at(-1)
  if (!lastChar) return '가'
  const code = lastChar.charCodeAt(0)
  // 한글 음절이 아니면 판단하지 않고 "가"로 둔다
  if (code < 0xac00 || code > 0xd7a3) return '가'
  const hasFinalConsonant = (code - 0xac00) % 28 !== 0
  return hasFinalConsonant ? '이가' : '가'
}

/**
 * 어르신용 홈 화면. 앱을 켜면 처음 보이는 화면이다.
 * 누를 수 있는 것은 가운데 카드와 아래 버튼 둘뿐이다.
 */
export default function HomeScreen() {
  // 아직 읽지 않은 문제가 있으면 그것부터 안내한다
  const newQuestion = familyQuestions.find((question) => !question.isRead)

  return (
    <ScreenLayout
      title={`${elder.callName}, 안녕하세요`}
      subtitle={formatToday(new Date())}
      footer={
        <BigButton
          label="지난 이야기 보기"
          variant="secondary"
          onClick={() => console.log('지난 이야기 보기')}
        />
      }
    >
      <button
        type="button"
        className="home-card"
        onClick={() => console.log('카드 누름', newQuestion?.id ?? '오늘의 이야기')}
      >
        {newQuestion ? (
          <>
            <img
              className="home-card__photo"
              src={newQuestion.from.photoUrl}
              alt=""
            />
            <span className="home-card__text">
              {newQuestion.from.relation} {newQuestion.from.name}
              {subjectParticle(newQuestion.from.name)}
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
