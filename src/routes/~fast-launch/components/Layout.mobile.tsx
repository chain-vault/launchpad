import React, { ReactNode } from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import isFunction from 'lodash/isFunction';

import { tabsAtom } from '../state/atom';
import { TabNames, TABS } from '../types';
import { Header } from './Header';

type LayoutProps = {
  children: (tabName: TabNames) => ReactNode;
};
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [selectedTab, updateTab] = useAtom(tabsAtom);
  const onClickHandler = (tabName: TabNames) => {
    updateTab(tabName);
  };
  return (
    <Box minHeight="100vh" pb="60px" textStyle="body-xs">
      <Box px={4}>
        <Box mb={2}>
          <Header />
        </Box>
        <Box>{isFunction(children) ? children(selectedTab) : null}</Box>
      </Box>
      <Box
        bg="surface.base.900"
        bottom={0}
        color="surface.base.100"
        left={0}
        position="fixed"
        px={2}
        right={0}
        zIndex={9999}
      >
        <Flex
          _after={{
            bg: 'base.500',
            borderRadius: 20,
            bottom: 0,
            content: "''",
            height: '4px',
            left: 0,
            position: 'absolute',
            right: 0,
          }}
          direction="row"
          position="relative"
          px={1}
          py={1}
        >
          {Object.values(TABS).map((item) => (
            <Flex
              _after={
                item === selectedTab ?
                  {
                    bg: 'surface.base.100',

                    borderRadius: 'lg',
                    bottom: '-4px',
                    content: "''",
                    height: '2px',
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    zIndex: 2,
                  }
                : {}
              }
              alignItems="center"
              cursor="pointer"
              flex={1}
              fontWeight="bold"
              justifyContent="center"
              key={item}
              onClick={() => onClickHandler(item)}
              position="relative"
              px={2}
              py={4}
              textStyle="body-regular-extrabold"
              transition="all ease .2s"
            >
              <Text opacity={item === selectedTab ? 1 : 0.5}>{item}</Text>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};
