import React from 'react';
import { ISyncSetting } from '@/common/interface';
import SettingItem from '../SettingItem';
import { Input } from '@/components/ui/input';

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
        <Input
          name="awsS3_Region"
          placeholder="Region"
          value={syncSetting.awsS3_Region || ''}
          onChange={handleInputChange}
          onBlur={handleInputChange}
        />
      </SettingItem>

      <SettingItem title="AWS S3 Bucket Name" description="eg: addy-s3-bucket">
        <Input
          name="awsS3_BucketName"
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
        <Input
          name="awsS3_IdentityPoolId"
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
