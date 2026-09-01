import ScreenLayout from '../components/ScreenLayout'
import { activities } from '../data/sampleData'
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

/**
 * 오늘 활동을 마치는 화면.
 * 다시 하도록 이끄는 버튼이나 문구를 두지 않는다.
 */
export default function ClosingScreen() {
  const recipe = activities.find((item) => item.kind === 'recipe-order')
  const dish = recipe?.kind === 'recipe-order' ? recipe.data.dishName : null

  return (
    <ScreenLayout
      title="오늘도 좋은 이야기 들려주셔서 고마워요"
      footer={<p className="closing__farewell">내일 또 이야기해요</p>}
    >
      <div className="closing__body">
        <div className="closing__summary">
          <div className="closing__card">
            <span className="closing__card-icon">
              <TalkIcon />
            </span>
            <span className="closing__card-label">문제 풀기</span>
          </div>
          {dish ? (
            <div className="closing__card">
              <span className="closing__card-icon">
                <PotIcon />
              </span>
              <span className="closing__card-label">{dish} 이야기</span>
            </div>
          ) : null}
        </div>

        <p className="closing__shared">가족에게 오늘 이야기를 전했어요</p>
      </div>
    </ScreenLayout>
  )
}
