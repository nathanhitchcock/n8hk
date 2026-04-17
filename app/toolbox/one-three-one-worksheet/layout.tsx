import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '1-3-1 Decision Worksheet',
  description:
    'Use the 1-3-1 worksheet to define one clear problem, compare three options, and commit to one recommendation.',
}

export default function OneThreeOneWorksheetLayout({ children }: { children: React.ReactNode }) {
  return children
}
