import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1A1A28',
          color: '#F8F8FF',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
          fontFamily: "'Satoshi', sans-serif",
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        },
        success: {
          iconTheme: {
            primary: '#7C3AED',
            secondary: '#F8F8FF',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#F8F8FF',
          },
        },
      }}
    />
  );
};

export default Toast;
