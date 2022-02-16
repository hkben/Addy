import React from 'react';
import { ICollection } from '../../interface';
import Storage from '../../storage';

interface Prop {
  collection: string;
  callback: Promise<void>;
}

interface State {
  data: ICollection;
}

class CollectionViewer extends React.Component<Prop, State> {
  constructor(props: Prop) {
    super(props);
    this.removeAllItems = this.removeAllItems.bind(this);
    this.removeCollection = this.removeCollection.bind(this);
  }

  state = {
    data: {} as ICollection,
  };

  async componentWillReceiveProps(nextProps: Prop) {
    console.log('componentDidMount');

    let collection = await Storage.getCollection(nextProps.collection);

    console.log(nextProps.collection);

    console.log(collection);

    if (typeof collection == 'undefined') {
      return;
    }

    this.setState({ data: collection });
  }

  async removeAllItems() {
    console.log('removeAllItems');

    await Storage.removeAllItems(this.state.data.id);

    await this.props.callback;
  }

  async removeCollection() {
    console.log('removeCollection');

    await Storage.removeCollection(this.state.data.id);

    await this.props.callback;
  }

  render() {
    return (
      <div>
        <div className="w-full py-5 flex gap-2.5">
          <p className="text-3xl">{this.state.data.name}</p>

          {/* <button className="p-1 px-1.5 text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button> */}

          <button
            className="p-1 px-1.5 text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
            onClick={() => {
              const confirmBox = window.confirm(
                'Do you really want to delete all items in this collection?'
              );
              if (confirmBox === true) {
                this.removeAllItems();
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>

          <button
            className="p-1 px-1.5 text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
            onClick={() => {
              const confirmBox = window.confirm(
                'Do you really want to delete this collection?'
              );
              if (confirmBox === true) {
                this.removeCollection();
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        <div className="w-full inline-flex items-center -space-x-px text-xs rounded-md">
          <button
            className="w-2/6 px-5 py-3 font-medium border rounded-l-md hover:z-10 focus:outline-none focus:border-indigo-600 focus:z-10 hover:bg-gray-50 active:opacity-75"
            type="button"
          >
            Sort
          </button>

          <button
            className="w-2/6 px-5 py-3 font-medium border hover:z-10 focus:outline-none focus:border-indigo-600 focus:z-10 hover:bg-gray-50 active:opacity-75"
            type="button"
          >
            Sort
          </button>

          <button
            className="w-2/6 px-5 py-3 font-medium border rounded-r-md hover:z-10 focus:outline-none focus:border-indigo-600 focus:z-10 hover:bg-gray-50 active:opacity-75"
            type="button"
          >
            Sort
          </button>
        </div>

        <div className="py-8">
          {this.state.data.items?.map((item, index) => {
            return (
              <p key={item.id} className="py-1">
                {item.text}
              </p>
            );
          })}
        </div>
      </div>
    );
  }
}

export default CollectionViewer;
