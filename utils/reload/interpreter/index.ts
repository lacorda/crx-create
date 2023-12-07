import type { WebSocketMessage, SerializedMessage } from '../../types';

// 消息JSON序列化与反序列化
export default class MessageInterpreter {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  static send(message: WebSocketMessage): SerializedMessage {
    return JSON.stringify(message);
  }
  static receive(serializedMessage: SerializedMessage): WebSocketMessage {
    return JSON.parse(serializedMessage);
  }
}
