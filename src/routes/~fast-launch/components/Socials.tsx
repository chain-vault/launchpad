import React from 'react';

import { SocialIconsMapList } from '@app-types/index';

import SocialsListing from '@components/SocialsListing';
import { useTokenMetadata } from '@hooks/useToken';

import { useTokenAddress } from '../hooks/useTokenAddress';

export const Socials: React.FC = () => {
  const { isMetaDataLoading, poolTokenMetadata } = useTokenMetadata(useTokenAddress(), true);
  const {
    discord = '',
    github = '',
    telegram = '',
    twitter = '',
    website = '',
  } = poolTokenMetadata ?? {};

  const socialLink: SocialIconsMapList = [
    { id: 'twitter', url: twitter },
    { id: 'discord', url: discord },
    { id: 'telegram', url: telegram },
    { id: 'website', url: website },
    { id: 'github', url: github },
  ];
  return (
    <SocialsListing
      isLoading={isMetaDataLoading}
      socialsList={socialLink}
      width={['48px', '54px']}
    />
  );
};
