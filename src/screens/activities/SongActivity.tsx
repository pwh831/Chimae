import type { Activity, Elder } from '../../data/types'
import { copula, subjectMarker } from '../../lib/korean'
import StoryInvitation from './StoryInvitation'
import './SongActivity.css'

type SongActivityType = Extract<Activity, { kind: 'song-continue' }>

type Props = {
  elder: Elder
  activity: SongActivityType
  onSpoken: (text: string) => void
  onDone: () => void
}

/**
 * 노래 이어부르기 활동.
 *
 * 어떻게 부르시든, 부르지 않으시든 받아준다.
 * 가사가 맞는지 보지 않는다. 소리를 내보시는 것 자체가 활동이다.
 */
export default function SongActivity({ elder, activity, onSpoken, onDone }: Props) {
  const { songTitle, openingLine, invitation } = activity.data

  return (
    <StoryInvitation
      title={`${elder.callName}${subjectMarker(elder.callName)} 좋아하시던 ${songTitle}${copula(songTitle)}`}
      subtitle={invitation}
      // 첫 소절만 보여드린다. 청하는 말은 제목 아래에 이미 있다
      lead={<p className="song__line">{openingLine}</p>}
      thanksTitle={`${songTitle} 이야기`}
      thanksWords="노래 잘 들었어요"
      onSpoken={onSpoken}
      onDone={onDone}
    />
  )
}
