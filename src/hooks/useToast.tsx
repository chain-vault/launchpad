import { ReactElement, useCallback } from 'react';

import { ReactNode } from '@tanstack/react-router';
import { toast, ToastOptions } from 'react-toastify';

import Toast from '@components/ui/Toast';
import { ToastType } from '@constants/index';

const useToast = (options: ToastOptions = {}) => {
  /**
   * Function to show success toast
   * @param message message to display on toast
   * @param info information about the action
   */
  const successToast = (message: ReactNode) => {
    toast(<Toast message={message} toastType={ToastType.SUCCESS} />, options);
  };
  const showCustomToast = (Component: ReactElement, customToastOptions: ToastOptions = {}) =>
    toast(Component, { ...options, ...customToastOptions });

  /**
   * Function to show error toast
   * @param message message to display on toast
   * @param info information about the action
   */
  const errorToast = useCallback(
    (message: string) => {
      toast(<Toast message={message} toastType={ToastType.FAILED} />, options);
    },
    [options]
  );

  return { errorToast, showCustomToast, successToast, toast };
};

export default useToast;
