import React, { type ReactNode } from 'react';

import { Box, Img, Text, useColorModeValue } from '@chakra-ui/react';

import { LinkButton } from '@components/LinkButton';

type AlignProps = 'left' | 'right';

type BannerCardProps = {
  active?: boolean;
  align?: AlignProps;
  description: ReactNode;
  imageSrc: string;
  link?: string;
  link2?: string;
  linkActionDisabled?: boolean;
  linkText?: string;
  linkText2?: string;
  title: string;
  type?: string;
};

export const BannerCard: React.FC<BannerCardProps> = ({
  active = true,
  align = 'left',
  description,
  imageSrc,
  link = '',
  link2 = '',
  linkActionDisabled,
  linkText,
  linkText2,
  title,
  type = 'lbp',
}) => {
  const bg = useColorModeValue(
    type === 'lbp' ?
      'linear-gradient(180deg, rgba(249, 242, 175, 1) 0%, rgba(255, 255, 255, 1) 100%)'
    : 'linear-gradient(180deg, rgba(233, 212, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)',
    type === 'lbp' ?
      'linear-gradient(180deg, rgba(70, 63, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)'
    : 'linear-gradient(180deg, rgba(59, 22, 98, 1) 0%, rgba(0, 0, 0, 0) 100%)'
  );
  return (
    <Box
      bgGradient={bg}
      borderRadius="40px"
      color="surface.base.900"
      display="flex"
      flexDirection="column"
      height={304}
      overflow="hidden"
      p={8}
      position="relative"
      textAlign={align}
    >
      <Box position="relative" zIndex={2}>
        <Box mb={3}>
          <Text textStyle="h2">{title}</Text>
        </Box>
        <Box display="flex" justifyContent={align === 'right' ? 'flex-end' : 'flex-start'} mt={1}>
          <Text maxW={['250px', '360px']} opacity={0.6} textStyle="body-regular">
            {description}
          </Text>
        </Box>
      </Box>
      <Box
        bottom="12px"
        display="flex"
        justifyContent={align === 'right' ? 'flex-end' : 'flex-start'}
        left="12px"
        position="absolute"
        right="12px"
        zIndex={2}
      >
        <LinkButton
          variant={
            active ?
              type === 'lbp' ?
                'outline-lbp'
              : 'accent'
            : 'inactive'
          }
          align={align}
          disabled={linkActionDisabled}
          isExternalLink={false}
          label={linkText || 'Start Now'}
          link={type === 'lbp' ? link2 : link}
          width="210px"
        />
        <Box w="18px" />
        <LinkButton
          variant={
            active ?
              type === 'lbp' ?
                'solid'
              : 'outline-ape'
            : 'inactive'
          }
          align={align}
          isExternalLink={type === 'lbp'}
          label={linkText2 || 'Explore'}
          link={type === 'lbp' ? link : link2}
          width="210px"
        />
      </Box>
      <Box
        display="flex"
        inset={0}
        justifyContent={align === 'left' ? 'flex-end' : 'flex-start'}
        position="absolute"
        userSelect="none"
      >
        <Img alt={title} filter={active ? 'none' : 'grayscale(100%)'} height={300} src={imageSrc} />
      </Box>
    </Box>
  );
};
