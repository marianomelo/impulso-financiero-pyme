"use client";

import { deletePostAction } from "@/lib/actions";

export function DeleteButton({ slug }: { slug: string }) {
  return (
    <form
      action={deletePostAction}
      onSubmit={(e) => {
        if (!confirm("Eliminar esta publicacion?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="btn-ghost text-red-500 text-xs py-0.5 hover:bg-red-50"
        onClick={(e) => e.stopPropagation()}
      >
        Eliminar
      </button>
    </form>
  );
}
