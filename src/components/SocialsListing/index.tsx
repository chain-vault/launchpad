import { HStack, Icon, IconButton, type IconButtonProps, Skeleton } from '@chakra-ui/react';

import { SOCIAL_ICONS_MAP, type SocialIconsMapList } from '@app-types/index';

import { generateProfileUrl } from '@utils/buildUrl';

interface SocialsListingProps extends Partial<IconButtonProps> {
  align?: 'left' | 'right';
  isLoading?: boolean;
  socialsList: SocialIconsMapList;
}

const SocialsListing = ({
  align = 'right',
  isLoading = false,
  socialsList,
  ...buttonProps
}: SocialsListingProps) => (
  <HStack
    alignItems="center"
    gap={1}
    h="100%"
    justifyContent={align === 'right' ? 'flex-end' : 'flex-start'}
  >
    {socialsList.map(({ id, isDisabled, url }) =>
      url ?
        <Skeleton isLoaded={!isLoading} key={id}>
          <IconButton
            aria-label={`${id}`}
            as={isDisabled ? 'button' : 'a'}
            href={generateProfileUrl(url, id)}
            icon={<Icon as={SOCIAL_ICONS_MAP[id]} />}
            isDisabled={isDisabled}
            key={id}
            rel="noopener noreferrer"
            target="_blank"
            variant={buttonProps.variant ?? 'ghost'}
            w={buttonProps.w || buttonProps.width || 'auto'}
            {...buttonProps}
            onClick={(e) => e.stopPropagation()}
          />
        </Skeleton>
      : null
    )}
  </HStack>
);

export default SocialsListing;
