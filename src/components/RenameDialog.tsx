
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RenameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  currentName: string;
}

export const RenameDialog: React.FC<RenameDialogProps> = ({
  isOpen,
  onClose,
  onRename,
  currentName,
}) => {
  const [newName, setNewName] = useState(currentName);

  const handleRename = () => {
    if (newName.trim()) {
      onRename(newName.trim());
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageName">Image Name</Label>
            <Input
              id="imageName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter new name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleRename} disabled={!newName.trim()}>
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
