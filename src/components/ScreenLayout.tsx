import type { ReactNode } from 'react'
import './ScreenLayout.css'

type ScreenLayoutProps = {
  /** 화면 맨 위 제목 */
  title: string
  /** 제목 아래 보조 설명. 없으면 생략한다 */
  subtitle?: string
  /** 화면 가운데 내용 */
  children: ReactNode
  /** 화면 아래 버튼 자리. 여기에 두는 버튼은 넉넉한 간격으로 배치된다 */
  footer?: ReactNode
}

/** 어르신용 화면의 공통 뼈대. 제목 + 내용 + 하단 버튼 세 칸으로 나뉜다. */
export default function ScreenLayout({
  title,
  subtitle,
  children,
  footer,
}: ScreenLayoutProps) {
  return (
    <div className="screen-layout">
      <header className="screen-layout__header">
        <h1 className="screen-layout__title">{title}</h1>
        {subtitle ? <p className="screen-layout__subtitle">{subtitle}</p> : null}
      </header>

      <main className="screen-layout__content">{children}</main>

      {footer ? <footer className="screen-layout__footer">{footer}</footer> : null}
    </div>
  )
}
