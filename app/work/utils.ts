import fs from 'fs'
import path from 'path'
import readingTime from 'reading-time'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  role: string
  company: string
  year: string
  tags?: string[]
  readingTime?: string
  words?: number
}

export type WorkEntry = {
  metadata: Metadata
  slug: string
  content: string
}

const MAX_TAGS = 3

function parseTags(value: string) {
  const normalized = value
    .trim()
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .trim()

  if (!normalized) return []

  return normalized
    .split(',')
    .map((tag) => tag.trim().replace(/^['"](.*)['"]$/, '$1'))
    .filter(Boolean)
    .slice(0, MAX_TAGS)
}

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)

  if (!match) {
    return { metadata: {} as Metadata, content: fileContent.trim() }
  }

  const frontMatterBlock = match[1]
  const content = fileContent.replace(frontmatterRegex, '').trim()
  const frontMatterLines = frontMatterBlock.trim().split('\n')
  const metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1')

    if (key.trim() === 'tags') {
      metadata.tags = parseTags(value)
      return
    }

    ;(metadata as Record<string, string | string[]>)[key.trim()] = value
  })

  metadata.tags = metadata.tags ?? []

  return { metadata: metadata as Metadata, content }
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function walkDir(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const out: string[] = []
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walkDir(fullPath))
    else out.push(fullPath)
  }
  return out
}

function pickPostFileForFolder(folderPath: string): string | null {
  const preferred = path.join(folderPath, 'page.mdx')
  if (fs.existsSync(preferred)) return preferred
  const files = fs.readdirSync(folderPath).filter((f) => f.toLowerCase().endsWith('.mdx'))
  if (files.length === 0) return null
  return path.join(folderPath, files[0])
}

function getMDXData(postsDir: string): WorkEntry[] {
  if (!fs.existsSync(postsDir)) return []

  const allPaths = walkDir(postsDir).filter((p) => p.toLowerCase().endsWith('.mdx'))
  const bySlug = new Map<string, string>()

  for (const filePath of allPaths) {
    const rel = path.relative(postsDir, filePath)
    const parts = rel.split(path.sep)

    if (parts.length === 1) {
      const slug = path.basename(parts[0], path.extname(parts[0]))
      if (!bySlug.has(slug)) bySlug.set(slug, filePath)
      continue
    }

    const slug = parts[0]
    const folderPath = path.join(postsDir, slug)
    const chosen = pickPostFileForFolder(folderPath)
    if (chosen) bySlug.set(slug, chosen)
  }

  return Array.from(bySlug.entries())
    .map(([slug, filePath]) => {
      const { metadata, content } = readMDXFile(filePath)
      if (!metadata?.title || !metadata?.publishedAt) return null
      const stats = readingTime(content)
      return {
        metadata: { ...metadata, readingTime: stats.text, words: stats.words },
        slug,
        content,
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
}

export function getWorkEntries(): WorkEntry[] {
  return getMDXData(path.join(process.cwd(), 'app', 'work', 'posts'))
}

export function formatDate(date: string) {
  if (!date.includes('T')) date = `${date}T00:00:00`
  return new Date(date).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
