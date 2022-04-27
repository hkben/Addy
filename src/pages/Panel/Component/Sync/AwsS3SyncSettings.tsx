import React from 'react';
import { ISyncSetting } from '../../../../common/interface';

interface Prop {
  syncSetting: ISyncSetting;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
}

function AwsS3SyncSettings({ syncSetting, handleInputChange }: Prop) {
  return (
    <React.Fragment>
      <div className="w-2/3 flex h-28">
        <div className="w-2/3 my-auto">
          <p className="text-base font-bold">AWS Region</p>
          eg: region
        </div>
        <div className="w-1/3 my-auto text-center">
          <input
            name="awsS3_Region"
            className="w-full placeholder:italic p-2 pr-3  border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
            placeholder="Region"
            value={syncSetting.awsS3_Region || ''}
            onChange={handleInputChange}
            onBlur={handleInputChange}
          />
        </div>
      </div>

      <div className="w-2/3 flex h-28">
        <div className="w-2/3 my-auto">
          <p className="text-base font-bold">AWS S3 Bucket Name</p>
        </div>
        <div className="w-1/3 my-auto text-center">
          <input
            name="awsS3_BucketName"
            className="w-full placeholder:italic p-2 pr-3  border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
            placeholder="Bucket Name"
            value={syncSetting.awsS3_BucketName || ''}
            onChange={handleInputChange}
            onBlur={handleInputChange}
          />
        </div>
      </div>

      <div className="w-2/3 flex h-28">
        <div className="w-2/3 my-auto">
          <p className="text-base font-bold">AWS Identity Pool Id</p>
        </div>
        <div className="w-1/3 my-auto text-center">
          <input
            name="awsS3_IdentityPoolId"
            className="w-full placeholder:italic p-2 pr-3  border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
            placeholder="Identity Pool Id"
            value={syncSetting.awsS3_IdentityPoolId || ''}
            onChange={handleInputChange}
            onBlur={handleInputChange}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default AwsS3SyncSettings;
