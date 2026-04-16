import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Frameworks',
  description: 'Step-by-step operator frameworks for managers and engineering leaders.',
}

export default function PlaybookPage() {
  redirect('/frameworks')
}
