import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostAsync } from "@/lib/posts";
import { ReadingProgress } from "@/components/ReadingProgress";
import { FloatingBar } from "@/components/FloatingBar";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostAsync(slug);
  if (!post) return {};
  return { title: `${post.title} — Impulso Financiero PYME`, description: post.excerpt };
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-ES", { month: "long", day: "numeric", year: "numeric" });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostAsync(slug);
  if (!post || !post.published) notFound();

  return (
    <>
      <ReadingProgress />
      <article className="cb-in">
        {/* Cover */}
        {post.coverImage && (
          <div className="w-full h-[320px] sm:h-[420px] overflow-hidden bg-surface">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover object-center" />
          </div>
        )}

        <div className="max-w-[680px] mx-auto px-6">
          {/* Header */}
          <header className="pt-10 pb-8 cb-in" style={{ animationDelay: "80ms" }}>
            <div className="flex items-center gap-2 text-xs text-fg-tertiary mb-4">
              <span className="text-blue font-medium">Articulo</span>
              <span>&middot;</span>
              <time>{formatDate(post.date)}</time>
              <span>&middot;</span>
              <span>{post.readTime} min de lectura</span>
            </div>
            <h1 className="text-[2rem] sm:text-[2.5rem] font-bold leading-[1.12] tracking-tight mb-4">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-fg-secondary text-lg leading-relaxed mb-6">{post.excerpt}</p>
            )}
            {/* Author */}
            <div className="flex items-center gap-3 pt-5 border-t border-border">
              <div className="w-9 h-9 rounded-full bg-blue flex items-center justify-center text-white text-xs font-bold">
                NF
              </div>
              <div>
                <p className="text-sm font-medium">Nicol Fermin</p>
                <p className="text-xs text-fg-tertiary">Universidad Bicentenaria de Aragua</p>
              </div>
            </div>
          </header>

          {/* Video */}
          {post.videoUrl && (
            <div className="video-embed cb-in" style={{ animationDelay: "160ms" }}>
              <iframe
                src={post.videoUrl}
                title="Video relacionado"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Body */}
          <div className="prose cb-in" style={{ animationDelay: "200ms" }} dangerouslySetInnerHTML={{ __html: post.html }} />

          {/* End */}
          <div className="mt-12 pt-8 pb-20 border-t border-border">
            <div className="bg-surface rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue flex items-center justify-center text-white font-bold text-sm shrink-0">
                NF
              </div>
              <div className="flex-1">
                <p className="font-semibold">Nicol Fermin</p>
                <p className="text-fg-tertiary text-sm">Universidad Bicentenaria de Aragua</p>
              </div>
              <Link href="/" className="btn-outline text-xs shrink-0">
                Ver mas
              </Link>
            </div>
          </div>
        </div>
      </article>
      <FloatingBar />
    </>
  );
}
