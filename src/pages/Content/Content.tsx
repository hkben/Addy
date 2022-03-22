import React, { useEffect, useRef } from 'react';

import {
  IBrowserMessage,
  ICollection,
  ICollectionSummary,
  ISetting,
  SortElement,
} from '../../common/interface';
import Storage from '../storage';
import CollectionButton from './modules/CollectionButton';
import _ from 'lodash';
import Browser from 'webextension-polyfill';

function Content(props: ISetting) {
  const [selection, setSelection] = React.useState({
    content: '',
    type: '',
  });

  const [searchKeyword, setSearchKeyword] = React.useState<string>('');

  const [newCollectionButton, setNewCollectionButton] = React.useState<boolean>(
    false
  );

  const [isDisplay, setIsDisplay] = React.useState<boolean>(false);

  const [styles, setStyles] = React.useState<object>({
    top: 0,
    left: 0,
  });

  const [collections, setCollections] = React.useState<ICollectionSummary[]>(
    [] as ICollectionSummary[]
  );

  const [filteredCollections, setFilteredCollections] = React.useState<
    ICollectionSummary[]
  >([] as ICollectionSummary[]);

  const inputRef = useRef<HTMLInputElement>(null);

  const mousePos = React.useRef({
    x: 0,
    y: 0,
  });

  const getWebpageTitle = async () => {
    let domRect = new DOMRect(mousePos.current.x, mousePos.current.y, 0, 0);

    let _collections = (await Storage.getCollectionsSummary(
      selection.content
    )) as ICollectionSummary[];

    setCollections(_collections);
    sortAndSetFilteredCollections(_collections);
    setNewCollectionButton(false);
    setSelection({ content: document.title, type: 'bookmark' });
    showBox(domRect);

    //Auto Focus on Search Box when opening Bookmark Popup
    if (inputRef.current && props.quickSearch) {
      inputRef.current.focus();
    }
  };

  const getImage = async (_url: string) => {
    let domRect = new DOMRect(mousePos.current.x, mousePos.current.y, 0, 0);

    let _collections = (await Storage.getCollectionsSummary(
      selection.content
    )) as ICollectionSummary[];

    setCollections(_collections);
    sortAndSetFilteredCollections(_collections);
    setNewCollectionButton(false);
    setSelection({ content: _url, type: 'image' });
    showBox(domRect);

    //Auto Focus on Search Box when opening Bookmark Popup
    if (inputRef.current && props.quickSearch) {
      inputRef.current.focus();
    }
  };

  const getHighlightedText = async () => {
    let highlighted_text = document.getSelection()!;

    if (highlighted_text.type == 'None') {
      return;
    }

    let selection = highlighted_text?.toString().trim() || '';
    let range = highlighted_text.getRangeAt(0);
    let rect = range.getBoundingClientRect();

    let _collections = (await Storage.getCollectionsSummary(
      selection
    )) as ICollectionSummary[];

    setCollections(_collections);
    sortAndSetFilteredCollections(_collections);
    setNewCollectionButton(false);
    setSelection({ content: selection, type: 'text' });
    showBox(rect);

    //Auto Focus on Search Box when opening Bookmark Popup
    if (inputRef.current && props.quickSearch) {
      inputRef.current.focus();
    }
  };

  const showBox = (_rect: DOMRect) => {
    let { innerHeight: window_height, innerWidth: window_width } = window;

    let {
      top: selection_top,
      left: selection_left,
      height: selection_height,
      width: selection_width,
    } = _rect;

    let offset_height = 10;

    let box_height = 200;
    let box_width = 350;

    let isDisplayOnTop,
      isDisplayOnRight = false;

    if (selection_top >= window_height / 2) {
      isDisplayOnTop = true;
    }
    if (selection_left >= window_width / 2) {
      isDisplayOnRight = true;
    }

    //Add with Scroll position
    let top = selection_top + window.scrollY;
    let left = selection_left + window.scrollX;

    if (isDisplayOnTop) {
      //top
      top = top - box_height - offset_height;
    } else {
      //bottom
      top = top + selection_height + offset_height;
    }

    if (isDisplayOnRight) {
      //right
      left = left + selection_width - box_width;
    }

    setStyles({
      top: top,
      left: left,
    });
    setIsDisplay(true);
  };

  const toggleBox = () => {
    let _isDisplay = isDisplay ? false : true;
    setIsDisplay(_isDisplay);
  };

  const saveTextToCollection = async (name: string) => {
    await Storage.saveItemToCollection(name, selection.content, selection.type);
    toggleBox();
  };

  const newCollectionAndSave = async () => {
    await Storage.newCollectionAndSave(
      searchKeyword,
      selection.content,
      selection.type
    );
    toggleBox();
  };

  const handleOnMessageEvent = (packet: IBrowserMessage, sender: any) => {
    console.log(packet);

    switch (packet.action) {
      case 'saveText':
        getHighlightedText();
        return;
      case 'saveImage':
        getImage(packet.imageSrc!);
        return;
      case 'saveBookmark':
        getWebpageTitle();
        return;
    }
  };

  const handleOnContextmenu = (event: MouseEvent) => {
    mousePos.current = { x: event.x, y: event.y };
  };

  useEffect(() => {
    document.addEventListener('contextmenu', handleOnContextmenu);
    Browser.runtime.onMessage.addListener(handleOnMessageEvent);

    return () => {
      document.removeEventListener('contextmenu', handleOnContextmenu);
      Browser.runtime.onMessage.removeListener(handleOnMessageEvent);
    };
  }, []);

  const searchCollection = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    setSearchKeyword(value);

    if (value.length == 0) {
      sortAndSetFilteredCollections(collections);
      setNewCollectionButton(false);
      return;
    }

    let filtered = _.filter(collections, (o) =>
      o.name.toLowerCase().includes(value.toLowerCase())
    );

    let sameName = _.filter(
      filtered,
      (o) => o.name.toLowerCase() == value.toLowerCase()
    );

    if (sameName.length > 0) {
      setNewCollectionButton(false);
    } else {
      setNewCollectionButton(true);
    }

    sortAndSetFilteredCollections(filtered);
  };

  const sortAndSetFilteredCollections = (
    _collections: ICollectionSummary[]
  ) => {
    if (props.collectionsOrdering.type == SortElement.Name) {
      _collections = _.sortBy(_collections, (o) => o.name);
      _collections = _.reverse(_collections);
    }

    if (props.collectionsOrdering.type == SortElement.Items) {
      _collections = _.sortBy(_collections, (o) => o.items);
    }

    if (props.collectionsOrdering.type == SortElement.CreateTime) {
      _collections = _.sortBy(_collections, (o) => o.createTime);
    }

    if (props.collectionsOrdering.type == SortElement.ModifyTime) {
      _collections = _.sortBy(_collections, (o) => o.modifyTime);
    }

    if (props.collectionsOrdering.descending) {
      _collections = _.reverse(_collections);
    }

    setFilteredCollections(_collections);
  };

  return (
    <div>
      {isDisplay ? (
        <div className="bookmark-popup" style={styles}>
          <div className="bp-header">
            <p className="bp-header-text">
              {selection.type == 'image'
                ? `Image : ${selection.content}`
                : selection.content}
            </p>
            <div className="bp-header-close-btn" onClick={toggleBox}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="bp-body">
            <div className="bp-search-box">
              <input
                id="bp-search"
                placeholder="Search Collection"
                type="text"
                onChange={searchCollection}
                ref={inputRef}
              />
            </div>

            <div className="bp-collections-list">
              {filteredCollections.map((collection, index) => {
                return (
                  <CollectionButton
                    key={index}
                    collection={collection}
                    onClick={() => saveTextToCollection(collection.id)}
                  />
                );
              })}
            </div>
            {newCollectionButton ? (
              <div className="add-btn" onClick={newCollectionAndSave}>
                <span>New Collection</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Content;
