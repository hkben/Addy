import { SidebarInset } from '@/components/ui/sidebar';
import React from 'react';
import Header from '../layouts/Header';

function Welcome() {
  return (
    <SidebarInset>
      <Header title="Addy" />
      <div className="flex flex-1 flex-col gap-4 px-4 py-5">
        <div className="bg-muted/50 mx-auto h-full w-full max-w-5xl rounded-xl p-8">
          <div className="container">
            <div className="text-center">
              <div className="my-auto text-3xl font-extrabold py-40 rounded-md bg-gray-100 dark:bg-transparent">
                Welcome to <span className="text-blue-600">Addy</span>!
                <p className="py-4 font-bold text-lg dark:text-gray-300 text-gray-600">
                  A web extension to saving content quickly for later use, and
                  you can focus on killing your tabs.
                </p>
              </div>
            </div>
            <div className="flex my-5 py-5 rounded-md bg-gray-100 dark:bg-transparent">
              <div className="w-1/2 px-5">
                <img
                  className="w-full h-full rounded-md"
                  src="img/welcome/text.gif"
                />
              </div>
              <div className="w-1/2 p-5 inline-block">
                <p className="py-7 text-3xl font-extrabold">
                  Quick Text Saving
                </p>
                <p className="text-xl font-bold dark:text-gray-300 text-gray-600">
                  <span className="bg-blue-500 font-white font-semibold text-white">
                    Highlight
                  </span>{' '}
                  Text you want to save, Open Context Menu and "Save
                  Hightlighted Text"
                </p>
                <p className="py-10 font-bold dark:text-gray-300 text-gray-600">
                  * This menu item only appears outside of this panel
                </p>
              </div>
            </div>
            <div className="flex my-5 py-5 rounded-md bg-gray-100 dark:bg-transparent">
              <div className="w-1/2 p-5 inline-block text-right">
                <p className="py-7 text-3xl font-extrabold">
                  Quick Image Saving
                </p>
                <p className="text-xl font-bold dark:text-gray-300 text-gray-600">
                  Hover on a image, Open Context Menu and "Save Image".
                </p>
                <p className="py-10 font-bold dark:text-gray-300 text-gray-600">
                  * This menu item only appears outside of this panel
                </p>
              </div>
              <div className="w-1/2 px-5">
                <img
                  className="w-full h-full rounded-md"
                  src="img/welcome/image.gif"
                />
              </div>
            </div>
            <div className="flex my-5 py-5 rounded-md bg-gray-100 dark:bg-transparent">
              <div className="w-1/2 px-5">
                <img
                  className="w-full h-full rounded-md"
                  src="img/welcome/bookmark.gif"
                />
              </div>
              <div className="w-1/2 p-5 inline-block">
                <p className="py-7 text-3xl font-extrabold">Quick Bookmark</p>
                <p className="text-xl font-bold dark:text-gray-300 text-gray-600">
                  Open Context Menu everywhere in the page and "Save as
                  Bookmark".
                </p>
                <p className="py-10 font-bold dark:text-gray-300 text-gray-600">
                  * This menu item only appears outside of this panel
                </p>
              </div>
            </div>
            <div className="flex my-5 py-5 rounded-md bg-gray-100 dark:bg-transparent">
              <div className="w-1/2 p-5 inline-block text-right">
                <p className="py-7 text-3xl font-extrabold">
                  Custom Text Saving
                </p>
                <p className="text-xl font-bold dark:text-gray-300 text-gray-600">
                  Saving any text with a click quickly.
                </p>
              </div>
              <div className="w-1/2 px-5">
                <img
                  className="w-full h-full rounded-md"
                  src="img/welcome/popup.gif"
                />
              </div>
            </div>

            <div className="flex my-5 py-5 rounded-md bg-gray-100 dark:bg-transparent">
              <div className="w-1/2 px-5">
                <img
                  className="w-full h-full rounded-md"
                  src="img/welcome/darkmode.gif"
                />
              </div>
              <div className="w-1/2 p-5 inline-block">
                <p className="py-7 text-3xl font-extrabold">Dark Mode</p>
                <p className="text-xl font-bold dark:text-gray-300 text-gray-600">
                  Switching between light and dark modes with a single click.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}

export default Welcome;
