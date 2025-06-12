import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { SourceItem } from "@/storage/types";
import { editSourceSchema } from "@/utils/formSchemes";
import { useState, useEffect } from "react";

const EditDialog = ({
  sourceData,
  setSourceData,
  isEditDialogOpen,
  setIsEditDialogOpen,
  handleSaveEdit,
}: {
  sourceData: SourceItem | null;
  setSourceData: (e: any) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (e: any) => void;
  handleSaveEdit: (e: any) => void;
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Clear errors on dialog close
  useEffect(() => {
    if (!isEditDialogOpen) setErrors({});
  }, [isEditDialogOpen]);

  const onSaveClick = () => {
    if (!sourceData) return;

    const result = editSourceSchema.safeParse({
      name: sourceData.name,
      url: sourceData.url,
      bannerUrl: sourceData.bannerUrl,
    });

    if (!result.success) {
      const newErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    handleSaveEdit(sourceData);
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Source</DialogTitle>
          <DialogDescription>
            Update your source details and refresh interval
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Name</label>
            <div className="col-span-3">
              <Input
                value={sourceData?.name}
                onChange={(e) =>
                  setSourceData((prev: any) => ({
                    ...prev!,
                    name: e.target.value,
                  }))
                }
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">URL</label>
            <div className="col-span-3">
              <Input
                value={sourceData?.url}
                onChange={(e) =>
                  setSourceData((prev: any) => ({
                    ...prev!,
                    url: e.target.value,
                  }))
                }
              />
              {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Banner URL</label>
            <div className="col-span-3">
              <Input
                value={sourceData?.bannerUrl}
                onChange={(e) =>
                  setSourceData((prev: any) => ({
                    ...prev!,
                    bannerUrl: e.target.value,
                  }))
                }
              />
              {errors.bannerUrl && (
                <p className="text-sm text-red-500">{errors.bannerUrl}</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSaveClick}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
