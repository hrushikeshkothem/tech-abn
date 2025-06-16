import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarGroupLabel } from "@/components/ui/sidebar";
import { useResourceFetcher } from "@/hooks/useResourceFetcher";
import { enqueueJob } from "@/lib/jobQueue";
import { storage } from "@/storage/main";
import type { Sample_Source } from "@/types/general";
import { addSourceSchema } from "@/utils/formSchemes";
import { Plus, ChevronDown, ChevronUp, Sparkles, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddSourceDialog = ({
  fetchLocalSources,
}: {
  fetchLocalSources: () => void;
}) => {
  const [sourceName, setSourceName] = useState("");
  const [rssUrl, setRssUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [previewGradient, setPreviewGradient] = useState("");
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [isOpen, setIsOpen] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const { sources, fetchAllSources, samepleSource, fetchSamplesSources } = useResourceFetcher();

  const router = useNavigate();

  useEffect(() => {
    fetchAllSources();
    fetchSamplesSources();
  }, []);

  // Check if a sample RSS source is already added
  const isSourceAlreadyAdded = (sampleUrl: string) => {
    return (
      sources?.some(
        (source) => source.url.toLowerCase() === sampleUrl.toLowerCase()
      ) || false
    );
  };

  const generatePreviewGradient = () => {
    // if (!sourceName) return;
    const gradientClasses = [
      "bg-gradient-to-br from-red-500 to-pink-500",
      "bg-gradient-to-br from-pink-500 to-rose-500",
      "bg-gradient-to-br from-orange-400 to-red-600",
      "bg-gradient-to-br from-yellow-400 to-orange-500",
      "bg-gradient-to-br from-lime-400 to-green-500",
      "bg-gradient-to-br from-green-400 to-teal-500",
      "bg-gradient-to-br from-teal-400 to-cyan-500",
      "bg-gradient-to-br from-sky-400 to-blue-600",
      "bg-gradient-to-br from-blue-500 to-indigo-600",
      "bg-gradient-to-br from-indigo-500 to-purple-600",
      "bg-gradient-to-br from-purple-500 to-fuchsia-600",
      "bg-gradient-to-br from-fuchsia-500 to-pink-600",
      "bg-gradient-to-br from-rose-400 to-red-500",
      "bg-gradient-to-br from-gray-400 to-gray-700",
      "bg-gradient-to-br from-zinc-400 to-neutral-600",
    ];
    const randomGradient =
      gradientClasses[Math.floor(Math.random() * gradientClasses.length)];
    setPreviewGradient(randomGradient);
  };

  const generateUniqueId = () =>
    Date.now() + "_" + Math.random().toString(36).substr(2, 9);

  const handleSampleClick = (sample: Sample_Source) => {
    // Prevent clicking on already added sources
    if (isSourceAlreadyAdded(sample.url)) {
      return;
    }

    setSourceName(sample.title);
    setRssUrl(sample.url);
    setBannerUrl(sample.banner_url);
    generatePreviewGradient();
    setShowSamples(false);
    setErrors({});
  };

  const handleAddSource = async () => {
    const result = addSourceSchema.safeParse({ sourceName, rssUrl, bannerUrl });

    if (!result.success) {
      const fieldErrors: { [k: string]: string } = {};
      for (const err of result.error.errors) {
        fieldErrors[err.path[0]] = err.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const uniqueId = generateUniqueId();
    await storage.addSource({
      id: uniqueId,
      name: sourceName,
      url: rssUrl,
      gradient: previewGradient,
      createdAt: new Date().toISOString(),
      bannerUrl: bannerUrl,
      refreshInterval: 24,
    });

    const { server, relaxation } = await storage.getAdvancedOptions();
    fetchLocalSources();
    setSourceName("");
    setRssUrl("");
    setBannerUrl("");
    setPreviewGradient("");

    enqueueJob({
      workerKey: "syncOnOpen",
      titlePending: "Syncing Data",
      titleFinished: "Sync Finished",
      extraParams: { proxyServer: server, relaxation },
    });

    router(`/sources/${uniqueId}`);
    setIsOpen(false);
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <SidebarGroupLabel className="flex justify-between items-center">
        <span>News sources</span>
        <DialogTrigger onClick={() => setIsOpen(true)}>
          <Plus className="cursor-pointer" />
        </DialogTrigger>
      </SidebarGroupLabel>
      <DialogContent className="max-w-[95vw] px-1 md:px-8  md:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Source</DialogTitle>
          <DialogDescription>
            Enter the details of the RSS feed you want to add.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid gap-4 py-4">
          {previewGradient !== "" && <div className={`grid grid-cols-4 items-center gap-4`}>
            <label className="text-right">Preview</label>
            <div className="col-span-3 flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full ${previewGradient}`}
                title="Source icon preview"
              />
              <span className="text-sm text-muted-foreground">
                This will be your source icon
              </span>
            </div>
          </div>}

          {/* Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
              Name
            </label>
            <div className="col-span-3">
              <Input
                id="name"
                value={sourceName}
                onChange={(e) => {
                  setSourceName(e.target.value);
                  if (e.target.value) generatePreviewGradient();
                }}
                placeholder="Source name"
              />
              {errors.sourceName && (
                <p className="text-sm text-red-500">{errors.sourceName}</p>
              )}
            </div>
          </div>

          {/* RSS URL */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="url" className="text-right">
              RSS URL
            </label>
            <div className="col-span-3">
              <Input
                id="url"
                value={rssUrl}
                onChange={(e) => setRssUrl(e.target.value)}
                placeholder="https://example.com/feed.xml"
              />
              {errors.rssUrl && (
                <p className="text-sm text-red-500">{errors.rssUrl}</p>
              )}
            </div>
          </div>
 
          {/* Banner URL */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="bannerUrl" className="text-right">
              Banner URL
            </label>
            <div className="col-span-3">
              <Input
                id="bannerUrl"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://example.com/feed.png"
              />
              {errors.bannerUrl && (
                <p className="text-sm text-red-500">{errors.bannerUrl}</p>
              )}
            </div>
          </div>
        </div>

        {/* RSS Samples Section */}
        <div className="space-y-3">
          <Separator />
          <div className="flex items-center justify-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowSamples(!showSamples)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <Sparkles className="w-4 h-4 group-hover:text-yellow-500 transition-colors" />
              Try Sample RSS Feeds
              {showSamples ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>

          {showSamples && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <div className="bg-muted/30 rounded-lg p-4 border border-dashed border-muted-foreground/20">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted-foreground">
                    Click any sample below to auto-fill the form
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Available
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                      Already added
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  {samepleSource.map((sample, index) => {
                    const imgSource = sample.banner_url;
                    const isAlreadyAdded = isSourceAlreadyAdded(sample.url);

                    return (
                      <div
                        key={index}
                        onClick={() => handleSampleClick(sample)}
                        className={`flex items-center gap-3 p-3 rounded-md transition-all duration-200 border ${
                          isAlreadyAdded
                            ? "bg-muted/50 opacity-50 cursor-not-allowed border-muted/50"
                            : "bg-card hover:bg-accent cursor-pointer border-transparent hover:border-border group hover:scale-[1.01]"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <div
                            className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center transition-colors ${
                              isAlreadyAdded
                                ? "bg-muted-foreground/20"
                                : "bg-primary/10 group-hover:bg-primary/20"
                            }`}
                          >
                            <img
                              src={imgSource}
                              className={`w-6 h-6 object-cover ${
                                isAlreadyAdded ? "grayscale" : ""
                              }`}
                              alt={sample.title}
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-sm font-medium transition-colors ${
                                isAlreadyAdded
                                  ? "text-muted-foreground"
                                  : "group-hover:text-primary"
                              }`}
                            >
                              {sample.title}
                            </h4>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                isAlreadyAdded
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              {sample.category}
                            </span>
                          </div>
                          <p
                            className={`text-xs truncate mt-0.5 ${
                              isAlreadyAdded
                                ? "text-muted-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {sample.url}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex items-center">
                          {isAlreadyAdded ? (
                            <div className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-muted-foreground">
                                Added
                              </span>
                            </div>
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Show count of available vs added sources */}
                <div className="mt-4 pt-3 border-t border-muted-foreground/10">
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span>
                      {
                        samepleSource.filter(
                          (s) => !isSourceAlreadyAdded(s.url)
                        ).length
                      }{" "}
                      available
                    </span>
                    <span>•</span>
                    <span>
                      {
                        samepleSource.filter((s) =>
                          isSourceAlreadyAdded(s.url)
                        ).length
                      }{" "}
                      already added
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />
        <DialogFooter>
          <Button
            type="button"
            className="px-3 py-2 rounded-lg cursor-pointer bg-primary text-white"
            onClick={handleAddSource}
          >
            Add Source
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSourceDialog;
