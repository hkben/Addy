import React from 'react';
import { ICollection, IStorage } from '@/common/interface';
import { Collections, Storage } from '@/common/storage';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { UploadIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

function Import() {
  const [json, setJson] = React.useState<string>('');

  const [isReplace, setIsReplace] = React.useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = event.target.value;
    setJson(value);
  };

  const handleImport = async (event: React.MouseEvent<HTMLButtonElement>) => {
    let isValidation = isJsonValidation();

    if (isValidation == false) {
      return;
    }

    const collections: ICollection[] = JSON.parse(json);
    updateCollections(collections);
  };

  const handleReplaceChange = async (value: boolean) => {
    setIsReplace(value);
  };

  const updateCollections = async (_collections: ICollection[]) => {
    let result: boolean = false;

    if (isReplace) {
      result = await Collections.update(_collections);
    } else {
      result = await Collections.import(_collections);
    }

    if (result) {
      setJson('');
      setIsReplace(false);
    }
  };

  const isJsonValidation = () => {
    try {
      const collections: ICollection[] = JSON.parse(json);
    } catch (e) {
      return false;
    }
    return true;
  };

  return (
    <div>
      <div className="grid gap-1 mb-4">
        <p className="text-3xl font-bold py-2">Import</p>
        <p className="text-muted-foreground">
          Import your collections from a JSON file. Make sure the JSON format is
          correct.
        </p>
      </div>

      <div className="w-full py-2 grid gap-4">
        <Textarea
          className="w-full h-64 p-2"
          value={json}
          onChange={handleChange}
        />

        <div className="flex gap-2">
          <Switch
            id="replace"
            checked={isReplace}
            onCheckedChange={handleReplaceChange}
          />
          <Label htmlFor="replace">Replace Existing Collections</Label>
        </div>

        <Button variant="outline" onClick={handleImport}>
          <UploadIcon />
          <span>Import</span>
        </Button>
      </div>
    </div>
  );
}

export default Import;
