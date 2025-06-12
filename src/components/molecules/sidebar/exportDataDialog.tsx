import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { enqueueJob } from "@/lib/jobQueue";
import { useToast } from "@/hooks/useToast";

const ExportBackupDialog = () => {
  const [exportSources, setExportSources] = useState(true);
  const [exportSavedPosts, setExportSavedPosts] = useState(true);
  const [exportFeeds, setExportFeeds] = useState(false);
  const { toast } = useToast();
  const handleExport = async () => {
    enqueueJob({
      workerKey: "dataExporter",
      extraParams: {
        exportSources,
        exportSavedPosts,
        exportFeeds,
      },
      titlePending: "Exporting Data",
      titleFinished: "Export Completed",
    });
    toast({
      title: "Job Added successfully!",
      description: "The Data Export job is added to queue",
      duration: 1000,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Export Backup</DialogTitle>
        <DialogDescription>
          Choose which data to export.
          <br />
          <span className="text-sm text-muted-foreground">
            Feeds can be exported only if sources are included.
          </span>
        </DialogDescription>
      </DialogHeader>
      <Separator />
      <div className="grid gap-4 py-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sources"
            checked={exportSources}
            onCheckedChange={(checked) => {
              const value = !!checked;
              setExportSources(value);
              if (!value) setExportFeeds(false);
            }}
          />
          <label htmlFor="sources">Sources</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="saved_posts"
            checked={exportSavedPosts}
            onCheckedChange={(checked) => setExportSavedPosts(!!checked)}
          />
          <label htmlFor="saved_posts">Saved Posts</label>
        </div>
        <div
          className={`flex items-center space-x-2 ${
            !exportSources ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Checkbox
            id="feeds"
            checked={exportFeeds}
            disabled={!exportSources}
            onCheckedChange={(checked) => {
              if (exportSources) setExportFeeds(!!checked);
            }}
          />
          <label htmlFor="feeds">Feeds</label>
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            onClick={handleExport}
            disabled={!exportSources && !exportSavedPosts}
          >
            Export Now
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default ExportBackupDialog;
