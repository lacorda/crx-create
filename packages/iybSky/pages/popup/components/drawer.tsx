import React, { useEffect, useState } from 'react';
import { Drawer, Space, Button } from "antd";

interface PopupDrawerProps {
  title: string;
  open: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onOk?: () => void;
  children: React.ReactNode;
}

const PopupDrawer = (props: PopupDrawerProps) => {
  const {
    title,
    open,
    onClose,
    onCancel,
    onOk,
    children,
  } = props;

  const [showDrawer, setShowDrawer] = useState(open);

  useEffect(() => {
    setShowDrawer(open);
  }, [open]);

  const handleClose = () => {
    setShowDrawer(false);
    onClose && onClose();
  }

  const handleCancel = () => {
    setShowDrawer(false);
    onCancel && onCancel();
  }

  const handleOK = () => {
    onOk && onOk();
  }

  return (
    <Drawer
      title={title}
      placement="right"
      width={380}
      onClose={handleClose}
      open={showDrawer}
      extra={
        <Space>
          <Button onClick={handleCancel}>关闭</Button>
          <Button type="primary" onClick={handleOK}>
            确定
          </Button>
        </Space>
      }
    >
      {children}
    </Drawer>
  );
};

export default PopupDrawer;