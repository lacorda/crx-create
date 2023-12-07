import classnames from 'classnames';
import { useBem } from '@common/utils/hooks';
import './Popup.scss';

const prefixCls = 'chrome-extension-popup';

const Popup = () => {
  const bem = useBem(prefixCls);

  return (
    <div className={bem()}>
      Popup
    </div>
  );
};

export default Popup;