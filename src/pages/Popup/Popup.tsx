import React from 'react';
import Browser from 'webextension-polyfill';

function Popup() {
  const openTab = () => {
    Browser.tabs.create({
      url: '/panel.html',
    });

    window.close();
  };

  return (
    <div className="container overflow-hidden">
      <div className="py-2 font-bold text-center bg-blue-500 text-white relative">
        Addy
      </div>

      {/* <div className="w-full">
          <label className="sr-only" htmlFor="message">
            Message
          </label>
          <textarea
            className="w-full p-3 text-sm border border-gray-200 rounded-lg"
            placeholder="Message"
            id="message"
          ></textarea>
        </div> 

        <div className="grid grid-cols-1 divide-y divide-yellow-500 bg-yellow-50 ">
          {this.state.collections.map((item, index) => {
            return <Collection key={index} item={item} id={index} />;
          })}
        </div>*/}

      <div
        onClick={openTab}
        className="m-1 p-2 text-center items-center text-md font-black text-white rounded-lg border border-black bg-blue-500 hover:bg-blue-600 cursor-pointer"
      >
        Open Panel
      </div>
    </div>
  );
}

export default Popup;
