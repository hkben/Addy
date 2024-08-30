import React from 'react';
import { ICollectionSummary } from '@/common/interface';
import { CheckIcon } from '@heroicons/react/24/outline';

interface Prop {
  collection: ICollectionSummary;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

function CollectionButton(props: Prop) {
  let _color = props.collection.color || 0;

  return (
    <div
      className={`color-${_color} inline-flex text-sm font-semibold pt-1 pb-1 pl-3 pr-3 text-white items-center rounded-full cursor-pointer`}
      onClick={props.onClick}
    >
      <span className="drop-shadow-lg">{props.collection.name}</span>
      {props.collection.isExists == true ? (
        <CheckIcon className="h-6 w-6" strokeWidth={2} />
      ) : null}
    </div>
  );
}

export default CollectionButton;
