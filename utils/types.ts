// 等待更新
type UpdatePendingMessage = {
  type: 'wait_update';
  path: string;
};
// 执行更新
type UpdateRequestMessage = {
  type: 'do_update';
};
// 更新完成
type UpdateCompleteMessage = {
  type: 'done_update'
};
// 构建完成
type BuildCompletionMessage = {
  type: 'build_complete'
};
// 强制刷新
type ForceReloadMessage = {
  type: 'force_reload'
};

export type SerializedMessage = string;

export type WebSocketMessage =
  | UpdateCompleteMessage
  | UpdateRequestMessage
  | UpdatePendingMessage
  | BuildCompletionMessage
  | ForceReloadMessage;

export type HMRConfig = {
  background?: boolean;
  view?: boolean;
};