import React from 'react';
import Browser from 'webextension-polyfill';

function Information() {
  const version = Browser.runtime.getManifest().version;

  return (
    <div>
      <div className="grid gap-1 mb-4">
        <p className="text-3xl font-bold py-2">Information</p>
      </div>

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
                <a
                  className="font-medium underline underline-offset-4"
                  href="https://www.buymeacoffee.com/hkben"
                >
                  Buy Me a Coffee!
                </a>
              </li>
              <li>
                <a
                  className="font-medium underline underline-offset-4"
                  href="https://github.com/hkben/Addy"
                >
                  Github
                </a>
              </li>
              <li>
                <a
                  className="font-medium underline underline-offset-4"
                  href="https://addons.mozilla.org/firefox/addon/addy/"
                >
                  Firefox Add-ons
                </a>
              </li>
              <li>
                <a
                  className="font-medium underline underline-offset-4"
                  href="https://chrome.google.com/webstore/detail/addy/aeopkajhbaodnaelhbblokdngiapbglk"
                >
                  Chrome Web Store
                </a>
              </li>
              <li>
                <a
                  className="font-medium underline underline-offset-4"
                  href="https://addy.insanelyones.com/privacy-policy"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div className="py-3 text-small">
            RedirectURL: {Browser.identity.getRedirectURL()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Information;
