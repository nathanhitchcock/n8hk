import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        About this space
      </h1>
      <p className="mb-4">
        {`Hello World! I’m Nathan — an engineering leader, writer, and systems thinker exploring how humans and
          technology collaborate. This space is where I explore that intersection: how technology can empower rather
          than replace, and how empathy, structure, and design shape the way we work with intelligent systems.
          Over the past decade, I’ve led high-performing teams through major transformations in service and support,
          focusing on building frameworks where people and technology complement each other — automation that empowers,
          AI that assists with empathy, and teams that thrive sustainably.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
