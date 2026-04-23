import { redirect } from 'next/navigation'

type FrameworkPageProps = {
  params: Promise<{
    framework: string
  }>
}

export default async function FrameworkDetailPage({ params }: FrameworkPageProps) {
  const { framework } = await params
  redirect(`/frameworks/framework/${framework}`)
}
