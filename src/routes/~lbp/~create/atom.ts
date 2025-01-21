import { useMemo } from 'react';

import { atom, useAtomValue, useSetAtom } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { atomWithStorage } from 'jotai/utils';
import { v4 as uuid } from 'uuid';

import { PoolAndTokenInititialiseData, TokenAndPoolAtomType } from './types';

export const defaulPoolData: PoolAndTokenInititialiseData = {
  formState: {
    launchInfo: false,
    projectInfo: false,
    socialsInfo: false,
    tokenInfo: false,
  },
  isDeleted: false,
  launchInfo: {
    date: null,
    spotPrice: '',
    startWeight: 90,
    tokenAmount: '',
  },
  metadatafileArviewId: '',
  projectInfo: {
    projectDescription: '',
    roadmap: '',
    website: '',
    whitePaper: '',
  },
  socialsInfo: {
    discord: '',
    github: '',
    telegram: '',
    twitter: '',
  },
  tokenInfo: {
    fileArweaveId: '',
    tokenLogo: null,
    tokenLogoFilePreview: null,
    tokenName: '',
    tokenSupply: '',
    tokenTicker: '',
  },
};

const formIntialData: TokenAndPoolAtomType = {
  new: defaulPoolData,
};

const customLocalStorage = {
  getItem: (key: string, initialValue: TokenAndPoolAtomType) => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      const parsedData: TokenAndPoolAtomType = JSON.parse(storedValue);
      Object.values(parsedData).forEach((value) => {
        if (value.launchInfo && value.launchInfo.date) {
          value.launchInfo.date = new Date(value.launchInfo.date);
        }
      });
      return parsedData;
    }
    return initialValue;
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
  setItem: (key: string, value: TokenAndPoolAtomType) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  subscribe: (
    key: string,
    callback: (value: TokenAndPoolAtomType) => void,
    initialValue: TokenAndPoolAtomType
  ) => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === key) {
        callback(event.newValue ? JSON.parse(event.newValue) : initialValue);
      }
    };
    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  },
};

export const tabIndexAtom = atom<number>(0);

export const writeOnlyTabIndexAtom = atom(null, (_get, set, update: number) => {
  set(tabIndexAtom, update);
});

export const tokenAndPoolInfoAtom = atomWithStorage(
  'token-and-pool-info',
  formIntialData,
  customLocalStorage,
  { getOnInit: true }
);

// export const tokenAndPoolInfoAtom = atom(formIntialData);

export const detailsReadOnlyAtom = atom((get) => get(tokenAndPoolInfoAtom));

export const useGetAtomWithId = (atomId: string) => {
  const atomWithId = useMemo(
    () => focusAtom(tokenAndPoolInfoAtom, (optic) => optic.prop(atomId)),
    [atomId]
  );
  const baseAtomValue: PoolAndTokenInititialiseData | undefined = useAtomValue(atomWithId);

  if (!baseAtomValue) throw new Error('Item not found');
  return atomWithId;
};

export const useGetMetadataFocusAtom = (atomId: string) => {
  const focusedParentAtom = useGetAtomWithId(atomId);

  return useMemo(
    () => focusAtom(focusedParentAtom, (optic) => optic.prop('metadatafileArviewId')),
    [focusedParentAtom]
  );
};

export const useGetFocusAtom = <
  K extends keyof Omit<PoolAndTokenInititialiseData, 'isDeleted' | 'metadatafileArviewId'>,
>(
  property: K,
  atomId: string
) => {
  const focusedParentAtom = useGetAtomWithId(atomId);

  const {
    focusPropertyAtom: focusedAtom,
    getfocusPropertyAtom: readonlyFocusedAtom,
    updatePropertyAtom: writeOnlyFocusedAtom,
  } = useMemo(() => {
    const focusPropertyAtom = focusAtom(focusedParentAtom, (optic) => optic.prop(property));
    const getfocusPropertyAtom = atom((get) => get(focusPropertyAtom));
    // Create an update atom specific to the property
    const updatePropertyAtom = atom(
      null,
      (
        get,
        set,
        {
          key,
          value,
        }: {
          key: keyof PoolAndTokenInititialiseData[K];
          value: PoolAndTokenInititialiseData[K][keyof PoolAndTokenInititialiseData[K]];
        }
      ) => {
        const propertyData = get(focusPropertyAtom);
        set(focusPropertyAtom, { ...propertyData, [key]: value });
      }
    );

    return {
      focusPropertyAtom,
      getfocusPropertyAtom,
      updatePropertyAtom,
    };
  }, [focusedParentAtom, property]);

  return {
    focusedAtom,
    readonlyFocusedAtom,
    writeOnlyFocusedAtom,
  };
};

export const useDuplicateNewAtom = () => {
  const setTokenAndPoolData = useSetAtom(tokenAndPoolInfoAtom);

  return () => {
    const draftId = uuid();
    setTokenAndPoolData((poolDatas) => {
      const draftData = {
        ...poolDatas,
        [draftId]: {
          ...poolDatas.new,
        },
      };
      return draftData;
    });
    return draftId;
  };
};
