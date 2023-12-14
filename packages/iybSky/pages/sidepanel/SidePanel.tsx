import { useStorage } from '@common/utils/hooks';
import ThemeStorage from '@common/storages/themeStorage';
import withSuspense from '@common/hoc/withSuspense';
import withErrorBoundary from '@common/hoc/withErrorBoundary';
import './SidePanel.scss';

const SidePanel = () => {
  const theme = useStorage(ThemeStorage);
  const [, darkAndLight] = theme.split('-');

  return (
    <div
      className="App"
      style={{
        backgroundColor: darkAndLight === 'light' ? '#fff' : '#000',
      }}>
      SidePanel
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(SidePanel, <div> Loading ... </div>),
  <div> Error Occur </div>
);
