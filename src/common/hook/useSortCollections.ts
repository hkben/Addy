import _ from 'lodash';
import React from 'react';
import { useEffect } from 'react';
import { ICollectionSummary, IOrdering, SortElement } from '../interface';

export const useSortCollections = (
  collections: ICollectionSummary[],
  ordering: IOrdering
) => {
  const [sortedCollections, setSortedCollections] = React.useState(
    [] as ICollectionSummary[]
  );

  useEffect(() => {
    if (ordering == null) {
      setSortedCollections(collections);
      return;
    }

    let _collections = collections;

    if (ordering.type == SortElement.Name) {
      _collections = _.sortBy(_collections, (o) => o.name);
      _collections = _.reverse(_collections);
    }

    if (ordering.type == SortElement.Items) {
      _collections = _.sortBy(_collections, (o) => o.items);
    }

    if (ordering.type == SortElement.CreateTime) {
      _collections = _.sortBy(_collections, (o) => o.createTime);
    }

    if (ordering.type == SortElement.ModifyTime) {
      _collections = _.sortBy(_collections, (o) => o.modifyTime);
    }

    if (ordering.descending) {
      _collections = _.reverse(_collections);
    }
    setSortedCollections(_collections);
  }, [collections, ordering]);

  return sortedCollections;
};
