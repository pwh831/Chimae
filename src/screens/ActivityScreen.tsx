import type { Activity, Elder, LifeStory } from '../data/types'
import RecipeOrderActivity from './activities/RecipeOrderActivity'
import SongActivity from './activities/SongActivity'
import WordFillActivity from './activities/WordFillActivity'
import './ActivityScreen.css'

type ActivityScreenProps = {
  elder: Elder
  activity: Activity
  story: LifeStory
  /** 어르신이 말을 마쳤을 때 부른다. 실제 말한 내용은 10단계에서 채워진다 */
  onSpoken: (text: string) => void
  onDone: () => void
}

/**
 * 활동 종류에 맞는 화면을 고른다.
 * 새 활동을 더할 때는 Activity union에 종류를 넣고 여기에 한 줄 더한다.
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
      return (
        <RecipeOrderActivity
          elder={elder}
          activity={activity}
          story={story}
          onSpoken={onSpoken}
          onDone={onDone}
        />
      )
    case 'word-fill':
      return (
        <WordFillActivity
          activity={activity}
          story={story}
          onSpoken={onSpoken}
          onDone={onDone}
        />
      )
    case 'song-continue':
      return (
        <SongActivity
          elder={elder}
          activity={activity}
          onSpoken={onSpoken}
          onDone={onDone}
        />
      )
  }
}
