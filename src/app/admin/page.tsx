import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllPostsAsync } from "@/lib/posts";
import { DeleteButton } from "@/components/DeleteButton";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
}

export default async function AdminPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");
  const posts = await getAllPostsAsync();

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">Tus publicaciones</h1>
      <p className="text-fg-tertiary text-sm mb-6">{posts.length} {posts.length === 1 ? "articulo" : "articulos"}</p>

      {posts.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border-strong rounded-xl">
          <p className="text-fg-tertiary text-sm mb-3">No hay publicaciones todavia</p>
          <Link href="/admin/posts/new" className="btn-blue text-sm">Escribir</Link>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <div key={post.slug} className="flex items-start gap-4 py-4 px-3 -mx-3 group border-b border-border rounded-lg hover:bg-hover-bg transition-colors">
              <div className="flex-1 min-w-0">
                <Link href={`/admin/posts/${post.slug}/edit`}>
                  <h2 className="text-sm font-semibold leading-snug mb-0.5 hover:text-blue transition-colors">{post.title}</h2>
                </Link>
                {post.excerpt && <p className="text-fg-secondary text-xs line-clamp-1 mb-1.5">{post.excerpt}</p>}
                <div className="flex items-center gap-2 text-xs text-fg-tertiary">
                  {post.published ? (
                    <span className="text-blue font-medium">Publicado</span>
                  ) : (
                    <span className="font-medium">Borrador</span>
                  )}
                  <span>&middot;</span>
                  <span>{formatDate(post.date)}</span>
                  <span>&middot;</span>
                  <span>{post.readTime} min</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex gap-1">
                    <Link href={`/admin/posts/${post.slug}/edit`} className="btn-ghost text-xs py-0.5">Editar</Link>
                    <DeleteButton slug={post.slug} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
