import { Separator } from "@/components/ui/separator";
import SectionHeader from "@/components/molecules/sectionHeader";
import SourceCard from "@/components/molecules/sourceCard";
import { useEffect } from "react";
import { useResourceFetcher } from "@/hooks/useResourceFetcher";
import Loading from "./loading";
import GlobalError from "../globalError";

export default function Sources() {
  const { sources, fetchAllSources, isLoading, error } = useResourceFetcher();

  useEffect(() => {
    fetchAllSources();
  }, []);

  if (isLoading) return <Loading />;
  if (error) return <GlobalError error={error} />;

  return (
    <div className="min-h-[100dvh] max-w-full mx-auto flex flex-col">
      <Separator className="mt-8" />
      <p className="text-6xl md:text-8xl lg:text-9xl p-4 font-semibold text-center">
        Sources
      </p>
      <Separator className="mb-8" />
      <SectionHeader
        className="mt-8 px-4"
        title="Default Sources"
        btnText=""
        btnLink="/blogs"
      />
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-2 gap-4 w-full px-8 pt-8 pb-8`}
      >
        {sources.map((resource: any, index: number) => (
          <SourceCard
            href={`/sources/${resource.id}`}
            key={index}
            author={"#"}
            title={resource.name}
            shortDescription={
              "For now let this is be a placeholder field, my inital idea is to have a description of the source"
            }
            imageUrl={resource.bannerUrl}
            variant="default"
            tags={[]}
            date=""
            views={resource.views_count}
            followers={resource.followers_count}
            status={resource.active || false}
            gradient={resource.gradient}
            id={resource.id}
          />
        ))}
      </div>
    </div>
  );
}
