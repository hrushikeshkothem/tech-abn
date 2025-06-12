import { Separator } from "@/components/ui/separator";
import PostSkeleton from "@/components/molecules/post/skeleton";

export default function Loading() {
  const SectionHeader = ({
    title,
    btnText,
    btnLink,
    className,
  }: {
    title: string;
    btnText: string;
    btnLink: string;
    className?: string;
  }) => {
    return (
      <div className={`flex justify-between px-8` + className}>
        <p className="text-xl font-semibold mt-8">{title}</p>
        <a
          href={btnLink}
          className="text-md cursor-pointer font-semibold mt-8 text-gray-400"
        >
          {btnText}
        </a>
      </div>
    );
  };
  return (
    <div className="min-h-[100dvh] mx-auto flex flex-col">
      <Separator className="mt-8" />
      <p className="text-6xl md:text-8xl lg:text-9xl p-4 font-semibold text-center">
        Saved Posts
      </p>
      <Separator className="mb-8" />
      <SectionHeader
        className="mt-8 px-4"
        title="Saved Blogs"
        btnText=""
        btnLink=""
      />
      <div className="grid gap-4 pt-8 px-8 w-full lg:grid-cols-4 lg:grid-rows-2 grid-cols-4 grid-rows-2">
        <div className="lg:col-span-2 lg:row-span-1 col-span-4 row-span-2">
          <PostSkeleton variant="compact" />
        </div>
        <div className="lg:col-span-2 lg:row-span-1 lg:col-start-3 lg:row-start-1 col-span-4 row-span-1">
          <PostSkeleton variant="compact" />
        </div>
        <div className="lg:col-span-2 lg:row-span-1 lg:col-start-3 lg:row-start-2 col-span-4 row-span-1">
          <PostSkeleton variant="compact" />
        </div>
        <div className="lg:col-span-2 lg:row-span-2 lg:row-start-0 col-span-4 row-span-2">
          <PostSkeleton variant="compact" />
        </div>
      </div>
      <SectionHeader
        className="mt-8 px-4"
        title="Saved News"
        btnText=""
        btnLink=""
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-2 gap-4 w-full px-8 pt-8 pb-8">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <PostSkeleton key={index} variant="default" />
          ))}
      </div>
    </div>
  );
}
