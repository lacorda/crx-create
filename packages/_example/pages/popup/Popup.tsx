import classnames from 'classnames';
import { Button, ConfigProvider, Space } from 'antd';
import { useAsyncEffect, useSetState } from 'ahooks'
import { useBem, useStorage } from '@common/utils/hooks';
import { Icon } from '@common/components';
import ThemeStorage from '@common/storages/themeStorage';
import MessageStorage from '@common/storages/messageStorage';
import { THEME_COLOR_MAP } from '@common/constants';
import { getCurrentTab } from '@common/utils/chrome';
import icon from '../../assets/images/icon-128.png';
import './Popup.scss';

const prefixCls = 'chrome-extension-popup';
const itemCls = 'cellitem';

type DownloadItem = chrome.downloads.DownloadItem & { name: string };

const Popup = () => {
  const bem = useBem(prefixCls);
  const itemBem = useBem(itemCls);

  const theme = useStorage(ThemeStorage);
  const message = useStorage(MessageStorage);

  const [state, setState] = useSetState({
    downloadItems: [],
  });

  const [themeColor, darkAndLight] = theme.split('-');

  useAsyncEffect(async () => {
    const tab = await getCurrentTab();
    console.log('🍄  popup ui 3', tab);
  }, []);

  const handleGetDownloaded = () => {
    chrome.downloads.search({ state: 'complete', limit: 3 }, (results) => {
      console.log('🍄  results', results);
      (results as DownloadItem[]).forEach((item) => {
        const { filename } = item;
        const paths = filename.split('/');
        const name = paths[paths.length - 1];
        item.name = name;
      })
      setState({ downloadItems: results });
    });
  }

  const handleDownload = (item: DownloadItem) => {
    chrome.downloads.download({ url: item.url, filename: item.name });
  }

  const handleNotifications = () => {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: icon,
      title: '通知',
      message: '这是一条通知',
      buttons: [
        { title: '取消' },
        { title: '确认' },
      ],
    });
  }

  const handleGEO = () => {
    chrome.runtime.sendMessage({ type: 'geo' });
  }

  const handleClipboardWrite = () => {
    chrome.runtime.sendMessage({ type: 'clipboard' });
  }

  const handleTabCapture = () => {
    chrome.runtime.sendMessage({ type: 'tabCapture' });
  }

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
        <div className={itemBem()}>
          <div className={itemBem('label')}>下载列表:</div>
          <div className={itemBem('value')}>
            <Button type='primary' onClick={handleGetDownloaded} >获取3个曾下载文件</Button>
            {
              state.downloadItems.map((item, index) => (
                <div className='download-item' key={index} onClick={() => { handleDownload(item) }}>{item.filename}</div>
              ))
            }
          </div>
        </div>
        <div className={itemBem()}>
          <div className={itemBem('label')}>通告弹窗:</div>
          <div className={itemBem('value')}>
            <Button type='primary' onClick={handleNotifications} >notifications</Button>
          </div>
        </div>
        <div className={itemBem()}>
          <div className={itemBem('label')}>离屏文档:</div>
          <div className={itemBem('value')}>
            <Space>
              <Button type='primary' onClick={handleGEO}>GEO定位</Button>
              <Button type='primary' onClick={handleClipboardWrite}>复制粘贴</Button>
              <Button type='primary' onClick={handleTabCapture}>网页录制</Button>
            </Space>
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