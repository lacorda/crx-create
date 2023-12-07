import { WebSocket, WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import { LOCAL_RELOAD_SOCKET_PORT, LOCAL_RELOAD_SOCKET_URL } from '../constants';
import MessageInterpreter from './interpreter';
import { debounce } from './utils';

const clientsThatNeedToUpdate: Set<WebSocket> = new Set();

let needToForceReload = false;

function initReloadServer() {
  // 创建一个 WebSocket 服务
  const wss = new WebSocketServer({ port: LOCAL_RELOAD_SOCKET_PORT });

  wss.on('listening', () => console.log(`[HRS] Server listening at ${LOCAL_RELOAD_SOCKET_URL}`));

  wss.on('connection', ws => {
    clientsThatNeedToUpdate.add(ws);

    // 监听客户端的关闭
    ws.addEventListener('close', () => clientsThatNeedToUpdate.delete(ws));

    // 监听客户端的消息
    ws.addEventListener('message', event => {
      if (typeof event.data !== 'string') return;

      const message = MessageInterpreter.receive(event.data);
      console.log('🍄 server message', JSON.stringify(message));

      // 更新完成，关闭连接
      if (message.type === 'done_update') {
        ws.close();
      }

      // 构建完成，通知客户端更新
      if (message.type === 'build_complete') {
        clientsThatNeedToUpdate.forEach((ws: WebSocket) => ws.send(MessageInterpreter.send({ type: 'do_update' })));

        // 如果需要强制刷新，通知客户端强制刷新
        if (needToForceReload) {
          needToForceReload = false;
          clientsThatNeedToUpdate.forEach((ws: WebSocket) =>
            ws.send(MessageInterpreter.send({ type: 'force_reload' })),
          );
        }
      }
    });
  });
}

// 防抖函数，避免频繁触发
const debounceSrc = debounce(function (path: string) {
  // 将 Windows 路径转换为 Unix 路径
  const pathConverted = path.replace(/\\/g, '/');
  // 通知客户端等待更新
  clientsThatNeedToUpdate.forEach((ws: WebSocket) =>
    ws.send(MessageInterpreter.send({ type: 'wait_update', path: pathConverted })),
  );
}, 100);

// 监听 packages 目录下的文件变化
chokidar.watch('packages', { ignorePermissionErrors: true }).on('all', (_, path) => debounceSrc(path));

// 监听 manifest.js 文件变化，如果发生变化，需要强制刷新
chokidar.watch('manifest.js', { ignorePermissionErrors: true }).on('all', () => {
  needToForceReload = true;
});

initReloadServer();
