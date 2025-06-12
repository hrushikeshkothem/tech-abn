import { type PostVariant, type TypePost } from "@/types/general";
import PostCard from "./post";

const CustomPost = ({
  data,
  variant,
  className,
  href = "/blogs/123",
  isSaved = false,
}: {
  data: TypePost;
  variant: PostVariant;
  className?: string;
  href?: string;
  isSaved?: boolean;
}) => {
  return (
    <>
      <PostCard
        variant={variant}
        imageUrl={data.imageUrl}
        title={data.title}
        shortDescription={data.shortDescription}
        tags={data.tags}
        author={data.author}
        date={data.date}
        className={className}
        href={href}
        isSaved={isSaved}
        id={data.id}
      />
    </>
  );
};

export default CustomPost;
