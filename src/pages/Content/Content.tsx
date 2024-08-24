import React, { useEffect, useRef } from 'react';

import {
  IBrowserMessage,
  ICollection,
  ICollectionSummary,
  ISetting,
  SortElement,
} from '../../common/interface';
import { Collection, Collections, Storage } from '../../common/storage';
import CollectionButton from './modules/CollectionButton';
import _ from 'lodash';
import Browser from 'webextension-polyfill';
import { useSortCollections } from '../../common/hook/useSortCollections';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import log from 'loglevel';

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

  const sortedCollections = useSortCollections(
    collections,
    props.collectionsOrdering,
    searchKeyword
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const mousePos = React.useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (searchKeyword.length == 0) {
      setNewCollectionButton(false);
      return;
    }

    let sameName = _.filter(
      sortedCollections,
      (o) => o.name.toLowerCase() == searchKeyword.toLowerCase()
    );

    if (sameName.length == 0) {
      setNewCollectionButton(true);
    } else {
      setNewCollectionButton(false);
    }
  }, [sortedCollections]);

  const getWebpageTitle = async () => {
    let domRect = new DOMRect(mousePos.current.x, mousePos.current.y, 0, 0);

    let _collections = (await Collections.fetchSummary(
      selection.content
    )) as ICollectionSummary[];

    setCollections(_collections);
    setNewCollectionButton(false);

    let _content = document.title;

    //If title is empty, use url as content
    if (_content.length == 0) {
      _content = document.URL;
    }

    setSelection({ content: document.title, type: 'bookmark' });
    showBox(domRect);

    //Auto Focus on Search Box when opening Bookmark Popup
    if (inputRef.current && props.quickSearch) {
      inputRef.current.focus();
    }
  };

  const getImage = async (_url: string) => {
    let domRect = new DOMRect(mousePos.current.x, mousePos.current.y, 0, 0);

    let _collections = (await Collections.fetchSummary(
      selection.content
    )) as ICollectionSummary[];

    setCollections(_collections);
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

    let _collections = (await Collections.fetchSummary(
      selection
    )) as ICollectionSummary[];

    setCollections(_collections);
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

    //Reset Search Keyword
    if (_isDisplay == false) {
      setSearchKeyword('');
    }
  };

  const saveTextToCollection = async (name: string) => {
    let result = await Collection.add(name, selection.content, selection.type);
    if (result) {
      toggleBox();
    }
  };

  const newCollectionAndSave = async () => {
    let result = await Collection.createAndAdd(
      searchKeyword,
      selection.content,
      selection.type
    );

    if (result) {
      toggleBox();
    }
  };

  const handleOnMessageEvent = (packet: IBrowserMessage, sender: any) => {
    log.debug(packet);

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
  };

  return (
    <div>
      {isDisplay ? (
        <div className="bookmark-popup" style={styles}>
          <div className="bp-header">
            <p className="bp-header-text">
              {selection.type == 'text' ? `📝 : ${selection.content}` : ''}
              {selection.type == 'image' ? `🖼️ : ${selection.content}` : ''}
              {selection.type == 'bookmark' ? `🔖 : ${selection.content}` : ''}
            </p>
            <div className="bp-header-close-btn" onClick={toggleBox}>
              <XMarkIcon className="h-5 w-5" strokeWidth={2} />
            </div>
          </div>

          <div className="bp-body">
            <div className="bp-search-box">
              <input
                id="bp-search"
                placeholder="Search or Add Collection"
                type="text"
                onChange={searchCollection}
                ref={inputRef}
              />
            </div>

            {collections.length == 0 && searchKeyword == '' ? (
              <div className="bp-no-collections">
                <p>Collections not found !</p>
                <p>Use the input box above to add to a new collection</p>
              </div>
            ) : null}

            <div className="bp-collections-list">
              {sortedCollections.map((collection, index) => {
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
                <PlusIcon className="h-5 w-5" strokeWidth={2} />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Content;
