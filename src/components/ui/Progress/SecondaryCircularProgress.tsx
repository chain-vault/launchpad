import { CircularProgress, CircularProgressProps } from '@chakra-ui/react';
import { css } from '@emotion/react';

interface CustomCircularProgressProps extends CircularProgressProps {}

const CustomCircularProgress = (props: CustomCircularProgressProps) => (
  <CircularProgress
    css={css`
      .chakra-progress__track {
        opacity: 0.3;
      }
      .chakra-progress__indicator {
        opacity: 1;
      }
    `}
    color="brand.secondary.600"
    trackColor="brand.secondary.600"
    isIndeterminate
    {...props}
  />
);

export default CustomCircularProgress;
