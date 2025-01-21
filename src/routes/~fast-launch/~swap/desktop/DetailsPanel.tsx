import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import { BubbleMap } from '@components/BubbleMap';
import BubbleMapModal from '@components/BubbleMap/BubbleMapModal';
import { isApeInBubbleMapEnabled } from '@constants/config/features';
import { useGetPoolById } from '@hooks/apein/useGetPool';
import { HoldersList } from '@routes/~fast-launch/components/Holders';
import { ProjectInfo } from '@routes/~fast-launch/components/ProjectInfo';
import { TransactionsList } from '@routes/~fast-launch/components/Transactions';
import { useFastLaunchSearchParams } from '@routes/~fast-launch/hooks/useFastLaunchSearchParams';

export const DetailsPanelDesktop = () => {
  const {
    isOpen: isBubbleMapModalOpen,
    onClose: onBubbleMapModalClose,
    onOpen: onBubbleMapModalOpen,
  } = useDisclosure();
  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(
    useFastLaunchSearchParams().pool
  );
  const tokenId = poolData?.token.toString();

  return (
    <Box mt={5}>
      <Tabs colorScheme="accent" size={{ base: 'base', md: 'md' }} variant="classic">
        <TabList>
          <Tab>
            <Text textStyle="body-sm-bold">Project Description</Text>
          </Tab>
          <Tab>
            <Text textStyle="body-sm-bold">Holders</Text>
          </Tab>
          <Tab>
            <Text textStyle="body-sm-bold">Transactions</Text>
          </Tab>

          {isApeInBubbleMapEnabled && tokenId && (
            <Box cursor="pointer" onClick={onBubbleMapModalOpen} pt="6px">
              <Text opacity={0.5} textStyle="body-sm-bold">
                Bubble Map
              </Text>
            </Box>
          )}
        </TabList>

        <TabPanels>
          <TabPanel>
            <ProjectInfo />
          </TabPanel>
          <TabPanel>
            <HoldersList />
          </TabPanel>
          <TabPanel>
            <TransactionsList />
          </TabPanel>
          {isApeInBubbleMapEnabled && tokenId && (
            <TabPanel>
              <BubbleMap loading={isPoolDataLoading} token={tokenId} />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
      <BubbleMapModal
        isOpen={isBubbleMapModalOpen}
        loading={isPoolDataLoading}
        onClose={onBubbleMapModalClose}
        token={tokenId || ''}
      />
    </Box>
  );
};
