import {
  Cog,
  DownloadIcon,
  Ellipsis,
  Home,
  InfoIcon,
  Newspaper,
  RefreshCwIcon,
  RssIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { storage } from "@/storage/main";
import AddSourceDialog from "./addSourceDialog";
import ExportBackupDialog from "./exportDataDialog";
import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { enqueueJob } from "@/lib/jobQueue";
import { useToast } from "@/hooks/useToast";

const NavItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Saved",
    url: "/saved",
    icon: Newspaper,
  },
  {
    title: "About",
    url: "/about",
    icon: InfoIcon,
  },
];

const SettingsItems = [
  {
    title: "Download Data",
    url: "/data-exporter",
    icon: DownloadIcon,
    dialog: ExportBackupDialog,
  },
  {
    title: "Preferences",
    url: "/preferences",
    icon: Cog,
  },
];

type Resources = {
  gradient: string;
  id: string;
  rss_url: string;
  title: string;
  description: string;
  icon_url: string;
  is_active: boolean;
  followers_count: number;
  views_count: number;
}[];

export function AppSidebar() {
  const [data, setData] = useState<Resources>([]);
  const initialized = useRef(false);
  const { toast } = useToast();

  const fetchLocalSources = async () => {
    const sources = await storage.getSources();
    const formattedSources: Resources = sources.map((source: any) => ({
      id: source.id,
      rss_url: source.url,
      title: source.name,
      description: "",
      icon_url: "",
      is_active: true,
      followers_count: 0,
      views_count: 0,
      gradient: source.gradient,
    }));
    setData(formattedSources);
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchLocalSources();
    }
  }, []);

  return (
    <Sidebar>
      <SidebarContent className="bg-background z-[9999]">
        <SidebarHeader>
          <a
            href="/"
            className="flex flex-row justify-center items-center gap-3 h-[90px]"
          >
            <img src="/logo.png" alt="Logo" width={40} height={40} />
            <p className="font-mono text-3xl">Tech ABN</p>
          </a>
        </SidebarHeader>
        <Separator />
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        <SidebarGroup>
          <AddSourceDialog fetchLocalSources={fetchLocalSources} />
          {data.length > 0 && (
            <SidebarGroupContent>
              <SidebarMenu>
                {data.map(
                  (item, index) =>
                    index < 10 && (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton asChild>
                          <a href={`/sources/${item.id}`}>
                            <div
                              className={`w-6 h-6 rounded-full ${item.gradient} flex items-center justify-center`}
                            >
                              <RssIcon className="w-4 h-4 text-white" />
                            </div>
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                )}
                {data.length > 10 && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/sources">
                        <Ellipsis />
                        <span>More</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
        <Separator />
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SettingsItems.map((item) => (
                <SidebarMenuItem className="cursor-pointer">
                  <SidebarMenuButton asChild>
                    {item.dialog ? (
                      <a>
                        <Dialog>
                          <DialogTrigger className=" !p-0 flex flex-row gap-2">
                            <item.icon className="w-4 h-4 mt-auto mb-auto" />
                            <span>{item.title}</span>
                          </DialogTrigger>
                          <item.dialog />
                        </Dialog>
                      </a>
                    ) : (
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter>
          <Button
            variant="outline"
            onClick={async() => {
              const { server, relaxation } = await storage.getAdvancedOptions();
              enqueueJob({
                workerKey: "syncOnOpen",
                titlePending: "Syncing Data",
                titleFinished: "Sync Finished",
                extraParams: {
                  skipCheck: true,
                  proxyServer: server,
                  relaxation: relaxation
                },
              });
              toast({
                title: "Updating All feeds",
                description:
                  "A new Sync Job without refresh interval check for all sources is added",
                duration: 1000,
              });
            }}
            className="w-full cursor-pointer"
          >
            <RefreshCwIcon />
            <span>Update Feeds</span>
          </Button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
