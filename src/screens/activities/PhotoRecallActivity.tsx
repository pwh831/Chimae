import type { Activity, LifeStory } from '../../data/types'
import StoryInvitation from './StoryInvitation'
import './PhotoActivity.css'

type PhotoRecallActivityType = Extract<Activity, { kind: 'photo-recall' }>

type Props = {
  activity: PhotoRecallActivityType
  story?: LifeStory
  onSpoken: (text: string) => void
  onDone: () => void
}

/**
 * 사진을 보고 자유롭게 이야기하는 활동.
 * 옛 동네, 물건 용도가 모두 이 형태다.
 *
 * 물음에 답이 없다. 사진을 보시고 떠오르는 것을 말씀하시면 된다.
 */
export default function PhotoRecallActivity({
  activity,
  story,
  onSpoken,
  onDone,
}: Props) {
  return (
    <StoryInvitation
      title={activity.data.question}
      lead={<img className="photo-activity__photo" src={activity.data.photoUrl} alt="" />}
      thanksTitle={story ? `${story.title} 이야기` : '오늘 이야기'}
      onSpoken={onSpoken}
      onDone={onDone}
    />
  )
}
