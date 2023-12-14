import classnames from 'classnames';
import { Button, ConfigProvider, Space } from 'antd';
import { useAsyncEffect } from 'ahooks'
import { useBem, useStorage } from '@common/utils/hooks';
import {
  // Editor,
  Icon
} from '../../components';
import ThemeStorage from '@common/storages/themeStorage';
import MessageStorage from '@common/storages/messageStorage';
import { THEME_COLOR_MAP } from '@common/constants';
import { getCurrentTab } from '@common/utils/chrome';
import icon from '../../assets/images/icon-128.png';
import './Popup.scss';
import { useEffect } from 'react';

const prefixCls = 'chrome-extension-popup';
const itemCls = 'cellitem';

const Popup = () => {
  const bem = useBem(prefixCls);
  const itemBem = useBem(itemCls);

  const theme = useStorage(ThemeStorage);
  const message = useStorage(MessageStorage);

  const [themeColor, darkAndLight] = theme.split('-');

  const addListener = () => {
    // 新建长连接
    console.log('🍄  popup: >>>>>>>>>>>>>>>>>> 长连接建立', Date.now());
    const port = chrome.runtime.connect({ name: "from-popup" });

    console.log('🍄  popup: >>>>>>>>>>>>>>>>>> 长连接 发送消息', Date.now());
    port.postMessage({ from: "popup 0" });

    port.onMessage.addListener(function (msg) {
      console.log('🍄  popup: >>>>>>>>>>>>>>>>>> 长连接 接收消息', Date.now(), port, msg);

      if (msg.from === "background 1") {
        port.postMessage({ from: "popup 1" });
      } else if (msg.from === "background 2") {
        port.postMessage({ from: "popup 2" });
      }
    });

    chrome.runtime.onMessage.addListener((msg) => {
      console.log('🍄  popup: >>>>>>>>>>>>>>>>>> 接收消息', Date.now(), msg);
    })
  }


  useAsyncEffect(async () => {
    const tab = await getCurrentTab();
    console.log('🍄  popup ui 3', tab);
  }, [])

  useEffect(() => {
    addListener();
  }, [])

  return (
    <ConfigProvider theme={{ token: THEME_COLOR_MAP[themeColor] }}>
      <div className={classnames(bem(), bem('', darkAndLight))}>
        <div className={itemBem()}>
          <div className={itemBem('label')}>Storage:</div>
          <div className={itemBem('value')}>
            {message.testCustom?.from}
          </div>
        </div>
        <div className={itemBem()}>
          <div className={itemBem('label')}>图片:</div>
          <div className={itemBem('value')}>
            <img src={icon} className="example-image" alt="logo" />
          </div>
        </div>
        <div className={itemBem()}>
          <div className={itemBem('label')}>背景图片:</div>
          <div className={itemBem('value')}>
            <span className="example-background"></span>
          </div>
        </div>
        <div className={itemBem()}>
          <div className={itemBem('label')}>切换主题:</div>
          <div className={itemBem('value')}>
            <Space>
              <Button type='primary' onClick={() => { ThemeStorage.setColor('blue') }}>蓝色</Button>
              <Button type='primary' onClick={() => { ThemeStorage.setColor('green') }}>绿色</Button>
            </Space>
          </div>
        </div>
        <div className={itemBem()}>
          <div className={itemBem('label')}>切换明暗:</div>
          <div className={itemBem('value')}>
            <Button
              shape="circle"
              icon={darkAndLight === 'dark' ? <Icon type='icon-moonyueliang' /> : <Icon type='icon-taiyang' />}
              onClick={ThemeStorage.toggleDarkAndLight}
            />
          </div>
        </div>
        {/* <div className={itemBem()}>
          <div className={itemBem('label')}>编辑器:</div>
          <div className={itemBem('value')}>
            <Editor theme={darkAndLight} />
          </div>
        </div> */}
      </div>
    </ConfigProvider>
  )
};

export default Popup;