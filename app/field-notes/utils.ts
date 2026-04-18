import fs from "fs";
import path from "path";
import readingTime from "reading-time";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  category?: string;
  tags?: string[];
  frameworkStep?: string;
  readingTime?: string;
  words?: number;
};

const MAX_TAGS = 3;

function parseTags(value: string) {
  const normalized = value
    .trim()
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .trim();

  if (!normalized) return [];

  return normalized
    .split(",")
    .map((tag) => tag.trim().replace(/^['"](.*)['"]$/, "$1"))
    .filter(Boolean)
    .slice(0, MAX_TAGS);
}

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);

  if (!match) {
    return {
      metadata: {} as Metadata,
      content: fileContent.trim(),
    };
  }

  const frontMatterBlock = match[1];
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const frontMatterLines = frontMatterBlock.trim().split("\n");
  const metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1");

    if (key.trim() === "tags") {
      metadata.tags = parseTags(value);
      return;
    }

    (metadata as Record<string, string | string[]>)[key.trim()] = value;
  });

  metadata.tags = metadata.tags ?? [];

  return { metadata: metadata as Metadata, content };
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function walkDir(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkDir(fullPath));
    else out.push(fullPath);
  }

  return out;
}

function pickPostFileForFolder(folderPath: string): string | null {
  const preferred = path.join(folderPath, "page.mdx");
  if (fs.existsSync(preferred)) return preferred;

  const files = fs
    .readdirSync(folderPath)
    .filter((f) => f.toLowerCase().endsWith(".mdx"));

  if (files.length === 0) return null;

  return path.join(folderPath, files[0]);
}

function getMDXData(postsDir: string) {
  if (!fs.existsSync(postsDir)) return [];

  const allPaths = walkDir(postsDir).filter((p) =>
    p.toLowerCase().endsWith(".mdx")
  );

  const bySlug = new Map<string, string>();

  for (const filePath of allPaths) {
    const rel = path.relative(postsDir, filePath);
    const parts = rel.split(path.sep);

    if (parts.length === 1) {
      const filename = parts[0];
      const slug = path.basename(filename, path.extname(filename));
      if (!bySlug.has(slug)) bySlug.set(slug, filePath);
      continue;
    }

    const slug = parts[0];
    const folderPath = path.join(postsDir, slug);

    const chosen = pickPostFileForFolder(folderPath);
    if (chosen) bySlug.set(slug, chosen);
  }

  const posts = Array.from(bySlug.entries())
    .map(([slug, filePath]) => {
      const { metadata, content } = readMDXFile(filePath);
      if (!metadata?.title || !metadata?.publishedAt) {
        return null;
      }

      const stats = readingTime(content);

      return {
        metadata: {
          ...metadata,
          readingTime: stats.text,
          words: stats.words,
        },
        slug,
        content,
      };
    })
    .filter((post): post is NonNullable<typeof post> => Boolean(post));

  return posts;
}

export function getFieldNotes() {
  return getMDXData(path.join(process.cwd(), "app", "field-notes", "posts"));
}

export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date);

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let relativeDate = "";
  if (yearsAgo > 0) {
    relativeDate =
      yearsAgo > 1 ? `${yearsAgo}y ago` : "1 year ago";
  } else if (monthsAgo > 0) {
    relativeDate =
      monthsAgo > 1 ? `${monthsAgo}mo ago` : "1 month ago";
  } else if (daysAgo > 0) {
    relativeDate = daysAgo > 1 ? `${daysAgo}d ago` : "1 day ago";
  } else {
    relativeDate = "Today";
  }

  const fullDate = targetDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${relativeDate})`;
}
