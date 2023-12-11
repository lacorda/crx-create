import classnames from 'classnames';
import { Button, ConfigProvider, Space } from 'antd';
import { useBem, useStorage } from '@common/utils/hooks';
import { Editor, Icon } from '../../components';
import ThemeStorage from '@common/storages/themeStorage';
import { THEME_COLOR_MAP } from '@common/config';
import icon from '../../assets/images/icon-128.png';
import './Popup.scss';

const prefixCls = 'chrome-extension-popup';
const itemCls = 'cellitem';

const Popup = () => {
  const bem = useBem(prefixCls);
  const itemBem = useBem(itemCls);

  const theme = useStorage(ThemeStorage);
  const [themeColor, darkAndLight] = theme.split('-');

  return (
    <ConfigProvider theme={{ token: THEME_COLOR_MAP[themeColor] }}>
      <div className={classnames(bem(), bem('', darkAndLight))}>
        <div className={itemBem()}>
          <div className={itemBem('label')}>图片:</div>
          <div className={itemBem('value')}>
            <img src={icon} className="example-image" alt="logo" /></div>
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
          <div className={itemBem('label')}>编辑器:</div>
          <div className={itemBem('value')}>
            <Editor theme={darkAndLight} />
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
};

export default Popup;