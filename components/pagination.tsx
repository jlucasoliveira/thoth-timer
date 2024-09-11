"use client";
import {
  Pagination as UiPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  page: number;
  pages: number;
};

const MAX_PAGES = 7;
const GROUP_PAGE = 2;
const SEPARATOR = "...";

function createPagesNumber(page: number, pages: number) {
  const pagesItems = [];
  if (page - GROUP_PAGE > 2) {
    pagesItems.push("1");
    if (pages > MAX_PAGES) {
      pagesItems.push(SEPARATOR);
    }
    Array.from({ length: GROUP_PAGE }).forEach((_, i) =>
      pagesItems.push((page - (GROUP_PAGE - i)).toString()),
    );
  } else {
    Array.from({ length: page - 1 }).forEach((_, i) => {
      pagesItems.push((i + 1).toString());
    });
  }
  pagesItems.push(page.toString());
  const temp = page + 1 + GROUP_PAGE;
  if (temp < pages) {
    Array.from({ length: GROUP_PAGE }).forEach((_, i) =>
      pagesItems.push((page + 1 + i).toString()),
    );
    if (temp !== pages) pagesItems.push(SEPARATOR);
  } else {
    const diff = pages - page - 1;
    Array.from({ length: diff }).forEach((_, i) =>
      pagesItems.push(page + 1 + i),
    );
  }
  pagesItems.push(pages.toString());

  return pagesItems;
}

export function Pagination({ page, pages: numPages }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pages =
    numPages <= MAX_PAGES
      ? Array.from({ length: numPages }, (_, i) => (i + 1).toString())
      : createPagesNumber(page, numPages);

  if (numPages === 1) return null;

  return (
    <UiPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={page === 1 ? (e) => e.preventDefault() : undefined}
            href={{
              pathname,
              query: {
                ...Object.fromEntries(searchParams.entries()),
                page: page === 1 ? 1 : page - 1,
              },
            }}
          />
        </PaginationItem>
        {pages.map((currentPage, idx) => (
          <PaginationItem key={currentPage + idx.toString()}>
            {currentPage === SEPARATOR ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={currentPage === page.toString()}
                href={{
                  pathname,
                  query: {
                    ...Object.fromEntries(searchParams.entries()),
                    page: currentPage,
                  },
                }}
              >
                {currentPage}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        {numPages > MAX_PAGES ? (
          <PaginationItem>
            <PaginationNext
              onClick={
                page === numPages ? (e) => e.preventDefault() : undefined
              }
              href={{
                pathname,
                query: {
                  ...Object.fromEntries(searchParams.entries()),
                  page: page === numPages ? page : page + 1,
                },
              }}
            />
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </UiPagination>
  );
}
