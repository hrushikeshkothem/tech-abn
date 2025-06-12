import { Separator } from "@/components/ui/separator";
import PostSkeleton from "../components/molecules/post/skeleton";

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
      <Separator />
      <SectionHeader
        className="mt-8 px-4"
        title="Latest news"
        btnText="View all"
        btnLink="/blogs"
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
