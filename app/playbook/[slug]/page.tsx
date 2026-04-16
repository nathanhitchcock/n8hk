import { redirect } from 'next/navigation'

type Params = { slug: string }

export default async function PlaybookEntryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  redirect(`/frameworks/${slug}`)
}
