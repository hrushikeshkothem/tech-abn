import Header from "@/components/molecules/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/molecules/sidebar";
import { Toaster } from "@/components/ui/toaster";
import "@fontsource/inter/400.css";
import "@fontsource/inter/400-italic.css";
import "../index.css";
import { ThemeProvider } from "../utils/themeProvider";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { enqueueJob } from "@/lib/jobQueue";
import WorkerManager from "@/workers/manager";
import Footer from "@/components/molecules/footer";
import { storage } from "@/storage/main";

export default function RootLayout() {
  const jobTrigger = async () => {
    const { server, retention, relaxation } =
      await storage.getAdvancedOptions();
    enqueueJob({
      workerKey: "syncOnOpen",
      titlePending: "Syncing Data",
      titleFinished: "Sync Finished",
      extraParams: {
        proxyServer: server,
        relaxation: relaxation, 
        refresh: false
      },
    });
    enqueueJob({
      workerKey: "cleanUpSync",
      titlePending: "CleanUp Data",
      titleFinished: "CleanUp Finished",
      extraParams: {
        retention: retention,
      },
    });
  };
  useEffect(() => {
    if (sessionStorage.getItem("sessionSync") != "true") {
      jobTrigger();
    }
  }, []);
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-10">
              <div className="col-span-10 max-h-[100dvh] overflow-scroll">
                <div className="top-0 left-0 z-50 bg-background">
                  <Header />
                </div>
                <Outlet />
                <WorkerManager />
                <Footer />
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  );
}
