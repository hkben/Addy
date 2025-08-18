import React from 'react';
import { ICollectionSummary } from '@/common/interface';
import { CheckIcon } from 'lucide-react';

interface Prop {
  collection: ICollectionSummary;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

function CollectionButton(props: Prop) {
  let _color = props.collection.color || 0;

  return (
    <span
      className={`flex gap-1 collection-color-${_color} inline-flex text-sm font-semibold px-3 py-1 text-white items-center rounded-full cursor-pointer`}
      onClick={props.onClick}
    >
      <span className="drop-shadow-lg">{props.collection.name}</span>
      {props.collection.isExists == true ? <CheckIcon /> : null}
    </span>
  );
}

export default CollectionButton;
