import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import PostForm from "@/components/PostForm";

export default async function NewPostPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  return <PostForm />;
}
