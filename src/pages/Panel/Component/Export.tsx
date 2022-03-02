import React from 'react';
import Storage from '../../storage';

interface State {
  json: string;
}

class Export extends React.Component<{}, State> {
  state = {
    json: '',
  };

  async componentDidMount() {
    console.log('componentDidMount');
    await this.updateCollections();
  }

  async updateCollections() {
    let storage = await Storage.getStorage();
    let _json = JSON.stringify(storage);
    this.setState({ json: _json });
  }

  render() {
    return (
      <div>
        <p className="text-3xl py-2">Export</p>
        <div className="w-full py-2">
          <textarea
            className="w-full h-64 p-2 border border-gray-500 rounded-md dark:bg-gray-800"
            value={this.state.json}
            readOnly
          />
        </div>
      </div>
    );
  }
}

export default Export;
