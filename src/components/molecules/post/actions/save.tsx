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
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/useToast";
import { storage } from "@/storage/main";
import IDgenerator from "@/utils/IDgen";
import { Download, Trash2 } from "lucide-react";
import { useState } from "react";

export function SaveAction({
  saveData,
  isSaved,
}: {
  saveData: any;
  isSaved: boolean;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const SaveFlow = () => {
    const handleSave = async () => {
      saveData.id = IDgenerator();
      await storage.savePost(saveData);
      toast({
        title: "Saved!",
        description: "This post has been saved to your device.",
        action: <ToastAction altText="Done">Done</ToastAction>,
        duration: 1000,
      }); 
      setOpen(false)
    };
    return (
      <>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Download size={24} className="cursor-pointer hover:text-primary" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Save This!</AlertDialogTitle>
              <AlertDialogDescription className="text-md!mt-1">
                This post will be saved to your device. You can access it later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="!flex-row!justify-start">
              <AlertDialogCancel className="!border-0!w-auto!ml-0 bg-secondary">
                Close
              </AlertDialogCancel>
              <Button
                variant="default"
                className="ml-auto w-full md:w-auto"
                onClick={handleSave}
              >
                <Download /> Save
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  };

  const DeleteFlow = () => {
    return (
      <>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Trash2 size={24} className="cursor-pointer hover:text-primary" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete This!</AlertDialogTitle>
              <AlertDialogDescription className="text-md!mt-1">
                This post will be deleted from your device.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="!flex-row!justify-start">
              <AlertDialogCancel className="!border-0!w-auto!ml-0 bg-secondary">
                Close
              </AlertDialogCancel>
              <Button
                variant="default"
                className="ml-auto w-full md:w-auto"
                onClick={async() => {
                  await storage.deletePost(saveData.id)
                  window.location.reload();
                }}
              >
                <Trash2 /> Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  };
  return (
    <AlertDialog>
      {!isSaved && <SaveFlow />}
      {isSaved && <DeleteFlow />}
    </AlertDialog>
  );
}

export default SaveAction;
