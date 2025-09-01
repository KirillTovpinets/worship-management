import SongsView from "@/app/dashboard/songs/components/SongsView";

interface SongsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    styles?: string | string[];
    tags?: string | string[];
    natures?: string | string[];
    hasEvents?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function SongsPage({
  searchParams: params,
}: SongsPageProps) {
  return <SongsView searchParams={params} />;
}
