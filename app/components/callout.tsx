import type { ReactNode } from 'react'

export default function Callout({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <div className="callout">
      {title ? <div className="callout-title">{title}</div> : null}
      <div className="callout-content">
        {children}
      </div>
    </div>
  )
}
