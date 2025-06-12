import { Separator } from "@/components/ui/separator";
import { whyDifferent } from "./aboutUtils";
import {
  DescriptiveItem,
  FeatureGridInteractive,
  HowItWorksSmooth,
  SectionHeader,
} from "./aboutComponents";
import { useEffect, useState } from "react";
import { storage } from "@/storage/main";
import NewUserSetupDialog from "./userSetup";
import { enqueueJob } from "@/lib/jobQueue";

export default function About() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchSources = async () => {
      const sources = await storage.getAllSources();
      if (sources.length == 0) {
        setDialogOpen(true);
      }
    };
    fetchSources();
  }, []);

  const handleSetupComplete = () => {
    enqueueJob({
      workerKey: "syncOnOpen",
      titlePending: "Syncing Data",
      titleFinished: "Sync Finished",
    });
    window.location.reload();
  };

  const onFileUploaded = (contents: string) => {
    setDialogOpen(false);
    enqueueJob({
      workerKey: "dataImporter",
      titleFinished: "Import Finished",
      titlePending: "Importing Data",
      extraParams: {
        importData: contents,
      },
    });
    enqueueJob({
      workerKey: "syncOnOpen",
      titlePending: "Syncing Data",
      titleFinished: "Sync Finished",
    });
  };

  return (
    <div className="min-h-[100dvh] w-full mx-auto flex flex-col">
      <Separator className="mt-8" />
      <p className="text-6xl md:text-8xl lg:text-9xl p-4 font-extrabold text-center select-none">
        About TABN
      </p>
      <Separator className="mb-8" />
      <div className="w-[95%] mx-auto h-[500px] grid grid-cols-3 grid-rows-3 gap-4 overflow-hidden rounded-lg shadow-xl">
        <div className="col-span-3 relative row-span-2 lg:col-span-2 lg:row-span-3">
          <DescriptiveItem
            src="./bg1.jpg"
            alt="Your Personal Tech Feed"
            title="Your Personal Tech Feed"
            description="Build your own feed from your favorite sources and bring all your updates together in one place."
          />
        </div>
        <div className="col-span-1 row-span-1">
          <DescriptiveItem
            src="./bg2.jpg"
            alt="RSS Management"
            title="RSS"
            description="Manage your RSS sources"
          />
        </div>
        <div className="col-span-1 row-span-1">
          <DescriptiveItem
            src="./bg3.jpg"
            alt="Swipe News UI"
            title="Swipe UI"
            description="Interactive and simple Swipe interface"
          />
        </div>
        <div className="col-span-1 row-span-1">
          <DescriptiveItem
            src="./bg4.jpg"
            alt="Custom Refresh"
            title="Auto Refresh"
            description="Light-weight client side auto refresh"
          />
        </div>
      </div>
      <SectionHeader
        title="Why another RSS aggreator ?"
        description="Simple, lightweight, and crafted for you."
      />
      <FeatureGridInteractive items={whyDifferent} />
      <SectionHeader
        title="How TABN Works ?"
        description="From adding sources to fetching fresh updates all at one place."
        className="!mt-8"
      />
      <HowItWorksSmooth />
      <NewUserSetupDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onSetupComplete={handleSetupComplete}
        onFileUploaded={onFileUploaded}
      />
    </div>
  );
}
