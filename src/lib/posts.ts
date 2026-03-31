import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { put, list, del, head } from "@vercel/blob";

const postsDir = path.join(process.cwd(), "content", "posts");
const BLOB_PREFIX = "posts/";
const isVercel = !!process.env.VERCEL;

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

function parseDate(d: unknown): string {
  if (d instanceof Date) return d.toISOString().split("T")[0];
  if (d) return String(d).split("T")[0];
  return "";
}

function parseMd(slug: string, raw: string): Post {
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || slug,
    date: parseDate(data.date),
    excerpt: data.excerpt || "",
    coverImage: data.coverImage || "",
    videoUrl: data.videoUrl || "",
    published: data.published !== false,
    readTime: calcReadTime(content),
    content,
    html: marked(content) as string,
  };
}

function parseMdMeta(slug: string, raw: string): PostMeta {
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || slug,
    date: parseDate(data.date),
    excerpt: data.excerpt || "",
    coverImage: data.coverImage || "",
    videoUrl: data.videoUrl || "",
    published: data.published !== false,
    readTime: calcReadTime(content),
  };
}

function buildMd(
  meta: { title: string; date: string; excerpt: string; coverImage: string; videoUrl: string; published: boolean },
  content: string
): string {
  return [
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
}

// ============ FILESYSTEM (local dev) ============

function ensureDir() {
  if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });
}

function fsGetAll(): PostMeta[] {
  ensureDir();
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
      return parseMdMeta(slug, raw);
    })
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}

function fsGet(slug: string): Post | null {
  const filePath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return parseMd(slug, fs.readFileSync(filePath, "utf-8"));
}

function fsSave(slug: string, meta: Parameters<typeof buildMd>[0], content: string) {
  ensureDir();
  fs.writeFileSync(path.join(postsDir, `${slug}.md`), buildMd(meta, content), "utf-8");
}

function fsDelete(slug: string) {
  const filePath = path.join(postsDir, `${slug}.md`);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

// ============ VERCEL BLOB (production) ============

async function blobGetAll(): Promise<PostMeta[]> {
  const { blobs } = await list({ prefix: BLOB_PREFIX });
  const posts: PostMeta[] = [];
  for (const blob of blobs) {
    const slug = blob.pathname.replace(BLOB_PREFIX, "").replace(/\.md$/, "");
    const res = await fetch(blob.url);
    const raw = await res.text();
    posts.push(parseMdMeta(slug, raw));
  }
  return posts.sort((a, b) => (b.date > a.date ? 1 : -1));
}

async function blobGet(slug: string): Promise<Post | null> {
  try {
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}${slug}.md` });
    if (blobs.length === 0) return null;
    const res = await fetch(blobs[0].url);
    const raw = await res.text();
    return parseMd(slug, raw);
  } catch {
    return null;
  }
}

async function blobSave(slug: string, meta: Parameters<typeof buildMd>[0], content: string) {
  await put(`${BLOB_PREFIX}${slug}.md`, buildMd(meta, content), {
    access: "public",
    addRandomSuffix: false,
  });
}

async function blobDelete(slug: string) {
  const { blobs } = await list({ prefix: `${BLOB_PREFIX}${slug}.md` });
  for (const blob of blobs) {
    await del(blob.url);
  }
}

// ============ PUBLIC API (auto-switches) ============

export async function getAllPostsAsync(): Promise<PostMeta[]> {
  if (isVercel) return blobGetAll();
  return fsGetAll();
}

export async function getPostAsync(slug: string): Promise<Post | null> {
  if (isVercel) return blobGet(slug);
  return fsGet(slug);
}

export async function savePostAsync(
  slug: string,
  meta: { title: string; date: string; excerpt: string; coverImage: string; videoUrl: string; published: boolean },
  content: string
) {
  if (isVercel) return blobSave(slug, meta, content);
  return fsSave(slug, meta, content);
}

export async function deletePostAsync(slug: string) {
  if (isVercel) return blobDelete(slug);
  return fsDelete(slug);
}

// Sync versions for static pages (filesystem fallback)
export function getAllPosts(): PostMeta[] { return fsGetAll(); }
export function getPublishedPosts(): PostMeta[] { return fsGetAll().filter((p) => p.published); }
export function getPost(slug: string): Post | null { return fsGet(slug); }

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
