import { useSession } from "next-auth/react";

interface RoleGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function RoleGuard({ children, fallback }: RoleGuardProps) {
  const { data: session } = useSession();
  if (session?.user?.role !== "ADMIN") {
    return fallback ?? null;
  }
  return children;
}
