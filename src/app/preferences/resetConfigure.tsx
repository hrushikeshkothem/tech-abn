import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { enqueueJob } from "@/lib/jobQueue";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";

const ResetConfigure = ({
  setPreferences,
  setHasChanges,
}: {
  setPreferences: (x: any) => void;
  setHasChanges: (x: boolean) => void;
}) => {
  const { toast } = useToast();

  const resetPreferences = () => {
    setPreferences({
      theme: "system",
      feedbackAudio: true,
      proxyServer: "https://rss.tabn.hrushispace.com/?url=",
      retentionPeriod: "30",
      relaxationTime: "1",
    });
    setHasChanges(true);
    toast({
      title: "Preferences Reset",
      description: "Settings have been reset to defaults.",
    });
  };

  const flushAllData = async () => {
    try {
      enqueueJob({
        workerKey: "cleanUpSync",
        titlePending: "CleanUp Data",
        titleFinished: "CleanUp Finished",
        extraParams: {
          hardClean: true,
        },
      });
      toast({
        title: "Data Flushing",
        description: "All RSS posts will be deleted.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error flushing data:", error);
      toast({
        title: "Error Flushing Data",
        description: "Some data may not have been deleted.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">
          Reset Preferences
        </h4>
        <p className="text-sm text-muted-foreground">
          Reset all settings to their default values
        </p>
        <Button
          variant="outline"
          onClick={resetPreferences}
          className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/20"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Settings
        </Button>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-red-700 dark:text-red-400">
          Delete All Posts
        </h4>
        <p className="text-sm text-muted-foreground">
          Permanently delete all RSS feeds and data
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Flush All Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span>Are you absolutely sure?</span>
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all
                posts from your device.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={flushAllData}
                className="bg-red-500 hover:bg-red-600"
              >
                Yes, delete everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ResetConfigure;
