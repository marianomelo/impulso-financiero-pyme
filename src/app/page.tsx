import Link from "next/link";
import { getAllPostsAsync } from "@/lib/posts";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-ES", { month: "short", day: "numeric", year: "numeric" });
}

export default async function Home() {
  const all = await getAllPostsAsync();
  const posts = all.filter((p) => p.published);

  return (
    <div className="cb-in">
      {/* Hero */}
      <div className="bg-surface">
        <div className="max-w-[1120px] mx-auto px-6 py-16 sm:py-20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-blue rounded-full" />
            <p className="text-fg-tertiary text-sm">Blog academico</p>
          </div>
          <h1 className="text-[2.25rem] sm:text-[2.75rem] font-bold leading-[1.1] tracking-tight max-w-2xl">
            Microcreditos y Desarrollo de las PYMES
          </h1>
          <p className="text-fg-secondary text-base leading-relaxed mt-4 max-w-lg">
            Analisis sobre la gestion del microcredito en entidades financieras y su impacto en el crecimiento de las pequenas y medianas empresas.
          </p>
        </div>
      </div>

      {/* Articles grid */}
      <div className="max-w-[1120px] mx-auto px-6 py-12">
        {posts.length === 0 ? (
          <p className="text-fg-tertiary text-center py-20">Proximamente...</p>
        ) : (
          <>
            <p className="text-[0.8125rem] font-medium text-fg-tertiary mb-6">
              Publicaciones recientes
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="card group cb-in"
                  style={{ animationDelay: `${100 + i * 80}ms` }}
                >
                  {post.coverImage ? (
                    <div className="w-full h-[180px] bg-surface overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-[180px] bg-gradient-to-br from-blue to-[#0035A3] flex items-end p-5">
                      <span className="text-white/20 text-5xl font-bold tracking-tighter leading-none">$</span>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-fg-tertiary mb-2">
                      <span className="text-blue font-medium">Articulo</span>
                      <span>&middot;</span>
                      <span>{formatDate(post.date)}</span>
                      <span>&middot;</span>
                      <span>{post.readTime} min</span>
                    </div>
                    <h2 className="text-[0.9375rem] font-semibold leading-snug line-clamp-2 group-hover:text-blue transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-fg-secondary text-[0.8125rem] leading-relaxed mt-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
