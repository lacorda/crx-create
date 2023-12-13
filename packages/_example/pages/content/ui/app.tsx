import { useEffect, useState } from 'react';
import { Drawer, FloatButton } from 'antd';

// FIXME: content内不能使用相对路径，因为content的js是注入到页面的，相对路径是相对于页面的
// import './app.scss';

export default function App() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log('content view loaded');
  }, []);

  const handleOpenDrawer = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <div className='crx-create'>
      <Drawer
        title="Basic Drawer"
        placement="right"
        onClose={handleClose}
        open={open}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
      <FloatButton onClick={handleOpenDrawer} />
    </div>
  )
}
