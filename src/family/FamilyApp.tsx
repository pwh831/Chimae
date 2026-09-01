import { useState } from 'react'
import type {
  Elder,
  FacilityGoal,
  FamilyMember,
  FamilyQuestion,
  LifeStory,
  LifeStoryCategory,
  SessionLog,
} from '../data/types'
import './FamilyApp.css'

const CATEGORY_LABELS: Record<LifeStoryCategory, string> = {
  food: '음식',
  place: '장소',
  song: '노래',
  object: '물건',
  person: '사람',
}

type Tab = 'stories' | 'question' | 'today' | 'facility'

const TABS: { id: Tab; label: string }[] = [
  { id: 'stories', label: '소재' },
  { id: 'question', label: '문제 내기' },
  { id: 'today', label: '오늘 이야기' },
  { id: 'facility', label: '우리 요양원' },
]

type FamilyAppProps = {
  elder: Elder
  me: FamilyMember
  stories: LifeStory[]
  questions: FamilyQuestion[]
  log: SessionLog
  goal: FacilityGoal
  onAddStory: (story: LifeStory) => void
  onAddQuestion: (question: FamilyQuestion) => void
  onLeave: () => void
}

/**
 * 가족·요양보호사가 쓰는 화면.
 * 어르신용 화면과 완전히 분리되어 있고, 일반적인 모바일 앱 모양을 따른다.
 */
export default function FamilyApp({
  elder,
  me,
  stories,
  questions,
  log,
  goal,
  onAddStory,
  onAddQuestion,
  onLeave,
}: FamilyAppProps) {
  const [tab, setTab] = useState<Tab>('stories')

  return (
    <div className="family">
      <header className="family__header">
        <div>
          <div className="family__title">{elder.name} 님</div>
          <div className="family__hint" style={{ margin: 0 }}>
            {me.relation} {me.name}
          </div>
        </div>
        <button type="button" className="family__leave" onClick={onLeave}>
          어르신 화면으로
        </button>
      </header>

      <div className="family__body">
        {tab === 'stories' ? (
          <StoriesTab stories={stories} onAddStory={onAddStory} />
        ) : null}
        {tab === 'question' ? (
          <QuestionTab me={me} questions={questions} onAddQuestion={onAddQuestion} />
        ) : null}
        {tab === 'today' ? <TodayTab log={log} stories={stories} /> : null}
        {tab === 'facility' ? <FacilityTab goal={goal} /> : null}
      </div>

      <nav className="family__tabs">
        {TABS.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`family__tab${tab === item.id ? ' family__tab--active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

/**
 * 소재 입력.
 * 한 번에 하나씩 묻는다. 긴 폼을 한 화면에 펼치면 며칠 만에 그만두게 된다.
 */
function StoriesTab({
  stories,
  onAddStory,
}: {
  stories: LifeStory[]
  onAddStory: (story: LifeStory) => void
}) {
  const [step, setStep] = useState(0)
  const [category, setCategory] = useState<LifeStoryCategory | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSensitive, setIsSensitive] = useState(false)

  function reset() {
    setStep(0)
    setCategory(null)
    setTitle('')
    setDescription('')
    setIsSensitive(false)
  }

  function save() {
    if (!category || !title.trim()) return
    onAddStory({
      id: `story-${Date.now()}`,
      category,
      title: title.trim(),
      description: description.trim(),
      isSensitive,
    })
    reset()
  }

  return (
    <>
      <p className="family__section-title">소재 하나 더하기</p>
      <p className="family__hint">
        30초면 됩니다. 짧게 적어 주셔도 활동으로 만들어 드려요.
      </p>

      <p className="family__steps">{step + 1} / 3</p>

      {step === 0 ? (
        <div className="family__field">
          <span className="family__label">어떤 이야기인가요?</span>
          <div className="family__choice-row">
            {(Object.keys(CATEGORY_LABELS) as LifeStoryCategory[]).map((key) => (
              <button
                type="button"
                key={key}
                className={`family__choice${category === key ? ' family__choice--on' : ''}`}
                onClick={() => {
                  setCategory(key)
                  setStep(1)
                }}
              >
                {CATEGORY_LABELS[key]}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <>
          <label className="family__field">
            <span className="family__label">한마디로 하면?</span>
            <input
              className="family__input"
              value={title}
              placeholder="예: 김치찌개"
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="family__submit"
            disabled={!title.trim()}
            onClick={() => setStep(2)}
          >
            다음
          </button>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <label className="family__field">
            <span className="family__label">기억나는 대로 한두 줄</span>
            <textarea
              className="family__textarea"
              value={description}
              placeholder="예: 명절이면 온 식구가 둘러앉아 먹던 음식"
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>
          <label className="family__field family__check">
            <input
              type="checkbox"
              checked={isSensitive}
              onChange={(event) => setIsSensitive(event.target.checked)}
            />
            민감한 주제일 수 있음
          </label>
          <p className="family__hint">
            표시해 두시면 활동을 만들 때 뒤로 미룹니다. 빼지는 않아요.
          </p>
          <button type="button" className="family__submit" onClick={save}>
            등록하기
          </button>
        </>
      ) : null}

      <p className="family__section-title" style={{ marginTop: 28 }}>
        등록된 소재 {stories.length}개
      </p>
      <p className="family__hint">여기서 회상 활동이 만들어집니다.</p>
      {stories.map((story) => (
        <div className="family__card" key={story.id}>
          <div className="family__card-top">
            <span className="family__chip">{CATEGORY_LABELS[story.category]}</span>
            {story.isSensitive ? (
              <span className="family__chip family__chip--sensitive">민감 주제</span>
            ) : null}
          </div>
          <div className="family__card-title">{story.title}</div>
          {story.description ? (
            <div className="family__card-desc">{story.description}</div>
          ) : null}
        </div>
      ))}
    </>
  )
}

/** 손자녀가 문제를 내어 보낸다 */
function QuestionTab({
  me,
  questions,
  onAddQuestion,
}: {
  me: FamilyMember
  questions: FamilyQuestion[]
  onAddQuestion: (question: FamilyQuestion) => void
}) {
  const [text, setText] = useState('')
  const [choices, setChoices] = useState(['', '', ''])
  const [senderChoiceIndex, setSenderChoiceIndex] = useState<0 | 1 | 2>(0)
  const [message, setMessage] = useState('')

  const ready = text.trim() !== '' && choices.every((item) => item.trim() !== '')

  function send() {
    if (!ready) return
    onAddQuestion({
      id: `question-${Date.now()}`,
      from: me,
      text: text.trim(),
      choices: [choices[0].trim(), choices[1].trim(), choices[2].trim()],
      senderChoiceIndex,
      message: message.trim(),
      sentAt: new Date().toISOString().slice(0, 10),
      isRead: false,
    })
    setText('')
    setChoices(['', '', ''])
    setSenderChoiceIndex(0)
    setMessage('')
  }

  return (
    <>
      <p className="family__section-title">문제 보내기</p>
      <p className="family__hint">
        어르신 화면에는 맞고 틀림이 보이지 않습니다. 어떤 답을 고르셔도 따뜻하게 넘어가요.
      </p>

      <label className="family__field">
        <span className="family__label">무엇을 여쭤볼까요?</span>
        <input
          className="family__input"
          value={text}
          placeholder="예: 할머니가 제일 잘 만드시던 음식은?"
          onChange={(event) => setText(event.target.value)}
        />
      </label>

      <span className="family__label">고르실 수 있는 답 세 가지</span>
      {choices.map((choice, index) => (
        <label className="family__field" key={index}>
          <input
            className="family__input"
            value={choice}
            placeholder={`답 ${index + 1}`}
            onChange={(event) => {
              const next = [...choices]
              next[index] = event.target.value
              setChoices(next)
            }}
          />
        </label>
      ))}

      <div className="family__field">
        <span className="family__label">마음에 두신 답</span>
        <div className="family__choice-row">
          {[0, 1, 2].map((index) => (
            <button
              type="button"
              key={index}
              className={`family__choice${senderChoiceIndex === index ? ' family__choice--on' : ''}`}
              onClick={() => setSenderChoiceIndex(index as 0 | 1 | 2)}
            >
              답 {index + 1}
            </button>
          ))}
        </div>
        <p className="family__hint" style={{ marginTop: 8 }}>
          채점에 쓰지 않습니다. 어르신이 그 답을 고르셨을 때 건넬 말만 달라져요.
        </p>
      </div>

      <label className="family__field">
        <span className="family__label">함께 보낼 말</span>
        <textarea
          className="family__textarea"
          value={message}
          placeholder="예: 할머니, 오늘 학교에서 김치찌개가 나왔어요."
          onChange={(event) => setMessage(event.target.value)}
        />
      </label>

      <button type="button" className="family__submit" disabled={!ready} onClick={send}>
        보내기
      </button>

      <p className="family__section-title" style={{ marginTop: 28 }}>
        보낸 문제 {questions.length}개
      </p>
      {questions.map((question) => (
        <div className="family__card" key={question.id}>
          <div className="family__card-top">
            <span className="family__chip">{question.sentAt}</span>
            <span className="family__chip">
              {question.isRead ? '보셨어요' : '아직 안 보심'}
            </span>
          </div>
          <div className="family__card-title">{question.text}</div>
          <div className="family__card-desc">{question.choices.join(' · ')}</div>
        </div>
      ))}
    </>
  )
}

/**
 * 오늘 활동 요약.
 * 얼마나 잘하셨는지가 아니라, 어떤 이야기에서 반응이 좋았는지를 전한다.
 */
function TodayTab({ log, stories }: { log: SessionLog; stories: LifeStory[] }) {
  const warm = log.wellReceivedLifeStoryIds
    .map((id) => stories.find((story) => story.id === id))
    .filter((story): story is LifeStory => story !== undefined)

  const uniqueWarm = warm.filter(
    (story, index) => warm.findIndex((item) => item.id === story.id) === index,
  )

  return (
    <>
      <p className="family__section-title">오늘 어떤 이야기를 하셨나요</p>
      <p className="family__hint">{log.date}</p>

      {log.activityIds.length === 0 ? (
        <div className="family__card">
          <div className="family__card-desc">아직 오늘 활동이 없어요.</div>
        </div>
      ) : (
        <div className="family__card">
          <div className="family__card-title">함께한 활동 {log.activityIds.length}가지</div>
          <div className="family__card-desc">
            말씀을 들려주신 활동 {log.spokenNotes.length}가지
          </div>
        </div>
      )}

      <p className="family__section-title" style={{ marginTop: 24 }}>
        이야기가 잘 이어진 소재
      </p>
      <p className="family__hint">다음에 만나실 때 이 이야기부터 꺼내보세요.</p>
      {uniqueWarm.length === 0 ? (
        <div className="family__card">
          <div className="family__card-desc">아직 없어요.</div>
        </div>
      ) : (
        uniqueWarm.map((story) => (
          <div className="family__card" key={story.id}>
            <div className="family__card-title">{story.title}</div>
            <div className="family__card-desc">{story.description}</div>
          </div>
        ))
      )}

      <p className="family__note">
        어르신 화면에도 오늘 이야기가 가족에게 전해진다고 적혀 있습니다.
        모르게 지켜보는 구조가 되지 않도록 양쪽에 같은 사실을 둡니다.
      </p>
    </>
  )
}

/**
 * 시설 공동 목표 (PRD 4.4).
 * 개인 순위나 기여도를 두지 않는다. 함께 채운 정도만 보인다.
 */
function FacilityTab({ goal }: { goal: FacilityGoal }) {
  const percent = Math.min(100, Math.round((goal.progress / goal.target) * 100))

  return (
    <>
      <p className="family__section-title">{goal.facilityName}</p>
      <p className="family__hint">이번 주 함께 채운 정도 · {goal.weekStart}부터</p>

      <div className="family__card">
        <div className="family__card-title">{goal.title}</div>
        <div className="family__goal-bar">
          <div className="family__goal-fill" style={{ width: `${percent}%` }} />
        </div>
        <div className="family__card-desc">
          {goal.progress} / {goal.target}
        </div>
      </div>

      <p className="family__note">
        누가 얼마나 했는지는 담지 않습니다. 겨루는 상대는 다른 요양원이 아니라
        목표치 자체입니다. 다 채우면 이 주의 기억 앨범이 남습니다.
      </p>
    </>
  )
}
