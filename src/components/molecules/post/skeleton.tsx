import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight } from "lucide-react";

export default function PostSkeleton({
  variant = "default",
  className,
}: {
  variant?: "default" | "compact";
  className?: string;
}) {
  return (
    <Card
      className={
        `w-full overflow-hidden !p-0  flex ${
          variant === "compact"
            ? "flex-col h-[400px] md:flex-row md:h-[200px] "
            : "flex-col min-h-[400px] "
        }` + className
      }
    >
      <div
        className={`${
          variant === "compact"
            ? "md:w-[50%] mb-4 md:mr-0 md:mb-0"
            : "h-[50%] mb-0"
        } overflow-hidden`}
      >
        <Skeleton
          className={`${
            variant === "compact"
              ? "h-[200px] w-full md:h-[200px]"
              : "w-full h-[244px]"
          } object-cover`}
        />
      </div>
      <div
        className={`flex gap-4 box-border p-4 flex-col ${
          variant === "compact" ? "md:w-[50%]" : "w-[100%]"
        } max-h-[100%]`}
      >
        <Skeleton
          className={`h-4 w-1/4 ${
            variant === "compact" ? "text-sm" : "text-md"
          }`}
        />
        <div className="flex flex-row justify-between">
          <Skeleton className="h-6 w-3/4" />
          <ArrowUpRight size={24} className="text-muted" />
        </div>
        <Skeleton
          className={`${variant === "compact" ? "h-4 w-full" : "h-6 w-5/6"}`}
        />
        <div className="flex flex-row gap-4">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-12" />
        </div>
      </div>
    </Card>
  );
}
