import axios from 'axios';
import GoogleOAuth from '../auth/googleOAuth';
import { Collections } from '../storage';
import SyncSetting from '../storage/syncSetting';
import ISyncProvider, { IFileInfo } from './syncProvider';

interface IGoogleDriveSearchFile {
  kind: string;
  files: IFileInfo[];
}

class GoogleDrive implements ISyncProvider {
  accessToken!: string;

  fileName: string = 'addy-sync.json';

  async init(): Promise<void> {
    let _syncSetting = await SyncSetting.fetch();

    let token = _syncSetting.google_oAuthAccessToken || '';
    let refreshAccessToken = await GoogleOAuth.getRefreshAccessToken(token);

    this.accessToken = refreshAccessToken.access_token;
    return;
  }

  async searchSyncFile(): Promise<IFileInfo> {
    let result: IFileInfo = {
      id: '',
      name: '',
      modifyTime: '',
    };

    let response = await axios.get<IGoogleDriveSearchFile>(
      `https://www.googleapis.com/drive/v3/files`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        params: {
          q: `name = 'addy-sync.json'`,
          spaces: `appDataFolder`,
        },
      }
    );

    if (response.data.files.length > 0) {
      result = response.data.files[0];
    }

    return result;
  }

  async getSyncFile(_file: IFileInfo): Promise<string> {
    let result: string = '';

    let response = await axios.get(
      `https://www.googleapis.com/drive/v3/files/${_file.id}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        params: {
          alt: `media`,
        },
      }
    );

    if (response.data) {
      result = JSON.stringify(response.data);
    }

    return result;
  }

  async createSyncFile(): Promise<void> {
    let collections = await Collections.fetch();
    let _json = JSON.stringify(collections);

    const fileName = `addy-sync.json`;
    const blob = new Blob([_json], { type: 'application/json' });

    //selectFile is File Object
    var metadata = {
      name: fileName,
      mimeType: 'application/json',
      parents: ['appDataFolder'],
    };

    var form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    form.append('file', blob);

    await axios.post(
      `https://www.googleapis.com/upload/drive/v3/files`,

      form,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-type': `application/json`,
        },
        params: {
          uploadType: `multipart`,
        },
      }
    );

    return;
  }

  async updateSyncFile(_file: IFileInfo): Promise<void> {
    let collections = await Collections.fetch();
    let _json = JSON.stringify(collections);

    const fileName = `addy-sync.json`;
    const blob = new Blob([_json], { type: 'application/json' });

    //selectFile is File Object
    var metadata = {
      name: fileName,
      mimeType: 'application/json',
    };

    var form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    form.append('file', blob);

    await axios.patch<File>(
      `https://www.googleapis.com/upload/drive/v3/files/${_file.id}`,

      form,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-type': `application/json`,
        },
        params: {
          uploadType: `multipart`,
        },
      }
    );

    return;
  }

  async deleteSyncFile(_file: IFileInfo): Promise<void> {
    await axios.delete(
      `https://www.googleapis.com/drive/v3/files/${_file.id}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        params: {
          spaces: `appDataFolder`,
        },
      }
    );

    return;
  }

  async connectionTest(): Promise<boolean> {
    await this.searchSyncFile();

    let response = await axios.get<IGoogleDriveSearchFile>(
      `https://www.googleapis.com/drive/v3/files`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        params: {
          q: `name = 'addy-sync.json'`,
          spaces: `appDataFolder`,
        },
      }
    );

    if (response.status == 200) {
      return true;
    }

    return false;
  }
}

export default GoogleDrive;
