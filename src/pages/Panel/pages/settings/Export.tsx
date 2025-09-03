import { format } from 'date-fns';
import React, { useEffect } from 'react';
import { Collections } from '@/common/storage';
import log from 'loglevel';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';

interface State {
  json: string;
}

function Export() {
  const [json, setJson] = React.useState('');

  useEffect(() => {
    updateCollections().catch(log.error);
  }, []);

  const updateCollections = async () => {
    let collections = await Collections.fetchAll();
    let _json = JSON.stringify(collections);
    setJson(_json);
  };

  const downloadJson = async () => {
    const fileName = `Addy-${format(Date.now(), 'yyyy-MM-dd-HH-mm-ss')}`;
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
      <div className="grid gap-1 mb-4">
        <p className="text-3xl font-bold py-2">Export</p>
        <p className="text-muted-foreground">
          Export your collections to a JSON file. You can use this file to
          backup or transfer your data.
        </p>
      </div>

      <div className="w-full py-2 grid gap-4">
        <Textarea className="w-full h-64 p-2" value={json} readOnly />

        <Button variant="outline" onClick={downloadJson}>
          <DownloadIcon />
          <span>Download</span>
        </Button>
      </div>
    </div>
  );
}

export default Export;
