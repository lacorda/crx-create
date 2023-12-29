import { getPureUrl } from '@common/utils/tools';

export type OffscreenDocument = Client & chrome.runtime.ExtensionContext & {
  url?: string;
}

export const getDocuments: () => Promise<OffscreenDocument[] | []> = async () => {
  if ('getContexts' in chrome.runtime) {
    return chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT'],
    });
  } else {
    const matchedClients = await clients.matchAll();
    return matchedClients.filter(client => {
      return client.url.includes(chrome.runtime.id) && client.url.includes('offscreen/');
    });
  }
}

export const getDocument: (url: string) => Promise<OffscreenDocument | null> = async (url: string) => {
  const documents = await getDocuments();

  return documents.find((document: OffscreenDocument) => {
    document.url = document.url || document.documentUrl;
    const pureUrl = getPureUrl(document.url);
    return pureUrl.includes(url);
  });
}

export const hasDocument: () => Promise<boolean> = async () => {
  const documents = await getDocuments();
  return documents.length > 0;
}

export const closeDocument = async () => {
  if (await hasDocument()) {
    chrome.offscreen.closeDocument();
  }
}
