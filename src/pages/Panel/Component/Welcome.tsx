import React from 'react';

function Welcome() {
  return (
    <div className="container">
      <div className="text-center">
        <div className="my-auto text-3xl font-extrabold py-40 rounded-md bg-gray-100 dark:bg-transparent">
          Welcome to <span className="text-blue-600">Addy</span>!
          <p className="py-4 font-bold text-lg dark:text-gray-300 text-gray-600">
            A web extension to saving content quickly for later use, and you can
            focus on killing your tabs.
          </p>
        </div>
      </div>
      <div className="flex my-5 py-5 rounded-md bg-gray-100 dark:bg-transparent">
        <div className="w-1/2 px-5">
          <img
            className="w-full h-full rounded-md"
            src="img/welcome/preview.gif"
          />
        </div>
        <div className="w-1/2 p-5 inline-block">
          <p className="py-7 text-3xl font-extrabold">Quick Text Saving</p>
          <p className="text-xl font-bold dark:text-gray-300 text-gray-600 leading-loose">
            <span className="bg-blue-500 font-white font-semibold text-white">
              Highlight
            </span>{' '}
            Text you want to save, Open Context Menu and "Save Hightlighted
            Text"
          </p>
        </div>
      </div>
      <div className="flex my-5 py-5 rounded-md bg-gray-100 dark:bg-transparent">
        <div className="w-1/2 p-5 inline-block text-right">
          <p className="py-7 text-3xl font-extrabold">Quick Image Saving</p>
          <p className="text-xl font-bold dark:text-gray-300 text-gray-600 leading-loose">
            Hover on a image, Open Context Menu and "Save Image".
          </p>
        </div>
        <div className="w-1/2 px-5">
          <img
            className="w-full h-full rounded-md"
            src="img/welcome/preview-2.gif"
          />
        </div>
      </div>
    </div>
  );
}

export default Welcome;
