import fs from 'fs'
import path from 'path'
import readingTime from 'reading-time'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  step: number
  framework?: string
  frameworkOrder?: number
  phase?: string
  tags?: string[]
  readingTime?: string
  words?: number
}

export type PlaybookEntry = {
  metadata: Metadata
  slug: string
  content: string
}

export type FrameworkGroup = {
  name: string
  slug: string
  order: number
  entries: PlaybookEntry[]
}

export const DEFAULT_FRAMEWORK = 'How to Grow a High-Performing Team'

const MAX_TAGS = 3

export function frameworkToSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function parseTags(value: string) {
  const normalized = value
    .trim()
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .trim()

  if (!normalized) return []

  return normalized
    .split(',')
    .map((tag) => tag.trim().replace(/^['\"](.*)['\"]$/, '$1'))
    .filter(Boolean)
    .slice(0, MAX_TAGS)
}

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)

  if (!match) {
    return {
      metadata: {} as Metadata,
      content: fileContent.trim(),
    }
  }

  const frontMatterBlock = match[1]
  const content = fileContent.replace(frontmatterRegex, '').trim()
  const frontMatterLines = frontMatterBlock.trim().split('\n')
  const metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['\"](.*)['\"]$/, '$1')

    if (key.trim() === 'tags') {
      metadata.tags = parseTags(value)
      return
    }

    if (key.trim() === 'step') {
      metadata.step = Number(value)
      return
    }

    if (key.trim() === 'frameworkOrder') {
      metadata.frameworkOrder = Number(value)
      return
    }

    ;(metadata as Record<string, string | number | string[]>)[key.trim()] = value
  })

  metadata.tags = metadata.tags ?? []
  metadata.framework = metadata.framework ?? DEFAULT_FRAMEWORK
  metadata.frameworkOrder = metadata.frameworkOrder ?? 1

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

  const files = fs
    .readdirSync(folderPath)
    .filter((f) => f.toLowerCase().endsWith('.mdx'))

  if (files.length === 0) return null

  return path.join(folderPath, files[0])
}

function getMDXData(postsDir: string) {
  if (!fs.existsSync(postsDir)) return []

  const allPaths = walkDir(postsDir).filter((p) => p.toLowerCase().endsWith('.mdx'))

  const bySlug = new Map<string, string>()

  for (const filePath of allPaths) {
    const rel = path.relative(postsDir, filePath)
    const parts = rel.split(path.sep)

    if (parts.length === 1) {
      const filename = parts[0]
      const slug = path.basename(filename, path.extname(filename))
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

      if (!metadata?.title || !metadata?.publishedAt || !metadata?.step) {
        return null
      }

      const stats = readingTime(content)

      return {
        metadata: {
          ...metadata,
          readingTime: stats.text,
          words: stats.words,
        },
        slug,
        content,
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
}

export function getPlaybookEntries() {
  return getMDXData(path.join(process.cwd(), 'app', 'playbook', 'posts'))
}

export function getFrameworkGroups(): FrameworkGroup[] {
  const entries = getPlaybookEntries()

  return Object.values(
    entries.reduce(
      (acc, entry) => {
        const name = entry.metadata.framework || DEFAULT_FRAMEWORK
        if (!acc[name]) {
          acc[name] = {
            name,
            slug: frameworkToSlug(name),
            order: entry.metadata.frameworkOrder ?? 99,
            entries: [] as PlaybookEntry[],
          }
        }

        acc[name].entries.push(entry)
        return acc
      },
      {} as Record<string, FrameworkGroup>
    )
  )
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
    .map((framework) => ({
      ...framework,
      entries: framework.entries.sort((a, b) => a.metadata.step - b.metadata.step),
    }))
}

export function getFrameworkGroupBySlug(frameworkSlug: string): FrameworkGroup | null {
  const frameworks = getFrameworkGroups()
  return frameworks.find((framework) => framework.slug === frameworkSlug) ?? null
}

export function formatDate(date: string) {
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }

  const targetDate = new Date(date)
  return targetDate.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
