"use client";

import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  // Generate breadcrumb items based on current path
  const breadcrumbItems = () => {
    if (!pathname) return [];

    const pathSegments = pathname.split("/").filter(Boolean);
    const items: Array<{ label: string; href?: string; current?: boolean }> =
      [];

    if (pathSegments[0] === "dashboard") {
      items.push({
        label: "Панель управления",
        href: "/dashboard",
      });

      if (pathSegments[1]) {
        switch (pathSegments[1]) {
          case "songs":
            items.push({
              label: "Песни",
              href: "/dashboard/songs",
            });

            if (pathSegments[2] && pathSegments[2] !== "import") {
              // For song detail pages, we'll show a generic label since we don't have the song title here
              items.push({
                label: "Детали песни",
                current: true,
              });
            } else {
              items[items.length - 1].current = true;
            }
            break;
          case "schedule":
            items.push({
              label: "Расписание",
              current: true,
            });
            break;
          case "users":
            items.push({
              label: "Пользователи",
              current: true,
            });
            break;
          default:
            if (items.length > 0) {
              items[items.length - 1].current = true;
            }
        }
      } else {
        items[0].current = true;
      }
    }

    return items;
  };
  return (
    <nav className="flex pb-3 pl-8" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems().map((item, index) => (
          <li key={index} className="flex items-center">
            {item.current ? (
              <span className="text-sm font-medium text-gray-900">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm text-gray-500">{item.label}</span>
            )}
            {index < breadcrumbItems().length - 1 && (
              <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-2" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
