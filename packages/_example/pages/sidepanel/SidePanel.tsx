import logo from '@assets/img/logo.svg';
import './SidePanel.scss';
import { useStorage } from '@common/utils/hooks';
import ThemeStorage from '@common/storages/themeStorage';
import withSuspense from '@common/hoc/withSuspense';
import withErrorBoundary from '@common/hoc/withErrorBoundary';

const SidePanel = () => {
  const theme = useStorage(ThemeStorage);

  return (
    <div
      className="App"
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#000',
      }}>
      SidePanel
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(SidePanel, <div> Loading ... </div>),
  <div> Error Occur </div>
);
