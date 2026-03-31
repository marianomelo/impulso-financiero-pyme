"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { savePost, deletePostFile, getPost, slugify } from "./posts";
import { createSessionToken, setSessionCookie, clearSessionCookie, isAuthenticated } from "./auth";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function loginAction(_prev: { error: string } | null, formData: FormData) {
  const password = formData.get("password") as string;
  if (password !== ADMIN_PASSWORD) {
    return { error: "Contraseña incorrecta" };
  }
  const token = createSessionToken();
  await setSessionCookie(token);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}

export async function savePostAction(_prev: { error: string } | null, formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string) || "";
  const excerpt = (formData.get("excerpt") as string)?.trim() || "";
  const coverImage = (formData.get("coverImage") as string)?.trim() || "";
  const videoUrl = (formData.get("videoUrl") as string)?.trim() || "";
  const published = formData.get("published") === "on";
  const date = (formData.get("date") as string) || new Date().toISOString().split("T")[0];
  const originalSlug = (formData.get("originalSlug") as string) || "";

  if (!title) return { error: "El título es obligatorio" };

  const slug = originalSlug || slugify(title);

  // Si cambió el slug y el nuevo ya existe, error
  if (!originalSlug) {
    const existing = getPost(slug);
    if (existing) return { error: "Ya existe un post con ese slug" };
  }

  savePost(slug, { title, date, excerpt, coverImage, videoUrl, published }, content);

  revalidatePath("/");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deletePostAction(formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const slug = formData.get("slug") as string;
  deletePostFile(slug);

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}
