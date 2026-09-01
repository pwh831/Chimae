import type { ReactNode } from 'react'
import './BigButton.css'

type BigButtonProps = {
  /** 버튼에 적힌 문구. 아이콘만 두지 않는다 — 글자는 항상 있어야 한다 */
  label: string
  onClick?: () => void
  /** 글자 옆에 함께 보여줄 그림. 색으로만 뜻을 전하지 않기 위한 보조 수단 */
  icon?: ReactNode
  /** primary는 채움, secondary는 테두리. 색이 아니라 형태로 구분된다 */
  variant?: 'primary' | 'secondary'
  /** 가로 폭을 꽉 채운다 */
  full?: boolean
}

/** 어르신용 화면의 기본 버튼. 글자 32px, 터치 영역 100x100px 이상을 보장한다. */
export default function BigButton({
  label,
  onClick,
  icon,
  variant = 'primary',
  full = false,
}: BigButtonProps) {
  const classes = [
    'big-button',
    `big-button--${variant}`,
    full ? 'big-button--full' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classes} onClick={onClick}>
      {icon ? (
        <span className="big-button__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="big-button__label">{label}</span>
    </button>
  )
}
