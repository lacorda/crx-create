export type MessageType = {
  type: string;
  data?: Record<string, any>;
};

export type MessageCallback = (
  request: MessageType,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => void;