import React from 'react';
import Browser from 'webextension-polyfill';

function Information() {
  const version = Browser.runtime.getManifest().version;

  return (
    <div>
      <p className="text-3xl py-2">Information</p>
      <div className="w-full border-t divide-y">
        <div className="py-4 w-3/4">
          <img className="h-20 w-20" src="icon-128.png" />

          <div className="py-2">
            <p className="text-2xl font-bold">Addy</p>
            <p className="">Version {version}</p>
          </div>

          <div className="py-6 text-base">
            <ul className="list-disc list-inside">
              <li>
                <a href="https://www.buymeacoffee.com/hkben">
                  Buy Me a Coffee!
                </a>
              </li>
              <li>
                <a href="https://github.com/hkben/Addy">Github</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Information;
