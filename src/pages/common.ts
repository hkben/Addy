import Browser from 'webextension-polyfill';

class Common {
  static isSupportedProtocol(urlString?: string) {
    var supportedProtocols = ['https:', 'http:', 'ftp:', 'file:'];
    var url = document.createElement('a');
    url.href = urlString || '';
    return supportedProtocols.indexOf(url.protocol) != -1;
  }

  static async saveCurrentTabToCollection(
    collectionId: number
  ): Promise<boolean> {
    let currentTab: Browser.Tabs.Tab;

    var gettingActiveTab = await Browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (gettingActiveTab.length <= 0) {
      console.log('No Tabs');
      return false;
    }

    return true;
  }
}

export default Common;
