import React from 'react';

import {
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Link,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { RxExternalLink } from 'react-icons/rx';

import { getTokenLockLink } from '@constants/config';
import { useGetPoolById } from '@hooks/apein/useGetPool';
import { formatPercent } from '@utils/formatNumbers';

import { useFastLaunchSearchParams } from '../hooks/useFastLaunchSearchParams';
import { useTokenLock } from '../hooks/useLockCountdown';

const LockButton: React.FC<{ isLockActive: boolean; label: string }> = ({
  isLockActive,
  label,
}) => (
  <Button as="div" variant="ghost">
    {isLockActive && (
      <>
        <Text opacity={0.5} textStyle="body-md">
          Unlock :
        </Text>
        <Text as="span" color="brand.accent.600" ml={1} textStyle="body-md">
          {label}
        </Text>
      </>
    )}
    {!isLockActive && <Text>Tokens Unlocked</Text>}
  </Button>
);
export const DeveloperInfo: React.FC = () => {
  const { data: poolData } = useGetPoolById(useFastLaunchSearchParams().pool);
  const { isLockActive, label } = useTokenLock(poolData?.lockEndTime);

  return isLockActive ?
      <Card>
        <CardBody fontSize={14}>
          {poolData?.developerAllocation && (
            <Grid mb={2} templateColumns="repeat(2, minmax(0, 1fr))">
              <GridItem alignSelf="center" textStyle="body-md-bold">
                Developer allocation
              </GridItem>
              <GridItem alignSelf="center">
                <Flex justifyContent="flex-end">
                  <Tooltip label={poolData?.developerAllocation.valueOf()}>
                    <Button as="div" variant="ghost">
                      <Text as="span" color="brand.accent.600" ml={1} textStyle="body-md-bold">
                        {formatPercent(poolData?.developerAllocation)}
                      </Text>
                    </Button>
                  </Tooltip>
                </Flex>
              </GridItem>
            </Grid>
          )}
          <Grid templateColumns="repeat(2, minmax(0, 1fr))">
            <GridItem alignSelf="center" textStyle="body-md-bold">
              Developer token lock
            </GridItem>
            {poolData?.hasTokenLockBeenApplied && (
              <GridItem alignSelf="center">
                <Flex alignItems="center" justifyContent="flex-end">
                  <LockButton isLockActive={isLockActive} label={label} />
                  <Tooltip label="Token lock contract">
                    <Link
                      href={getTokenLockLink(poolData?.token?.toString() ?? '')}
                      ml={2}
                      target="_blank"
                    >
                      <RxExternalLink />
                    </Link>
                  </Tooltip>
                </Flex>
              </GridItem>
            )}
          </Grid>
        </CardBody>
      </Card>
    : null;
};
