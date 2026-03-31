import { NextRequest, NextResponse } from "next/server";
import { savePostAsync, getAllPostsAsync, deletePostAsync } from "@/lib/posts";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  if (secret !== (process.env.AUTH_SECRET || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const force = searchParams.get("force") === "1";
  const postsDir = path.join(process.cwd(), "content", "posts");
  if (!fs.existsSync(postsDir)) {
    return NextResponse.json({ error: "No local posts found" }, { status: 404 });
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  const existing = await getAllPostsAsync();
  const existingSlugs = new Set(existing.map((p) => p.slug));

  let uploaded = 0;
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    if (!force && existingSlugs.has(slug)) continue;

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

  // Clean up blobs that no longer have local files
  const localSlugs = new Set(files.map((f) => f.replace(/\.md$/, "")));
  let deleted = 0;
  for (const post of existing) {
    if (!localSlugs.has(post.slug)) {
      await deletePostAsync(post.slug);
      deleted++;
    }
  }

  return NextResponse.json({ ok: true, uploaded, deleted, total: files.length });
}
