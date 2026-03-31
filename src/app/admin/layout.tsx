import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated();

  return (
    <div className="max-w-[680px] mx-auto px-6 py-6 w-full">
      {authed && (
        <nav className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm font-semibold text-fg">Posts</Link>
            <Link href="/admin/posts/new" className="btn-blue text-xs py-1.5 px-3">Escribir</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="btn-ghost text-xs" target="_blank">Ver blog</Link>
            <form action={logoutAction}>
              <button type="submit" className="btn-ghost text-xs">Salir</button>
            </form>
          </div>
        </nav>
      )}
      <div className="cb-in">{children}</div>
    </div>
  );
}
