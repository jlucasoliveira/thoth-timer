import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full flex items-center justify-center">
      <LoaderCircle size="24" className="animate-spin" />
    </div>
  );
}
