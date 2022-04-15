import React from 'react';
import { ICollectionSummary } from '../../../common/interface';

interface Prop {
  collection: ICollectionSummary;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

function CollectionButton(props: Prop) {
  let _color = props.collection.color || 0;

  return (
    <div
      className={`bp-collection-button color-${_color}`}
      onClick={props.onClick}
    >
      <span className="drop-shadow-lg">{props.collection.name}</span>
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
