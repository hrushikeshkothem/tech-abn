import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { storage } from "@/storage/main";
import { type PostVariant, type TypePost } from "@/types/general";
import {
  ArrowUpRight,
  Download,
  Ellipsis,
  FlagIcon,
  Rocket,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export default function SourceCard({
  variant = "default",
  title,
  shortDescription,
  className = "",
  href,
  deleteEnabled = false,
  imageUrl,
  status,
  views,
  followers,
  gradient,
  id = "",
}: TypePost & { variant?: PostVariant } & { className?: string } & {
  href: string;
  status: boolean;
  views: number;
  followers: number;
} & { deleteEnabled?: boolean }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleStatusChange = async () => {
    await storage.updateSource(id, { active: !status });
    window.location.reload();
  };

  return (
    <Card
      className={`w-full overflow-hidden p-0 flex flex-col gap-0 ${
        variant === "compact"
          ? "flex-col h-[400px] md:flex-row md:h-[200px]"
          : "flex-col max-h-[400px]"
      } ${className}`}
    >
      <div
        className={`${
          variant === "compact"
            ? "md:w-[50%] mb-4 md:mr-0 md:mb-0"
            : "h-[180px] mb-0"
        } overflow-hidden p-0 relative`}
      >
        <div className={`absolute inset-0 ${gradient} opacity-60`}></div>
        <div className="absolute top-4 left-4 cursor-pointer">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Badge
                variant="default"
                className={`text-xs cursor-pointer w-fit ${
                  status ? "bg-secondary" : "bg-red-500"
                }`}
              >
                <p className="text-secondary-foreground">
                  {status ? "Active" : "Inactive"}
                </p>
              </Badge>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {status ? "Deactivate Source?" : "Reactivate Source?"}
                </DialogTitle>
                <DialogDescription>
                  {status
                    ? "On changing the active state to inactive, you won't get any updates from this source anymore and all existing posts will be hidden."
                    : "Reactivating this source will resume updates and show all associated posts again."}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleStatusChange();
                    setDialogOpen(false);
                  }}
                >
                  {status ? "Deactivate" : "Reactivate"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="absolute top-4 right-4 cursor-pointer">
              <Ellipsis size={24} className="text-white" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex flex-row gap-4">
                <FlagIcon />
                <span>Report</span>
              </DropdownMenuItem>
              {deleteEnabled && (
                <DropdownMenuItem className="flex flex-row gap-4">
                  <Trash2 />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={`${variant === "compact" ? "md:w-[50%]" : "w-[100%]"}`}>
        <a
          href={href}
          className="p-4 flex flex-col gap-4 box-border max-h-[100%] cursor-pointer"
        >
          <div className="flex flex-row justify-between gap-2 items-center">
            <Avatar className="w-12 h-12 rounded-full bg-slate-900 bg-opacity-80 p-2">
              <AvatarImage src={imageUrl} className="rounded-full" />
            </Avatar>
            <p className="text-xl font-semibold">{title}</p>
            <ArrowUpRight
              size={24}
              className="transform transition-transform duration-300 hover:scale-125 hover:text-primary"
            />
          </div>
          <p
            className={`${
              variant === "compact"
                ? "text-sm line-clamp-1"
                : "text-md line-clamp-2"
            } overflow-ellipsis w-[100%] font-normal text-muted-foreground`}
          >
            {shortDescription}
          </p>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2 justify-center items-center">
              <Rocket size={16} /> {views}
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
              <Download size={16} /> {followers}
            </div>
          </div>
        </a>
      </div>
    </Card>
  );
}
