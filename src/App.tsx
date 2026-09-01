import BigButton from './components/BigButton'
import ScreenLayout from './components/ScreenLayout'
import './App.css'

/* 글자와 함께 뜻을 전하는 보조 그림. 색만으로 구분하지 않기 위한 것이다. */
function TalkIcon() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M42 28c0 3.3-2.7 6-6 6H20l-10 8V14c0-3.3 2.7-6 6-6h20c3.3 0 6 2.7 6 6z" />
    </svg>
  )
}

function AlbumIcon() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="10" width="34" height="28" rx="4" />
      <path d="M7 31l9-8 7 6 6-5 12 10" />
    </svg>
  )
}

/**
 * 0단계 확인용 페이지.
 * 공통 컴포넌트가 태블릿 가로 화면(1280x800)에서 어떻게 보이는지만 확인한다.
 */
export default function App() {
  return (
    <ScreenLayout
      title="순자님, 안녕하세요"
      subtitle="오늘도 이야기 나눠요"
      footer={
        <>
          <BigButton
            label="돌아가기"
            variant="secondary"
            onClick={() => console.log('돌아가기')}
          />
          <BigButton label="다음" onClick={() => console.log('다음')} />
        </>
      }
    >
      <p className="preview__note">
        공통 컴포넌트 확인용 화면입니다. 글자와 버튼이 충분히 큰지 살펴봐 주세요.
      </p>

      <div className="preview__buttons">
        <BigButton
          label="오늘의 이야기 시작하기"
          icon={<TalkIcon />}
          full
          onClick={() => console.log('이야기 시작')}
        />
        <BigButton
          label="지난 이야기 보기"
          icon={<AlbumIcon />}
          variant="secondary"
          full
          onClick={() => console.log('지난 이야기')}
        />
      </div>
    </ScreenLayout>
  )
}
