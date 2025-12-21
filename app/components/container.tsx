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
  const width = size === 'wide' ? 'max-w-xl lg:max-w-5xl' : 'max-w-xl'

  return (
    <div className={`${width} w-full mx-auto px-2 ${className}`}>
      {children}
    </div>
  )
}
