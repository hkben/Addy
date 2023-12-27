import React, { useEffect } from 'react';
import { ICollectionItem } from '../../../common/interface';
import { ColumnDef, Row } from '@tanstack/react-table';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import useCollectionStore from '../../../common/hook/useCollectionStore';

interface Prop {
  value: any;
  row: Row<ICollectionItem>;
  column: ColumnDef<ICollectionItem>;
}

function TableEditableCell({
  value: displayValue,
  row: { original },
  column: { header },
}: Prop) {
  if (header != 'Content') {
    return displayValue || null;
  }

  let { collectionId } = useParams();

  const [content, setContent] = React.useState<string>('');

  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  let editCollectionItem = useCollectionStore(
    (state) => state.editCollectionItem
  );

  React.useEffect(() => {
    setContent(original.content);
    setIsEditing(false);
  }, [original]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = event.target.value;
    setContent(value);
  };

  const handleOnClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    setIsEditing(true);
  };

  const handleSave = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (collectionId == null) {
      return;
    }

    editCollectionItem(collectionId, original.id, content);
    setIsEditing(false);
  };

  const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(content);
    setIsEditing(false);
  };

  const handleDecode = (event: React.MouseEvent<HTMLButtonElement>) => {
    let _content = decodeURIComponent(content);
    setContent(_content);
  };

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    setContent(original.content);
    setIsEditing(false);
  };

  useEffect(() => {
    setContent(original.content);
  }, [original.content]);

  return (
    <span>
      {isEditing == false ? (
        <span className="cursor-pointer" onClick={handleOnClick}>
          {displayValue}
        </span>
      ) : (
        <div className="w-full py-2">
          <textarea
            className="w-full p-2 border border-gray-500 rounded-md dark:bg-gray-800"
            value={content}
            onChange={handleChange}
          />
          <button
            className="m-2 p-2 px-3 text-base text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="m-2 p-2 px-3 text-base text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
            onClick={handleCopy}
          >
            Copy
          </button>
          <button
            className="m-2 p-2 px-3 text-base text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
            onClick={handleDecode}
          >
            Decode URI
          </button>
          <button
            className="m-2 p-2 px-3 text-base text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      )}
    </span>
  );
}

export default TableEditableCell;
