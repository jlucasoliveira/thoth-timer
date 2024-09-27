"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const storageKey = "@timer:digest-request-id";

export function Notifications() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const digest = searchParams.get("digest");
  const message = searchParams.get("message");

  useEffect(() => {
    const currentDigest = localStorage.getItem(storageKey);
    if (type && message && digest && digest !== currentDigest) {
      localStorage.setItem(storageKey, digest);
      toast({
        title: decodeURIComponent(message),
        variant: type === "error" ? "destructive" : "default",
      });
    }
    return () => {
      localStorage.removeItem(storageKey);
    }
  }, [type, message, digest]);

  return null;
}
