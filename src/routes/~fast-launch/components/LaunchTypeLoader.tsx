import React, { useEffect, useRef, useState } from 'react';

import { Box, Fade, Image } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

import { CurveIndex } from '@constants/config';

import IconNanoLaunch from '@assets/imges/icon-nano-launch.png';
import IconPrimeLaunch from '@assets/imges/icon-prime-launch.png';

export const FormLaunchTypeLoader: React.FC = () => {
  const { getValues, watch } = useFormContext();
  const type = useRef<CurveIndex | null>(getValues().type);
  const [showLoader, setLoader] = useState<boolean>(false);
  const [disableSelection, setDisable] = useState(false);
  const fadeInLoader = async () => {
    setDisable(true);
    setLoader(true);
  };
  watch(['type']);
  useEffect(() => {
    const value = getValues().type;
    if (type.current && value !== type.current) {
      fadeInLoader();
    }
    type.current = value;
  });

  const onAnimationEnd = () => {
    setLoader(false);
    if (!showLoader) {
      setDisable(false);
    }
  };

  return (
    <>
      {disableSelection && <Box borderRadius="40px" inset={0} position="absolute" zIndex={21} />}
      <Fade
        style={{
          alignItems: 'flex-start',
          backdropFilter: 'blur(25px)',
          background: ' rgba(255, 255, 255, 0.20)',
          borderRadius: '40px',
          display: 'flex',
          inset: 0,
          justifyContent: 'center',
          opacity: '.5',
          position: 'absolute',
          zIndex: '20',
        }}
        transition={{
          enter: { duration: 0.5 },
          exit: { duration: 0.5 },
        }}
        in={showLoader}
        onAnimationComplete={onAnimationEnd}
        unmountOnExit={!disableSelection}
      >
        <Image
          maxW={getValues().type === CurveIndex.NANO_LAUNCH ? 200 : 280}
          mt={{ base: '50vh', md: '40%' }}
          src={getValues().type === CurveIndex.NANO_LAUNCH ? IconNanoLaunch : IconPrimeLaunch}
          width="80%"
        />
      </Fade>
    </>
  );
};
