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
import { enqueueJob } from "@/lib/jobQueue";
import { storage } from "@/storage/main";
import { addSourceSchema } from "@/utils/formSchemes";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddSourceDialog = ({ fetchLocalSources }: { fetchLocalSources: () => void }) => {
  const [sourceName, setSourceName] = useState("");
  const [rssUrl, setRssUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [previewGradient, setPreviewGradient] = useState("");
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [isOpen, setIsOpen] = useState(false);

  const router = useNavigate();

  const generatePreviewGradient = () => {
    if (!sourceName) return;
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
    const randomGradient = gradientClasses[Math.floor(Math.random() * gradientClasses.length)];
    setPreviewGradient(randomGradient);
  };

  const generateUniqueId = () => Date.now() + "_" + Math.random().toString(36).substr(2, 9);

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
    setIsOpen(false)
  };

  return (
    <Dialog onOpenChange={setIsOpen}  open={isOpen}>
      <SidebarGroupLabel className="flex justify-between items-center">
        <span>News sources</span>
        <DialogTrigger onClick={()=>setIsOpen(true)}>
          <Plus className="cursor-pointer" />
        </DialogTrigger>
      </SidebarGroupLabel>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Source</DialogTitle>
          <DialogDescription>
            Enter the details of the RSS feed you want to add.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid gap-4 py-4">
          {previewGradient && (
            <div className="grid grid-cols-4 items-center gap-4">
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
            </div>
          )}

          {/* Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">Name</label>
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
              {errors.sourceName && <p className="text-sm text-red-500">{errors.sourceName}</p>}
            </div>
          </div>

          {/* RSS URL */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="url" className="text-right">RSS URL</label>
            <div className="col-span-3">
              <Input
                id="url"
                value={rssUrl}
                onChange={(e) => setRssUrl(e.target.value)}
                placeholder="https://example.com/feed.xml"
              />
              {errors.rssUrl && <p className="text-sm text-red-500">{errors.rssUrl}</p>}
            </div>
          </div>

          {/* Banner URL */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="bannerUrl" className="text-right">Banner URL</label>
            <div className="col-span-3">
              <Input
                id="bannerUrl"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://example.com/feed.png"
              />
              {errors.bannerUrl && <p className="text-sm text-red-500">{errors.bannerUrl}</p>}
            </div>
          </div>
        </div>
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
