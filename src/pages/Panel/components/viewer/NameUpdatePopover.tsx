import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { PenIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import useCollectionStore from '@/common/hooks/useCollectionStore';

function NameUpdatePopover() {
  const collection = useCollectionStore((state) => state.collection);

  const [name, setName] = useState(collection.name);
  const [error, setError] = useState<string>('');

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const changeCollectionName = useCollectionStore(
    (state) => state.changeCollectionName
  );

  const handleCollectionNameSubmbit = async () => {
    setError('');

    if (name.trim() === '') {
      setError('Name cannot be empty.');
      return;
    }

    if (name === collection.name) {
      setError('Name is unchanged.');
      return;
    }

    await changeCollectionName(collection.id, name);

    setIsPopoverOpen(false);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <PenIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Change Collection Name</h4>
            <p className="text-muted-foreground text-sm">
              You can change the name of the collection here.
            </p>
          </div>

          <div className="grid grid-cols-3 items-start gap-4">
            <Label className="h-8" htmlFor="Name">
              Name
            </Label>
            <div className="col-span-2 grid gap-1">
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
          </div>

          <Button className="w-full" onClick={handleCollectionNameSubmbit}>
            <PenIcon />
            <span>Update</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NameUpdatePopover;
