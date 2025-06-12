import { Separator } from "@/components/ui/separator";
import PostSkeleton from "@/components/molecules/post/skeleton";

export default function Loading() {
  return (
    <div className="min-h-[100dvh] max-w-full mx-auto flex flex-col">
      <Separator className="mt-8" />
      <p className="text-6xl md:text-8xl lg:text-9xl min-h-[80px] p-4 font-semibold text-center">
      </p>
      <Separator className="mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-8 pt-4">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="row-span-2  md:row-span-1 lg:row-span-1">
              <PostSkeleton variant="default" />
            </div>
          ))}
      </div>
    </div>
  );
}
