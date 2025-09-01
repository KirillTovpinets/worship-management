import { redirect } from "next/navigation";

export default async function CatchAllPage() {
  // Redirect to dashboard
  redirect("/dashboard");
}
