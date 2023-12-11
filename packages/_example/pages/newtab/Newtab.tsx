import logo from '../../assets/images/logo.svg';
import './Newtab.css';
import './Newtab.scss';
import { useStorage } from '@common/utils/hooks';
import ThemeStorage from '@common/storages/themeStorage';
import withSuspense from '@common/hoc/withSuspense';
import withErrorBoundary from '@common/hoc/withErrorBoundary';

const Newtab = () => {
  const theme = useStorage(ThemeStorage);
  const [, darkAndLight] = theme.split('-');

  return (
    <div
      className="App"
      style={{
        backgroundColor: darkAndLight === 'light' ? '#ffffff' : '#000000',
      }}>
      <img src={logo} className="App-logo" alt="logo" />
      Example NewTab
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(Newtab, <div> Loading ... </div>),
  <div> Error Occur </div>
);
