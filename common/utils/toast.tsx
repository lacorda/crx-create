import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Spin } from 'antd';

type ToastProps = {
  content: string;
  duration?: number;
  onClose?: () => void;
};

const Message = (props: ToastProps) => {
  const {
    content,
    duration = 2500,
    onClose,
  } = props;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (duration) {
      setTimeout(() => {
        setLoading(false);
        onClose && onClose();
      }, duration);
    }
  }, [])

  return (
    <Spin spinning={loading} tip={content} size="large" fullscreen />
  );
};

const toast = (options) => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  createRoot(div).render(<Message {...options} onClose={() => {
    createRoot(div).unmount();
    document.body.removeChild(div);
  }} />);
}

export default toast;
