import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const postsDir = path.join(process.cwd(), "content", "posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
  videoUrl: string;
  published: boolean;
  readTime: number;
}

export interface Post extends PostMeta {
  content: string;
  html: string;
}

function calcReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function ensureDir() {
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }
}

export function getAllPosts(): PostMeta[] {
  ensureDir();
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title || slug,
        date: data.date instanceof Date
          ? data.date.toISOString().split("T")[0]
          : data.date
            ? String(data.date).split("T")[0]
            : "",
        excerpt: data.excerpt || "",
        coverImage: data.coverImage || "",
        videoUrl: data.videoUrl || "",
        published: data.published !== false,
        readTime: calcReadTime(content),
      };
    })
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}

export function getPublishedPosts(): PostMeta[] {
  return getAllPosts().filter((p) => p.published);
}

export function getPost(slug: string): Post | null {
  const filePath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title || slug,
    date: data.date instanceof Date
          ? data.date.toISOString().split("T")[0]
          : data.date
            ? String(data.date).split("T")[0]
            : "",
    excerpt: data.excerpt || "",
    coverImage: data.coverImage || "",
    videoUrl: data.videoUrl || "",
    published: data.published !== false,
    readTime: calcReadTime(content),
    content,
    html: marked(content) as string,
  };
}

export function savePost(
  slug: string,
  meta: { title: string; date: string; excerpt: string; coverImage: string; videoUrl: string; published: boolean },
  content: string
) {
  ensureDir();
  const frontmatter = [
    "---",
    `title: "${meta.title.replace(/"/g, '\\"')}"`,
    `date: ${meta.date}`,
    `excerpt: "${meta.excerpt.replace(/"/g, '\\"')}"`,
    `coverImage: ${meta.coverImage || ""}`,
    `videoUrl: ${meta.videoUrl || ""}`,
    `published: ${meta.published}`,
    "---",
    "",
    content,
  ].join("\n");

  fs.writeFileSync(path.join(postsDir, `${slug}.md`), frontmatter, "utf-8");
}

export function deletePostFile(slug: string) {
  const filePath = path.join(postsDir, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
