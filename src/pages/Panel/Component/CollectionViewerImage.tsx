import React, { useEffect, useMemo } from 'react';
import { ICollectionItem } from '../../../common/interface';
import moment from 'moment';
import jsZip from 'jszip';
import Common from '../../common';
import { Setting } from '../../../common/storage';
import _ from 'lodash';
import Browser from 'webextension-polyfill';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import useViewingOptionStore from '../../../common/hook/useViewingOptionStore';
import useCollectionStore from '../../../common/hook/useCollectionStore';
import { useParams } from 'react-router-dom';

interface Prop {
  data: Array<ICollectionItem>;
  collectionName: string;
}

function CollectionViewerImage({ data, collectionName }: Prop) {
  let { collectionId } = useParams();

  const { viewingOption } = useViewingOptionStore();

  const [columns, setColumns] = React.useState(3);

  const [isDownloading, setIsDownloading] = React.useState(false);

  const [downloadingItem, setDownloadingItem] = React.useState(0);

  const [isSortedDesc, setIsSortedDesc] = React.useState(true);

  const [sortedData, setSortedData] = React.useState(
    [] as Array<ICollectionItem>
  );

  let removeCollectionItem = useCollectionStore(
    (state) => state.removeCollectionItem
  );

  const handleColumnsSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = event.target.value;
    setColumns(parseInt(value));

    Setting.updateViewingImageGrid(parseInt(value));
  };

  useEffect(() => {
    if (viewingOption == null) {
      return;
    }

    setColumns(viewingOption.imageColumns);
  }, [viewingOption]);

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

        let createTime = `${moment(item.createTime).format(
          'YYYY-MM-DD-HH-mm-ss'
        )}`;

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
        console.error(error);
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const fileName = `${collectionName}-${moment().format(
      'YYYY-MM-DD-HH-mm-ss'
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
          <div
            key={item.id}
            className="flex flex-col p-2 bg-gray-200 dark:bg-gray-700 rounded-md box-content"
          >
            <div className="flex py-2 justify-start text-base font-bold">
              {moment(item.createTime).format('YYYY-MM-DD hh:mm A')}
              <span className="flex ml-auto">
                <a
                  className="inline-block align-middle m-auto"
                  href={`https://lens.google.com/uploadbyurl?url=${item.content}`}
                  target="_blank"
                >
                  <MagnifyingGlassIcon className="w-6 h-6" strokeWidth={2} />
                </a>
                <a
                  className="inline-block align-middle m-auto"
                  href={item.source}
                  target="_blank"
                >
                  <ArrowTopRightOnSquareIcon
                    className="w-6 h-6"
                    strokeWidth={2}
                  />
                </a>

                <button
                  className="inline-block align-middle m-auto"
                  onClick={() => {
                    const confirmBox = window.confirm(
                      'Do you really want to delete this item?'
                    );
                    if (confirmBox === true && collectionId != null) {
                      removeCollectionItem(collectionId, item.id);
                    }
                  }}
                >
                  <XCircleIcon className="w-6 h-6" strokeWidth={2} />
                </button>
              </span>
            </div>
            <div className="h-full flex items-center">
              <img className="self-center" src={item.content} loading="lazy" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CollectionViewerImage;
