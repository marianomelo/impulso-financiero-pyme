"use client";

import { useActionState, useState } from "react";
import { savePostAction } from "@/lib/actions";

interface Props {
  post?: {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    coverImage: string;
    videoUrl: string;
    content: string;
    published: boolean;
  };
}

export default function PostForm({ post }: Props) {
  const [state, action, pending] = useActionState(savePostAction, null);
  const [showSettings, setShowSettings] = useState(!!post);
  const isEdit = !!post;

  return (
    <form action={action}>
      {isEdit && <input type="hidden" name="originalSlug" value={post.slug} />}

      <input
        type="text"
        name="title"
        defaultValue={post?.title}
        required
        placeholder="Titulo del articulo"
        className="w-full bg-transparent border-none outline-none text-[2rem] font-bold leading-[1.15] tracking-tight placeholder:text-fg-tertiary mb-3"
      />

      <input
        type="text"
        name="excerpt"
        defaultValue={post?.excerpt}
        placeholder="Subtitulo o resumen breve..."
        className="w-full bg-transparent border-none outline-none text-lg text-fg-secondary placeholder:text-fg-tertiary leading-relaxed mb-6"
      />

      <div className="border-t border-border mb-4" />

      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={() => setShowSettings(!showSettings)} className="btn-ghost text-xs">
          Configuracion {showSettings ? "▲" : "▼"}
        </button>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" name="published" defaultChecked={post?.published ?? true} className="rounded accent-blue" />
          <span className="text-xs text-fg-secondary">Publicar</span>
        </label>
      </div>

      {showSettings && (
        <div className="bg-surface rounded-xl border border-border p-4 mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-xs text-fg-secondary w-24 shrink-0">Fecha</label>
            <input type="date" name="date" defaultValue={post?.date || new Date().toISOString().split("T")[0]} className="admin-input text-xs" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-fg-secondary w-24 shrink-0">Portada URL</label>
            <input type="text" name="coverImage" defaultValue={post?.coverImage} placeholder="URL de imagen" className="admin-input text-xs" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-fg-secondary w-24 shrink-0">Video URL</label>
            <input type="text" name="videoUrl" defaultValue={post?.videoUrl} placeholder="URL embed YouTube" className="admin-input text-xs" />
          </div>
        </div>
      )}

      {!showSettings && (
        <>
          <input type="hidden" name="date" value={post?.date || new Date().toISOString().split("T")[0]} />
          <input type="hidden" name="coverImage" value={post?.coverImage || ""} />
          <input type="hidden" name="videoUrl" value={post?.videoUrl || ""} />
          {(post?.published ?? true) && <input type="hidden" name="published" value="on" />}
        </>
      )}

      <textarea
        name="content"
        defaultValue={post?.content}
        rows={24}
        placeholder="Escribe tu articulo en Markdown..."
        className="w-full bg-transparent border-none outline-none text-[0.9375rem] leading-[1.75] resize-y min-h-[420px] placeholder:text-fg-tertiary"
      />

      {state?.error && <p className="text-sm text-red-500 mt-2">{state.error}</p>}

      <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
        <button type="submit" disabled={pending} className="btn-blue px-6 py-2">
          {pending ? "Guardando..." : isEdit ? "Guardar" : "Publicar"}
        </button>
        <a href="/admin" className="btn-ghost">Cancelar</a>
      </div>
    </form>
  );
}
