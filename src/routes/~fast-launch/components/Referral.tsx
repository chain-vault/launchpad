import type { IconType } from 'react-icons';

import React, { useMemo } from 'react';

import { userAuthAtom } from '@atoms/index';
import {
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Spinner,
  Text,
  Tooltip,
  useClipboard,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { FaCheck, FaCoins, FaCopy, FaRegCopy } from 'react-icons/fa';
import { FaRepeat } from 'react-icons/fa6';
import { GoCrossReference } from 'react-icons/go';
import { RiAiGenerate } from 'react-icons/ri';

import { BasicModal } from '@components/ui/Modals';
import { ConnectWalletButton } from '@components/WalletAdapter';
import { UserAuthenticationStatus } from '@constants/index';
import useReferal from '@hooks/useReferal';

const MotionFlex = motion(Flex as any);

const IconWithText: React.FC<{ icon: IconType; text: string }> = ({ icon, text }) => (
  <HStack alignItems="center" gap={3} justifyContent="start">
    <Flex
      alignItems="center"
      bg="linear-gradient(45deg, #DF7E00, #ED4F73)"
      boxSize={10}
      justifyContent="center"
      maxH="40px"
      maxW="40px"
      minH="40px"
      minW="40px"
      rounded="full"
    >
      <Icon as={icon} boxSize={6} color="base.100" />
    </Flex>
    <Text textStyle="body-regular-bold">{text}</Text>
  </HStack>
);

const ReferralLinkDisplay: React.FC<{
  generateReferalCodeLoading: boolean;
  hasCopied: boolean;
  onCopy: () => void;
  onGetReferalCode: () => void;
  value: string;
}> = ({ generateReferalCodeLoading, hasCopied, onCopy, onGetReferalCode, value }) => (
  <Flex
    alignItems="center"
    bg="linear-gradient(45deg, #DF7E00, #ED4F73)"
    borderRadius="12px"
    h="40px"
    overflow="hidden"
    pl={4}
    position="relative"
    w="100%"
  >
    <Text
      flexGrow={1}
      flexShrink={1}
      maxW={['230px', '350px', '450px', '280px']}
      overflow="hidden"
      textOverflow="ellipsis"
      textStyle="body-md"
      whiteSpace="nowrap"
    >
      {value}
    </Text>
    <Flex alignItems="center" gap={1} position="absolute" right={2}>
      <Tooltip label="Regenerate referral">
        <IconButton
          icon={
            generateReferalCodeLoading ?
              <Spinner boxSize={4} />
            : <Icon as={FaRepeat} boxSize={4} />
          }
          _hover={{ bg: 'brand.accent.100', color: 'brand.accent.900' }}
          aria-label="regenerate"
          bg="base.100"
          color="brand.accent.600"
          onClick={onGetReferalCode}
          rounded="full"
          size="sm"
        />
      </Tooltip>
      <Tooltip label="Copy referral">
        <IconButton
          _hover={{ bg: 'brand.accent.100', color: 'brand.accent.900' }}
          aria-label="copy"
          bg="base.100"
          borderRadius="full"
          color="brand.accent.600"
          icon={hasCopied ? <FaCheck /> : <FaCopy />}
          onClick={onCopy}
          size="sm"
        />
      </Tooltip>
    </Flex>
  </Flex>
);

const ReferralSection: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: false });
  const userAuthState = useAtomValue(userAuthAtom);
  const { generateReferalCodeLoading, onGetReferalCode, referalCode } = useReferal();

  // Generate referal code
  // Get the url and set the search param referal with referral code generated
  const referalUrl = useMemo(() => {
    const url = new URL(window.location.href);
    if (referalCode) {
      url.searchParams.set('referal', referalCode);
    }
    return url.toString();
  }, [referalCode]);

  const { hasCopied, onCopy } = useClipboard(referalUrl);

  return (
    <>
      <BasicModal
        footer={
          userAuthState.authenticationStatus === UserAuthenticationStatus.USER_AUTHENTICATED ?
            referalCode ?
              <ReferralLinkDisplay
                generateReferalCodeLoading={generateReferalCodeLoading}
                hasCopied={hasCopied}
                onCopy={onCopy}
                onGetReferalCode={() => onGetReferalCode(true)}
                value={referalUrl}
              />
            : <Button
                bg="linear-gradient(45deg, #DF7E00, #ED4F73)"
                color="base.100"
                isLoading={generateReferalCodeLoading}
                onClick={() => onGetReferalCode()}
                variant="accent"
                w="100%"
              >
                <Text textStyle="body-regular-bold">Generate Referral Link</Text>
              </Button>

          : <ConnectWalletButton variant="accent" />
        }
        header={
          <Text textAlign="center" textStyle="h2">
            Share & earn points
          </Text>
        }
        modalBody={
          <Flex flexDirection="column" gap={6}>
            <IconWithText
              icon={RiAiGenerate}
              text="Generate your unique referral link by clicking the button below."
            />
            <IconWithText icon={FaRegCopy} text="Copy your link." />
            <IconWithText
              icon={GoCrossReference}
              text="Share with your community or friends. When they trade using your link you will get reward points."
            />
          </Flex>
        }
        modalContentProps={{
          bg: 'surface.base.100',
          border: 'none',
        }}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        isCentered
      />
      {referalCode ?
        <>
          <Text mb={2} textStyle="body-regular-bold">
            Refer & Earn
          </Text>
          <ReferralLinkDisplay
            generateReferalCodeLoading={generateReferalCodeLoading}
            hasCopied={hasCopied}
            onCopy={onCopy}
            onGetReferalCode={() => onGetReferalCode(true)}
            value={referalUrl}
          />
        </>
      : <MotionFlex
          animate={{
            background: [
              'linear-gradient(45deg, #DF7E00, #ED4F73)',
              'linear-gradient(45deg, #ED4F73, #DF7E00)',
            ],
          }}
          transition={{
            duration: 1,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
          alignItems="center"
          bg="linear-gradient(45deg, #DF7E00, #ED4F73)"
          borderRadius="12px !important"
          cursor="pointer"
          justifyContent="center"
          onClick={onOpen}
          px={4}
          py={3}
        >
          <HStack alignItems="center" gap={2} justifyContent="center" w="100%">
            <Text textStyle="body-regular-bold">Click to earn reward points through referral</Text>
            <Icon as={FaCoins} color="#F7F093" display={['none', 'flex']} />
          </HStack>
        </MotionFlex>
      }
    </>
  );
};

export default ReferralSection;
