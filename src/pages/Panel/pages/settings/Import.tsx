import React from 'react';
import { ICollection, IStorage } from '@/common/interface';
import { Collections, Storage } from '@/common/storage';

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

  const handleReplaceChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsReplace(event.target.checked);
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

      <div className="w-full py-2">
        <textarea
          className="w-full h-64 p-2 border border-gray-500 rounded-md dark:bg-gray-800"
          value={json}
          onChange={handleChange}
        />

        <button
          className="my-2 p-2 px-3 text-base text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
          onClick={handleImport}
        >
          Import
        </button>

        <div className="inline text-base p-4">
          <input
            type="checkbox"
            className="w-4 h-4 border border-gray-200 rounded-md"
            checked={isReplace}
            onChange={handleReplaceChange}
          />
          <span className="ml-3 font-semibold">Replace</span>
        </div>
      </div>
    </div>
  );
}

export default Import;
