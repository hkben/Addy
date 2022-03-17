import React, { useEffect } from 'react';
import Storage from '../../storage';

interface State {
  json: string;
}

function Export() {
  const [json, setJson] = React.useState('');

  useEffect(() => {
    updateCollections().catch(console.error);
  }, []);

  const updateCollections = async () => {
    let storage = await Storage.getStorage();
    let _json = JSON.stringify(storage);
    setJson(_json);
  };

  return (
    <div>
      <p className="text-3xl py-2">Export</p>
      <div className="w-full py-2">
        <textarea
          className="w-full h-64 p-2 border border-gray-500 rounded-md dark:bg-gray-800"
          value={json}
          readOnly
        />
      </div>
    </div>
  );
}

export default Export;
