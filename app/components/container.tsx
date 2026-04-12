import type { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  size?: 'narrow' | 'wide'
  className?: string
}

export function Container({
  children,
  size = 'narrow',
  className = '',
}: ContainerProps) {
  const width = size === 'wide' ? 'max-w-6xl' : 'max-w-4xl'

  return (
    <div className={`${width} w-full mx-auto px-3 md:px-5 ${className}`}>
      {children}
    </div>
  )
}
