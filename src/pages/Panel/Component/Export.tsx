import moment from 'moment';
import React, { useEffect } from 'react';
import { Storage } from '../../../common/storage';

interface State {
  json: string;
}

function Export() {
  const [json, setJson] = React.useState('');

  useEffect(() => {
    updateCollections().catch(console.error);
  }, []);

  const updateCollections = async () => {
    let storage = await Storage.fetch();
    let _json = JSON.stringify(storage);
    setJson(_json);
  };

  const downloadJson = async () => {
    const fileName = `Addy-${moment().format('YYYY-MM-DD-HH-mm-ss')}`;
    const blob = new Blob([json], { type: 'application/json' });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

        <button
          className="my-2 p-2 px-3 text-base text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
          onClick={downloadJson}
        >
          Download
        </button>
      </div>
    </div>
  );
}

export default Export;
