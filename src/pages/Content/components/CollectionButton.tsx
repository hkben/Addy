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
    <div
      className={`bp-collection-button color-${_color}`}
      onClick={props.onClick}
    >
      <span className="drop-shadow-lg">{props.collection.name}</span>
      {props.collection.isExists == true ? <CheckIcon /> : null}
    </div>
  );
}

export default CollectionButton;
