import { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Drawer, FloatButton, ConfigProvider, Button, Space } from 'antd';
import { useLocalStorageState } from 'ahooks';
import MessageStorage from '@common/storages/messageStorage';
import { Icon } from '../../../components';
import { useBem } from '@common/utils/hooks';
import { THEME_STORAGE_KEY, THEME_COLOR_MAP } from '@common/constants';

// FIXME: content内不能使用相对路径，因为content的js是注入到页面的，相对路径是相对于页面的
// import './app.scss';

const prefixCls = 'chrome-extension-content';

export default function App() {
  const bem = useBem(prefixCls);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useLocalStorageState(THEME_STORAGE_KEY, {
    defaultValue: 'blue-light',
  });
  const [themeColor, darkAndLight] = theme.split('-');

  const addListener = () => {
    // 新建长连接
    console.log('🍄  content: >>>>>>>>>>>>>>>>>> 长连接建立', Date.now());
    const port = chrome.runtime.connect({ name: "from-content" });

    console.log('🍄  content: >>>>>>>>>>>>>>>>>> 长连接 发送消息', Date.now());
    port.postMessage({ from: "content 0" });

    port.onMessage.addListener((msg) => {
      console.log('🍄  content: >>>>>>>>>>>>>>>>>> 长连接 接收消息', Date.now(), port, msg);

      if (msg.from === "background 1") {
        port.postMessage({ from: "content 1" });
      } else if (msg.from === "background 2") {
        port.postMessage({ from: "content 2" });
      }
    });

    chrome.runtime.onMessage.addListener((msg) => {
      console.log('🍄  content: >>>>>>>>>>>>>>>>>> 接收 并 发送消息', Date.now(), msg);
      chrome.runtime.sendMessage(msg);
    })
  }

  useEffect(() => {
    console.log('content view loaded');

    addListener();
  }, []);

  const handleOpenDrawer = () => {
    setOpen(true);
    MessageStorage.setProperty({
      content: {
        openDrawer: true,
        from: 'content'
      }
    })
  }

  const handleClose = () => {
    setOpen(false);
    MessageStorage.setProperty({
      content: {
        openDrawer: false,
        from: 'content'
      }
    })
  }

  const handleChangeThemeColor = (color: string) => {
    setTheme(`${color}-${darkAndLight}`);
  }

  const handleToggleDarkAndLight = () => {
    setTheme(`${themeColor}-${darkAndLight === 'dark' ? 'light' : 'dark'}`);
  }

  return (
    <ConfigProvider theme={{ token: THEME_COLOR_MAP[themeColor] }}>
      <div className={classnames(bem(), bem('', darkAndLight))}>
        <Drawer
          className={classnames(bem('drawer'), bem('drawer', darkAndLight))}
          // 必须插到插件最外层，否则样式无法生效
          getContainer="#crx-create-root-_example"
          title="Basic Drawer"
          placement="right"
          onClose={handleClose}
          open={open}
        >
          <Space>
            <Button type='primary' onClick={() => { handleChangeThemeColor('blue') }}>蓝色</Button>
            <Button type='primary' onClick={() => { handleChangeThemeColor('green') }}>绿色</Button>
            <Button
              shape="circle"
              icon={darkAndLight === 'dark' ? <Icon type='icon-moonyueliang' /> : <Icon type='icon-taiyang' />}
              onClick={handleToggleDarkAndLight}
            />
          </Space>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>

        <FloatButton onClick={handleOpenDrawer} />
      </div>
    </ConfigProvider>

  )
}
