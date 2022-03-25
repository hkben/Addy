import React from 'react';
import { ICollection, IStorage } from '../../../common/interface';
import { Collections, Storage } from '../../../common/storage';

function Import() {
  const [json, setJson] = React.useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = event.target.value;
    setJson(value);
  };

  const handleImport = async (event: React.MouseEvent<HTMLButtonElement>) => {
    let isValidation = isJsonValidation();

    if (isValidation == false) {
      return;
    }

    const storage: IStorage = JSON.parse(json);
    updateCollections(storage.collections);
  };

  const updateCollections = async (_collections: ICollection[]) => {
    let result = await Collections.import(_collections);

    if (result) {
      setJson('');
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
      <p className="text-3xl py-2">Import</p>
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
      </div>
    </div>
  );
}

export default Import;
