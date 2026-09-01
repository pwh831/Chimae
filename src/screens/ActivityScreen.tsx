import type { Activity, Elder, LifeStory } from '../data/types'
import CupBallActivity from './activities/CupBallActivity'
import MazeActivity from './activities/MazeActivity'
import PhotoPeopleActivity from './activities/PhotoPeopleActivity'
import PhotoRecallActivity from './activities/PhotoRecallActivity'
import RecipeOrderActivity from './activities/RecipeOrderActivity'
import SongActivity from './activities/SongActivity'
import WordFillActivity from './activities/WordFillActivity'
import './ActivityScreen.css'

type ActivityScreenProps = {
  elder: Elder
  activity: Activity
  /** 보조 인지 활동에는 소재가 없다 */
  story?: LifeStory
  /** 어르신이 말을 마쳤을 때 부른다. 실제 말한 내용은 10단계에서 채워진다 */
  onSpoken: (text: string) => void
  onDone: () => void
}

/**
 * 활동 종류에 맞는 화면을 고른다.
 * 새 활동을 더할 때는 Activity union에 종류를 넣고 여기에 한 갈래 더한다.
 */
export default function ActivityScreen({
  elder,
  activity,
  story,
  onSpoken,
  onDone,
}: ActivityScreenProps) {
  switch (activity.kind) {
    case 'recipe-order':
      return story ? (
        <RecipeOrderActivity
          elder={elder}
          activity={activity}
          story={story}
          onSpoken={onSpoken}
          onDone={onDone}
        />
      ) : null
    case 'word-fill':
      return story ? (
        <WordFillActivity
          activity={activity}
          story={story}
          onSpoken={onSpoken}
          onDone={onDone}
        />
      ) : null
    case 'song-continue':
      return (
        <SongActivity
          elder={elder}
          activity={activity}
          onSpoken={onSpoken}
          onDone={onDone}
        />
      )
    case 'photo-recall':
      return (
        <PhotoRecallActivity
          activity={activity}
          story={story}
          onSpoken={onSpoken}
          onDone={onDone}
        />
      )
    case 'photo-people':
      return (
        <PhotoPeopleActivity
          activity={activity}
          story={story}
          onSpoken={onSpoken}
          onDone={onDone}
        />
      )
    case 'cup-ball':
      return <CupBallActivity activity={activity} onDone={onDone} />
    case 'maze':
      return <MazeActivity activity={activity} onDone={onDone} />
  }
}
