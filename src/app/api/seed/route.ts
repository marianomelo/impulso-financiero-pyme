import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { savePostAsync, getAllPostsAsync } from "@/lib/posts";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function POST() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Read all local .md files and upload to blob
  const postsDir = path.join(process.cwd(), "content", "posts");
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

  const existing = await getAllPostsAsync();
  const existingSlugs = new Set(existing.map((p) => p.slug));

  let uploaded = 0;
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    if (existingSlugs.has(slug)) continue;

    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const { data, content } = matter(raw);

    const date = data.date instanceof Date
      ? data.date.toISOString().split("T")[0]
      : data.date ? String(data.date).split("T")[0] : new Date().toISOString().split("T")[0];

    await savePostAsync(slug, {
      title: data.title || slug,
      date,
      excerpt: data.excerpt || "",
      coverImage: data.coverImage || "",
      videoUrl: data.videoUrl || "",
      published: data.published !== false,
    }, content);
    uploaded++;
  }

  return NextResponse.json({ ok: true, uploaded, total: files.length });
}
