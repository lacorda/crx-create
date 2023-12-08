import classnames from 'classnames';
import { Button } from 'antd';
import { useBem, useStorage } from '@root/common/utils/hooks';
import ThemeStorage from '@common/storages/themeStorage';
import icon from '../../assets/images/icon-128.png';
import './Popup.scss';

const prefixCls = 'chrome-extension-popup';

const Popup = () => {
  const bem = useBem(prefixCls);
  const theme = useStorage(ThemeStorage);

  return (
    <div className={bem()}>
      Popup
      <img src={icon} className="App-logo" alt="logo" />
      <div className={classnames(bem('theme'), bem(`theme-${theme}`))}>
        Theme: {theme}
      </div>
      <Button type='primary' onClick={ThemeStorage.toggle}>点击切换Theme</Button>
    </div>
  );
};

export default Popup;