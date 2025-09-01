import { redirect } from "next/navigation";

export default function NotFound() {
  // Redirect all 404 routes to dashboard
  redirect("/dashboard");
}
