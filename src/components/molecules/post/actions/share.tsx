import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/useToast";
import { CopyIcon, Share2Icon } from "lucide-react";
import { useState } from "react";

export function ShareAction({
    href
}:{
    href:string
}) {
  const { toast } = useToast()
  const [ open, setOpen ] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Share2Icon size={24} className="cursor-pointer hover:text-primary" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Share link</AlertDialogTitle>
          <AlertDialogDescription className="text-md !mt-1">
            Anyone who has this link will be able to view this.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-row gap-2">
          <Input autoFocus value={href} />
          <Button onClick={async()=>{
            await navigator.clipboard.writeText(href); 
            toast({
                title: "Copied to clipboard",
                description: "Sharelink is copied to your clipboard :)",
                action: (
                    <ToastAction altText="Done">Done</ToastAction>
                ),
                duration: 1000
              })
              setOpen(false)
          }} variant={"default"}>
            <CopyIcon />
          </Button>
        </div>
        <AlertDialogFooter className="!flex-row !justify-start">
          <AlertDialogCancel className="!border-0 !w-auto !ml-0 bg-secondary">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ShareAction;
