import React from 'react';
import { ICollectionSummary } from '../interface';

interface Prop {
  collection: ICollectionSummary;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

function CollectionButton(props: Prop) {
  return (
    <div
      className="inline-flex text-sm font-medium pt-1 pb-1 pl-3 pr-3 bg-blue-500 text-white items-center rounded-full border border-blue-600 border-solid cursor-pointer hover:bg-blue-600"
      onClick={props.onClick}
    >
      <span>{props.collection.name}</span>
      {props.collection.isExists == true ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : null}
    </div>
  );
}

export default CollectionButton;
