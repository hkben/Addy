import React, { useEffect, useMemo } from 'react';
import { ICollectionItem } from '@/common/interface';
import { format } from 'date-fns';
import jsZip from 'jszip';
import Common from '@/common/common';
import { Setting } from '@/common/storage';
import _ from 'lodash';
import Browser from 'webextension-polyfill';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import useCollectionStore from '@/common/hooks/useCollectionStore';
import { useParams } from 'react-router-dom';
import ImageItem from '@Panel/components/viewer/ImageItem';
import log from 'loglevel';
import useSettingStore from '@/common/store/useSettingStore';

interface Prop {
  data: Array<ICollectionItem>;
  collectionName: string;
}

function CollectionViewerImage({ data, collectionName }: Prop) {
  const { setting, updateSetting } = useSettingStore();

  const columns = setting!.viewingOption.imageColumns ?? 3;

  const [isDownloading, setIsDownloading] = React.useState(false);

  const [downloadingItem, setDownloadingItem] = React.useState(0);

  const [isSortedDesc, setIsSortedDesc] = React.useState(true);

  const [sortedData, setSortedData] = React.useState(
    [] as Array<ICollectionItem>
  );

  const handleColumnsSelection = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = event.target.value;

    let viewingOption = { ...setting!.viewingOption };
    viewingOption.imageColumns = parseInt(value);

    await updateSetting({ viewingOption });
  };

  useEffect(() => {
    sortData();
  }, [data, isSortedDesc]);

  const downloadAllImages = async () => {
    if (isDownloading) {
      return;
    }

    setIsDownloading(true);

    let zip = new jsZip();

    for (const item of data) {
      try {
        let pathFileName = new URL(item.content).pathname
          .split('/')
          .pop()
          ?.split('.');

        let createTime = `${format(item.createTime, 'YYYY-MM-DD-HH-mm-ss')}`;

        let name = `${createTime}`;

        if (pathFileName != null && pathFileName.length > 1) {
          name = `${pathFileName[0]}-${createTime}`;
        }

        let res = await fetch(item.content);
        let blob = await res.blob();
        let extension = Common.getExtensionByContentType(blob.type);
        zip.file(`${name}${extension}`, blob, { base64: true });

        setDownloadingItem((prev) => prev + 1);
      } catch (error) {
        log.error(error);
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const fileName = `${collectionName}-${format(
      Date.now(),
      'yyyy-MM-dd-HH-mm-ss'
    )}`;

    const href = await URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + '.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsDownloading(false);
    setDownloadingItem(0);
  };

  const changeSorting = () => {
    let _isSortedDesc = isSortedDesc ? false : true;
    setIsSortedDesc(_isSortedDesc);
  };

  const sortData = () => {
    let _data = data;

    _data = _.sortBy(_data, (o) => o.createTime);

    if (isSortedDesc == true) {
      _data = _.reverse(_data);
    }

    setSortedData(_data);
  };

  return (
    <div>
      <div className="w-full flex">
        <div className="inline text-base mr-auto my-auto">
          <label className="px-4" htmlFor="columns">
            Columns
          </label>

          <select
            className="h-10 px-4 pr-10 border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
            id="columns"
            value={columns}
            onChange={handleColumnsSelection}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>

        <div className="inline text-base ml-auto my-auto">
          {data.length > 0 ? (
            <button
              className="p-2 px-10 text-base text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
              onClick={() => {
                const isFirefox = Browser.runtime
                  .getURL('')
                  .startsWith('moz-extension://');

                if (isFirefox) {
                  window.confirm(
                    `Some images may not be downloaded in Firefox due to Firefox's CORS security policy.\n We suggest download images on Chrome.`
                  );
                }

                downloadAllImages();
              }}
            >
              {isDownloading
                ? `${downloadingItem} / ${data.length} Items`
                : 'Download All'}
            </button>
          ) : (
            ''
          )}
        </div>
      </div>

      <div className="w-full my-2 items-center text-xs rounded-md">
        <button
          className="w-1/4 px-5 py-3 font-semibold border rounded-lg border-gray-300"
          type="button"
          onClick={changeSorting}
        >
          Sort
          {isSortedDesc == false ? (
            <ChevronUpIcon className="h-4 w-4 inline mx-2" strokeWidth={2} />
          ) : (
            <ChevronDownIcon className="h-4 w-4 inline mx-2" strokeWidth={2} />
          )}
        </button>
      </div>

      <div className={`py-3 grid gap-2 grid-cols-${columns}`}>
        {sortedData.map((item) => (
          <ImageItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default CollectionViewerImage;
