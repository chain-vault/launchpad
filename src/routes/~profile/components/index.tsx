import {
  Flex,
  Link,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import withContainer from '@components/HOC/withContainer';
import { PageHeader } from '@components/PageHeader';
import { ActionButton } from '@components/ui/Button';
import WalletNotConnected from '@components/WalletNotConnected';
import { getExplorerUrlAddressUrl } from '@constants/config';
import useWalletConnection from '@hooks/useWalletConnection';

import ApeInPanel from './ApeInPanel';
import LBPPanel from './LBPPanel';
// import LBPPanel from './LBPPanel';

const Header = () => {
  const { user, view } = useSearch({ from: '/profile/' });

  return (
    <Flex alignItems="center" columnGap={4}>
      <Text textStyle="h2">Profile</Text>
      <Link
        _hover={{
          textUnderlineOffset: '4px',
        }}
        href={getExplorerUrlAddressUrl(user)}
        target="_blank"
      >
        <ActionButton
          action="View on Solscan"
          bg={view === 'pump' ? 'background.solScanFL' : 'background.solScanLbp'}
          color={view === 'pump' ? 'background.solScanFLColor' : 'background.solScanLbpColor'}
          gap={2}
          px={5}
          py={2}
          variant="link"
          w="fit-content"
        />
      </Link>
    </Flex>
  );
};

const ProfileSection = () => {
  const { isConnected } = useWalletConnection();
  const navigate = useNavigate({ from: '/profile' });

  const { view } = useSearch({
    from: '/profile/',
  });

  const tabIndex = view === 'lbp' ? 1 : 0;

  const handleTabsChange = (tab: number) => {
    const newTab = tab === 0 ? 'pump' : 'lbp';
    navigate({
      search: (prev) => ({ ...prev, view: newTab }),
      to: '/profile',
    });
  };

  return !isConnected ?
      <WalletNotConnected />
    : <SimpleGrid gap={6}>
        <PageHeader title={<Header />} />
        <Tabs
          index={tabIndex}
          onChange={handleTabsChange}
          size={{ base: 'base', md: 'md' }}
          variant="secondary"
          isLazy
        >
          <TabList _dark={{ borderColor: 'base.600' }}>
            <Tab
              _selected={{
                borderBottom: '2px solid',
                borderColor: 'brand.accent.600 !important',
                mb: '-2px',
                opacity: 1,
              }}
            >
              Ape In
            </Tab>
            <Tab>LBP</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <ApeInPanel />
            </TabPanel>
            <TabPanel px={0}>
              <LBPPanel />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SimpleGrid>;
};

export default withContainer(ProfileSection);
