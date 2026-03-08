import toast from 'react-hot-toast';

/**
 * Custom styled toast notifications for the Karman application.
 * Utilizes react-hot-toast but applies our specific UI theme.
 */
const customToast = {
    success: (message) => {
        toast.success(message, {
            style: {
                background: '#131b26', // karman-bg
                color: '#e2e8f0', // karman-text
                border: '1px solid #1b2535', // karman-border
                boxShadow: '0 0 20px rgba(36, 59, 85, 0.4)',
                borderRadius: '12px',
            },
            iconTheme: {
                primary: '#4ade80', // green
                secondary: '#131b26',
            },
        });
    },
    error: (message) => {
        toast.error(message, {
            style: {
                background: '#131b26', // karman-bg
                color: '#e2e8f0', // karman-text
                border: '1px solid #ef444450', // red-500/50
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.15)',
                borderRadius: '12px',
            },
            iconTheme: {
                primary: '#ef4444', // red
                secondary: '#131b26',
            },
        });
    },
    loading: (message) => {
        return toast.loading(message, {
            style: {
                background: '#131b26',
                color: '#e2e8f0',
                border: '1px solid #1b2535',
                borderRadius: '12px',
            },
        });
    },
    dismiss: toast.dismiss,
};

export default customToast;
