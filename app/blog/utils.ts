import fs from "fs";
import path from "path";
import readingTime from "reading-time";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  readingTime?: string;
  words?: number;
};

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);

  // If no frontmatter, treat entire file as content (prevents hard crashes)
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
    value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
    (metadata as Record<string, string>)[key.trim()] = value;
  });

  return { metadata: metadata as Metadata, content };
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

/**
 * Recursively walk a directory and return all file paths.
 */
function walkDir(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out: string[] = [];

  for (const entry of entries) {
    // ignore dotfiles/folders (., .., .DS_Store, etc.)
    if (entry.name.startsWith(".")) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkDir(fullPath));
    else out.push(fullPath);
  }

  return out;
}

/**
 * Prefer `page.mdx` inside a slug folder; otherwise fall back to any .mdx file inside.
 * This allows:
 * - posts/<slug>/page.mdx (recommended)
 * - posts/<slug>/<anything>.mdx (supported)
 */
function pickPostFileForFolder(folderPath: string): string | null {
  const preferred = path.join(folderPath, "page.mdx");
  if (fs.existsSync(preferred)) return preferred;

  const files = fs
    .readdirSync(folderPath)
    .filter((f) => f.toLowerCase().endsWith(".mdx"));

  if (files.length === 0) return null;

  // If multiple, just take the first one (you can tighten this later)
  return path.join(folderPath, files[0]);
}

/**
 * Returns blog posts from:
 * - app/blog/posts/<slug>.mdx
 * - app/blog/posts/<slug>/page.mdx
 * - app/blog/posts/<slug>/<anything>.mdx
 */
function getMDXData(postsDir: string) {
  if (!fs.existsSync(postsDir)) return [];

  const allPaths = walkDir(postsDir).filter((p) =>
    p.toLowerCase().endsWith(".mdx")
  );

  // slug -> selected mdx file path
  const bySlug = new Map<string, string>();

  for (const filePath of allPaths) {
    const rel = path.relative(postsDir, filePath);
    const parts = rel.split(path.sep);

    // Case A: posts/<slug>.mdx (top-level)
    if (parts.length === 1) {
      const filename = parts[0];
      const slug = path.basename(filename, path.extname(filename));
      // Only set if no folder-based post overwrote it later
      if (!bySlug.has(slug)) bySlug.set(slug, filePath);
      continue;
    }

    // Case B: posts/<slug>/<file>.mdx (folder-based)
    const slug = parts[0];
    const folderPath = path.join(postsDir, slug);

    // Choose page.mdx if it exists, else any mdx in that folder
    const chosen = pickPostFileForFolder(folderPath);
    if (chosen) bySlug.set(slug, chosen);
  }

  // Build post objects
  const posts = Array.from(bySlug.entries()).map(([slug, filePath]) => {
    const { metadata, content } = readMDXFile(filePath);
    const stats = readingTime(content);

    return {
      metadata: {
        ...metadata,
        readingTime: stats.text, // e.g. "5 min read"
        words: stats.words,
      },
      slug,
      content,
    };
  });

  return posts;
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), "app", "blog", "posts"));
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

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  const fullDate = targetDate.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) return fullDate;

  return `${fullDate} (${formattedDate})`;
}
