import { useState } from 'react';

import { LocalStorageKeys } from '@constants/index';

export type LocalStorageValue<T> = null | T;

/**
 * Custom hook to interact with local storage
 * @param key storage key
 * @param initialValue initial value store
 * @returns value corresponding to the key, function to set value and retrieve value
 */
const useLocalStorage = <T>(
  key: LocalStorageKeys,
  initialValue?: T
): [LocalStorageValue<T>, (value: T) => void, () => void] => {
  const storedValue = localStorage.getItem(key);
  const initial: LocalStorageValue<T> = storedValue ? JSON.parse(storedValue) : initialValue;

  const [value, setValue] = useState<LocalStorageValue<T>>(initial);

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  const getStoredValue = () => {
    const strorageValue = localStorage.getItem(key);
    return strorageValue ? JSON.parse(strorageValue) : null;
  };

  return [value, setStoredValue, getStoredValue];
};

export default useLocalStorage;
