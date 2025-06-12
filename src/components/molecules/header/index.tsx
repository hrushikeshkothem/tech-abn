import {
  BookAIcon,
  FrownIcon,
  Globe2Icon,
  KeyboardIcon,
  MenuIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useRef, useState } from "react";
import ThemeSwitcher from "./themeSwitcher";
import { storage } from "@/storage/main";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type SourceItem } from "@/storage/types";

type SearchResponse = {
  resources: {
    id: string;
    title: string;
  }[];
  posts: {
    link: string;
    title: string;
  }[];
  savedPosts: {
    link: string;
    title: string;
  }[];
};

export default function Header() {
  const sidebar = useSidebar();
  const router = useNavigate();

  const Sidebar = () => {
    sidebar.toggleSidebar();
  };

  const Search = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [result, setResult] = useState<SearchResponse>({
      resources: [],
      posts: [],
      savedPosts: [],
    });
    const fetchResult = async (searchTerm: string) => {
      const res = await storage.search(searchTerm);
      setResult({
        resources: res.sources,
        posts: res.posts,
        savedPosts: res.savedPosts,
      });
    };
    const Content = () => {
      return (
        <PopoverContent
          className="h-[300px] overflow-scroll"
          hideWhenDetached={false}
          onOpenAutoFocus={(e: Event) => e.preventDefault()}
          onCloseAutoFocus={(e: Event) => e.preventDefault()}
        >
          {result.resources.length > 0 && (
            <>
              <label className="text-muted-foreground text-sm">Sources</label>
              <div className="mt-4 flex flex-col gap-2">
                {result.resources.map((resource) => (
                  <a
                    href={`/sources/${resource.id}`}
                    key={resource.id}
                    className="flex flex-row gap-2 items-center"
                  >
                    <Globe2Icon size={22} />
                    <p className="text-md max-w-[80%] line-clamp-2">
                      {resource.title}
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
          {result.resources.length > 0 && result.posts.length > 0 && (
            <Separator className="my-4" />
          )}
          {result.posts.length > 0 && (
            <>
              <label className="text-muted-foreground text-sm">Posts</label>
              <div className="mt-4 flex flex-col gap-2">
                {result.posts.map((post) => (
                  <a
                    href={`${post.link}`}
                    key={post.link}
                    className="flex flex-row gap-2 items-center"
                  >
                    <BookAIcon size={22} />
                    <p className="text-md max-w-[80%] line-clamp-2">
                      {post.title}
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
          {result.posts.length > 0 && result.savedPosts.length > 0 && (
            <Separator className="my-4" />
          )}
          {result.savedPosts.length > 0 && (
            <>
              <label className="text-muted-foreground text-sm">
                Saved Posts
              </label>
              <div className="mt-4 flex flex-col gap-2">
                {result.savedPosts.map((post) => (
                  <a
                    href={`${post.link}`}
                    key={post.link}
                    className="flex flex-row gap-2 items-center"
                  >
                    <BookAIcon size={22} />
                    <p className="text-md max-w-[80%] line-clamp-2">
                      {post.title}
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
          {result.resources.length == 0 &&
            result.posts.length == 0 &&
            inputRef.current?.value !== undefined &&
            inputRef.current?.value.trim().length > 2 && (
              <div className="w-full h-full flex justify-center items-center flex-col gap-4">
                <FrownIcon size={40} />
                <p className="text-muted-foreground">No Results</p>
              </div>
            )}
          {result.resources.length == 0 &&
            result.posts.length == 0 &&
            (inputRef.current?.value === undefined ||
              inputRef.current?.value.trim().length <= 2) && (
              <div className="w-full h-full flex justify-center items-center flex-col gap-4">
                <KeyboardIcon size={40} />
                <p className="text-muted-foreground">Please type . . .</p>
              </div>
            )}
        </PopoverContent>
      );
    };
    return (
      <>
        <div className="flex justify-center items-center ml-auto lg:ml-0 w-full bg-slate-100 dark:bg-slate-900 p-2 rounded-md">
          <SearchIcon size={22} className="ml-2 cursor-pointer" />
          <Separator orientation="vertical" className="h-full ml-1" />
          <PopoverTrigger asChild>
            <Input
              type="text"
              ref={inputRef}
              placeholder="Search"
              onChange={(e) => {
                if (e.target.value.trim().length > 2) {
                  fetchResult(e.target.value);
                } else {
                  setResult({
                    resources: [],
                    posts: [],
                    savedPosts: [],
                  });
                }
              }}
              className="flex-1 focus:ring-0 border-0 bg-slate-100  dark:bg-slate-900 focus-visible:ring-0 shadow-none"
            />
          </PopoverTrigger>
        </div>
        <Content />
      </>
    );
  };

  const SidebarToggle = () => {
    return (
      <div
        onClick={Sidebar}
        className="!p-0 h-[30px] w-[30px] flex justify-center items-center"
      >
        {!sidebar.open ? (
          <MenuIcon size={22} />
        ) : (
          <>
            <XIcon size={22} className="hidden md:flex" />
            <MenuIcon size={22} className="md:hidden" />
          </>
        )}
      </div>
    );
  };

  const GenerateBreadCrumb = () => {
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split("/").filter(Boolean);
    const [sources, setSources] = useState<SourceItem[]>([]);

    const [sourceName, setSourceName] = useState<string | null>(null);

    const handleSourceId = async (sourceIndex: number) => {
      const sourceId = pathSegments[sourceIndex + 1];
      const fetchSources = await storage.getSources();
      setSources(fetchSources);
      const currentSource = fetchSources.filter(
        (source) => source.id == sourceId
      );
      setSourceName(currentSource[0].name);
    };

    useEffect(() => {
      const sourceIndex = pathSegments.findIndex((s) => s === "sources");
      if (sourceIndex !== -1 && pathSegments.length > sourceIndex + 1) {
        handleSourceId(sourceIndex);
      }
    }, [currentPath]);

    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          {pathSegments.map((segment, index) => {
            const isSourceId =
              pathSegments[index - 1] === "sources" &&
              segment.match(/^\d+_.+$/);
            const segmentPath =
              "/" + pathSegments.slice(0, index + 1).join("/");

            return (
              <div
                className="flex flex-row gap-2 items-center"
                key={segmentPath}
              >
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {!isSourceId && (
                    <BreadcrumbLink href={segmentPath}>
                      {segment.replace(/[-_]/g, " ")}
                    </BreadcrumbLink>
                  )}
                  {isSourceId && (
                    <Select
                      onValueChange={(e) => {
                        router(`/sources/${e}`);
                      }}
                    >
                      <SelectTrigger className="max-w-[200px] !bg-transparent !border-1 !rounded-3xl">
                        <SelectValue placeholder={sourceName} />
                      </SelectTrigger>
                      <SelectContent>
                        {sources.map((source) => (
                          <SelectItem key={source.id} value={source.id}>
                            {source.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </BreadcrumbItem>
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  return (
    <nav className="pt-4 pb-4">
      <Sheet>
        <div className="flex flex-col md:flex-row flex-wrap items-center justify-between max-w-full px-4">
          <div className="flex items-center mt-4 md:mt-0 md:justify-center gap-4 w-full md:w-auto">
            <SidebarToggle />
            <Separator orientation="vertical" className="hidden sm:block h-8" />
            <GenerateBreadCrumb />
          </div>
          <div className="flex items-center ml-auto lg:ml-0 gap-4 mt-4 sm:mt-0 w-full md:w-auto">
            <Popover>
              <Search />
            </Popover>
            <Separator orientation="vertical" className="hidden sm:block h-8" />
            <ThemeSwitcher />
            <Separator orientation="vertical" className="hidden sm:block h-8" />
          </div>
        </div>
      </Sheet>
    </nav>
  );
}
