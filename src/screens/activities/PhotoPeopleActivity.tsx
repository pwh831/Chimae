import { useEffect, useState } from 'react'
import ScreenLayout from '../../components/ScreenLayout'
import type { Activity, LifeStory, PhotoPerson } from '../../data/types'
import StoryInvitation from './StoryInvitation'
import './PhotoActivity.css'

const REVEAL_MS = 2800

type PhotoPeopleActivityType = Extract<Activity, { kind: 'photo-people' }>

type Props = {
  activity: PhotoPeopleActivityType
  story?: LifeStory
  onSpoken: (text: string) => void
  onDone: () => void
}

/**
 * 가족 사진 속 인물 짚기.
 *
 * 누구를 짚으셔도 그 사람이 누구인지 알려드린다.
 * 짚어야 할 사람을 정해 두지 않으므로 잘못 짚는 일이 생기지 않는다.
 */
export default function PhotoPeopleActivity({
  activity,
  story,
  onSpoken,
  onDone,
}: Props) {
  const [picked, setPicked] = useState<PhotoPerson | null>(null)
  const [askStory, setAskStory] = useState(false)

  useEffect(() => {
    if (!picked) return
    const timer = window.setTimeout(() => setAskStory(true), REVEAL_MS)
    return () => window.clearTimeout(timer)
  }, [picked])

  if (askStory) {
    return (
      <StoryInvitation
        title={activity.data.invitation}
        thanksTitle={story ? `${story.title} 이야기` : '오늘 이야기'}
        onSpoken={onSpoken}
        onDone={onDone}
      />
    )
  }

  if (picked) {
    return (
      <ScreenLayout title="사진 속 사람">
        <div className="activity__centered">
          <p className="photo-people__name">
            {picked.relation} {picked.name}
          </p>
        </div>
      </ScreenLayout>
    )
  }

  return (
    <ScreenLayout title="사진 속 사람을 짚어볼까요?">
      <div className="activity__centered">
        <div className="photo-people__frame">
          <img className="photo-people__image" src={activity.data.photoUrl} alt="" />
          {activity.data.people.map((person) => (
            <button
              type="button"
              key={person.id}
              className="photo-people__spot"
              style={{ left: `${person.x}%`, top: `${person.y}%` }}
              aria-label={`사진 속 사람 짚기`}
              onClick={() => setPicked(person)}
            />
          ))}
        </div>
      </div>
    </ScreenLayout>
  )
}
