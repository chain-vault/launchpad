import { useCallback, useRef } from 'react';

import isFunction from 'lodash/isFunction';
import { Id, ToastOptions } from 'react-toastify';

import { NotificationToast, NotificationToastProps } from '@components/ui/NotificationToast';
import { getExplorerUrl, ToastType } from '@constants/index';

import useToast from './useToast';

const DEFAULT_SETTINGS: ToastOptions = {
  autoClose: 5000,
  bodyStyle: {
    padding: 0,
  },
  closeButton: false,
  pauseOnHover: true,
  position: 'top-right',
  style: {
    background: 'transparentt',
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    padding: '0',
    top: 50,
  },
};

type ActionTypes = {
  onRetry?: (() => void) | undefined;
  transaction?: string | undefined;
};

const validateConfig = (config: ToastOptions, toastType?: ToastType): ToastOptions => {
  if (toastType && toastType === ToastType.LOADING) {
    return {
      ...config,
      autoClose: false,
    };
  }
  return config;
};

export const createActions = ({ onRetry, transaction }: ActionTypes) => {
  const actions = [];
  if (isFunction(onRetry)) {
    actions.push({
      label: 'Retry',
      onClick: onRetry,
    });
  }
  if (transaction) {
    actions.push({
      label: 'View Transaction',
      link: getExplorerUrl(transaction),
    });
  }
  return actions;
};

export const useProgressiveToast = (
  options: ToastOptions = {},
  toastOptions: Partial<NotificationToastProps> = {}
) => {
  const toastId = useRef<Id | null>(null);

  const { showCustomToast, toast } = useToast({
    ...options,
    ...DEFAULT_SETTINGS,
    onClose: () => {
      toastId.current = null;
    },
  });

  const close = useCallback(() => {
    if (toastId.current) {
      toast.dismiss(toastId.current);
    }
  }, [toast, toastId]);

  const showToast = useCallback(
    (notificationProps: NotificationToastProps, updateOptions?: ToastOptions) => {
      const mergedOptions = validateConfig(
        { ...DEFAULT_SETTINGS, ...options, ...updateOptions },
        notificationProps.type
      );

      const config = { ...toastOptions, ...notificationProps, onClose: close };

      if (toastId.current) {
        toast.update(toastId.current, {
          ...mergedOptions,
          render: <NotificationToast {...config} onClose={close} />,
        });
      } else {
        toastId.current = showCustomToast(
          <NotificationToast {...config} onClose={close} />,
          mergedOptions
        );
      }
      return toastId;
    },
    [close, options, showCustomToast, toast, toastId, toastOptions]
  );
  return {
    close,
    showToast,
    toastId: toastId.current,
  };
};
