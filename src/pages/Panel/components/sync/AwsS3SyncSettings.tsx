import React from 'react';
import { ISyncSetting } from '@/common/interface';
import SettingItem from '../settings/SettingItem';

interface Prop {
  syncSetting: ISyncSetting;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
}

function AwsS3SyncSettings({ syncSetting, handleInputChange }: Prop) {
  return (
    <React.Fragment>
      <SettingItem title="AWS Region" description="eg: us-east-1.">
        <input
          name="awsS3_Region"
          className="w-full placeholder:italic p-2 pr-3  border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
          placeholder="Region"
          value={syncSetting.awsS3_Region || ''}
          onChange={handleInputChange}
          onBlur={handleInputChange}
        />
      </SettingItem>

      <SettingItem title="AWS S3 Bucket Name" description="eg: addy-s3-bucket">
        <input
          name="awsS3_BucketName"
          className="w-full placeholder:italic p-2 pr-3  border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
          placeholder="Bucket Name"
          value={syncSetting.awsS3_BucketName || ''}
          onChange={handleInputChange}
          onBlur={handleInputChange}
        />
      </SettingItem>

      <SettingItem
        title="AWS Identity Pool Id"
        description="eg: us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      >
        <input
          name="awsS3_IdentityPoolId"
          className="w-full placeholder:italic p-2 pr-3  border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
          placeholder="Identity Pool Id"
          value={syncSetting.awsS3_IdentityPoolId || ''}
          onChange={handleInputChange}
          onBlur={handleInputChange}
        />
      </SettingItem>
    </React.Fragment>
  );
}

export default AwsS3SyncSettings;
