import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type PostVariant, type TypePost } from "@/types/general";
import { ArrowUpRight } from "lucide-react";
import ShareAction from "./actions/share";
import SaveAction from "./actions/save";

export default function PostCard({
  variant = "default",
  imageUrl,
  title,
  shortDescription,
  tags,
  author,
  date,
  className = "",
  href,
  isSaved = false,
  id = "#",
}: TypePost & {
  variant?: PostVariant;
  className?: string;
  href: string;
  isSaved?: boolean;
  id?: string;
}) {
  const isCompact = variant === "compact";
  const source_id = window.location.pathname.split("/")[2];
  return (
    <Card
      className={
        `w-full gap-0 overflow-hidden p-0 flex ${
          isCompact
            ? "flex-col h-[400px] md:flex-row md:h-[200px]"
            : "flex-col min-h-[400px]"
        } ` + className
      }
    >
      <a
        href={href}
        target="_blank"
        className={`${
          isCompact ? "md:w-[50%] mb-4 md:mr-0 md:mb-0" : "max-h-[50%]"
        } overflow-hidden relative !pb-0`}
      >
        <div
          className={`relative w-full ${isCompact ? "h-[200px]" : "h-full"}`}
        >
          <img
            src={imageUrl}
            alt="Post preview"
            className={`
      object-cover w-[100%] h-[180px] rounded-none
      transition-transform duration-500 ease-in-out
      hover:scale-105
      ${!isCompact ? "rounded-b-md" : ""}
    `}
            loading="lazy"
          />
          {!isCompact && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          )}
        </div>
      </a>

      <div
        className={`${
          isCompact ? "md:w-[50%]" : "h-[60%] w-full"
        } flex mt-2 flex-col justify-between`}
      >
        <a href={href} className="px-4 pt-1 flex flex-col gap-2 cursor-pointer">
          <div className="flex flex-row justify-between">
            <p className={`text-primary ${isCompact ? "text-sm" : "text-md"}`}>
              {author} • {date}
            </p>
            <ArrowUpRight
              size={20}
              className="transition-transform duration-300 hover:scale-125 hover:text-primary mt-1"
            />
          </div>

          <div className="flex flex-row justify-between items-start">
            <p
              className={`${
                isCompact ? "text-sm line-clamp-1" : "text-md line-clamp-2"
              } text-lg font-semibold line-clamp-3`}
            >
              {title}
            </p>
          </div>
        </a>

        <p
          className={`${
            isCompact ? "text-sm line-clamp-1" : "text-md line-clamp-3"
          } px-4 text-muted-foreground max-h-[120px]`}
        >
          {shortDescription.replace(/<[^>]*>/g, "")}
        </p>
        <div className="flex flex-col mt-auto">
          <Separator className="mt-2 " />
          <div className="flex flex-row justify-around px-4 py-3">
            <ShareAction href={href} />
            <Separator orientation="vertical" className="h-[90%]" />
            <SaveAction
              saveData={{
                variant,
                imageUrl,
                title,
                shortDescription,
                tags,
                author,
                date,
                className,
                href,
                source_id,
                id,
              }}
              isSaved={isSaved}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
