import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import { PageHeader } from '@components/PageHeader';

import { CompletedPools } from './Completed';
import { UpcomingAndLivePools } from './Upcoming';

export const ListPools: React.FC = () => (
  <Box width="100%">
    <Container mb={20} variant="container.1080">
      <PageHeader title="Live & Upcoming Pools" includePoolNav />
      <Tabs size={{ base: 'base', md: 'md' }} variant="secondary" isLazy>
        <TabList _dark={{ borderColor: 'base.600' }}>
          <Tab>All Pools</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <UpcomingAndLivePools />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
    <Container variant="container.1080">
      <PageHeader title="Completed Pools" />
      <Tabs size={{ base: 'base', md: 'md' }} variant="secondary" isLazy>
        <TabList _dark={{ borderColor: 'base.600' }}>
          <Tab>All Pools</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <CompletedPools />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  </Box>
);
