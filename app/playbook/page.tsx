import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Blueprints',
  description: 'Step-by-step operator blueprints for managers and engineering leaders.',
}

export default function PlaybookPage() {
  redirect('/blueprints')
}
