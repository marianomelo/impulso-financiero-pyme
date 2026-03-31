import { redirect, notFound } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getPost } from "@/lib/posts";
import PostForm from "@/components/PostForm";

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <PostForm
      post={{
        slug: post.slug,
        title: post.title,
        date: post.date,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        videoUrl: post.videoUrl,
        content: post.content,
        published: post.published,
      }}
    />
  );
}
