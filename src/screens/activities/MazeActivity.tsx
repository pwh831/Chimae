import { useEffect, useState } from 'react'
import ScreenLayout from '../../components/ScreenLayout'
import type { Activity } from '../../data/types'
import './MazeActivity.css'

const ARRIVED_MS = 2800

type MazeActivityType = Extract<Activity, { kind: 'maze' }>

type Spot = { row: number; col: number }

type Props = {
  activity: MazeActivityType
  onDone: () => void
}

function findChar(rows: string[], target: string): Spot {
  for (let row = 0; row < rows.length; row += 1) {
    const col = rows[row].indexOf(target)
    if (col !== -1) return { row, col }
  }
  return { row: 0, col: 0 }
}

/**
 * 미로 찾기.
 * 지금 자리에 붙어 있고 벽이 아닌 칸만 누를 수 있다.
 * 잘못 누를 수가 없으므로 틀렸다는 말을 할 일도 없다.
 */
export default function MazeActivity({ activity, onDone }: Props) {
  const rows = activity.data.rows
  const goal = findChar(rows, 'G')

  const [here, setHere] = useState<Spot>(() => findChar(rows, 'S'))

  const arrived = here.row === goal.row && here.col === goal.col

  useEffect(() => {
    if (!arrived) return
    const timer = window.setTimeout(onDone, ARRIVED_MS)
    return () => window.clearTimeout(timer)
  }, [arrived, onDone])

  function isOpen(row: number, col: number): boolean {
    return rows[row]?.[col] !== undefined && rows[row][col] !== '#'
  }

  function isNextTo(row: number, col: number): boolean {
    return Math.abs(row - here.row) + Math.abs(col - here.col) === 1
  }

  return (
    <ScreenLayout
      title="길을 따라가 볼까요?"
      subtitle={arrived ? '다 오셨어요' : '갈 수 있는 칸을 눌러 옮겨가세요'}
    >
      <div className="activity__centered">
        <div
          className="maze__grid"
          style={{ gridTemplateColumns: `repeat(${rows[0].length}, 104px)` }}
        >
          {rows.map((line, row) =>
            [...line].map((_, col) => {
              const open = isOpen(row, col)
              const isHere = row === here.row && col === here.col
              const isGoal = row === goal.row && col === goal.col
              const canStep = open && !isHere && isNextTo(row, col)

              const classes = ['maze__cell']
              if (!open) classes.push('maze__cell--wall')
              else if (isHere) classes.push('maze__cell--here')
              else if (isGoal) classes.push('maze__cell--goal')
              else classes.push('maze__cell--open')
              if (canStep) classes.push('maze__step')

              if (canStep) {
                return (
                  <button
                    type="button"
                    key={`${row}-${col}`}
                    className={classes.join(' ')}
                    aria-label="이 칸으로 옮기기"
                    onClick={() => setHere({ row, col })}
                  />
                )
              }
              return (
                <div key={`${row}-${col}`} className={classes.join(' ')}>
                  {isHere ? '여기' : isGoal ? '도착' : ''}
                </div>
              )
            }),
          )}
        </div>
      </div>
    </ScreenLayout>
  )
}
