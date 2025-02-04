import React, { useState } from 'react';

import {
  Box,
  Button,
  Card,
  chakra,
  Checkbox,
  Container,
  Flex,
  Heading,
  Link,
  Textarea,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { FormProvider, useForm } from 'react-hook-form';
import { FaQuestionCircle } from 'react-icons/fa';

import { FormHandler, FormInput } from '@components/ui/Form';
import InputGroup from '@components/ui/Input/InputGroup';
import { BasicModal } from '@components/ui/Modals';
import { TooltipWithIcon } from '@components/ui/Tooltip';
import { CurveIndex, DEPLOYMENT_BASE_COST, NATIVE_TOKEN } from '@constants/config';
import { getSocialLinkById } from '@constants/index';
import {
  ASCII_STRING_PATTERN,
  STRING_TWITTER_USERNAME,
  STRING_URL_PATTERN,
} from '@constants/stringPattern';
import { TOKEN_NAME_VALIDATION_RULES, TOKEN_SYMBOL_VALIDATION_RULES } from '@constants/validations';

import useMintToken from '../hooks/useMintFastLaunch';
import { modalStateAtom } from '../state/atom';
import { FastLaunchForm } from '../types';
import { FormFooter } from './FormFooter';
import { InitialBuyCount } from './InitialBuyCount';
import { FormLaunchTypeLoader } from './LaunchTypeLoader';
import { LockToken } from './LockToken';
import { MigrationDEX } from './MigrationDEX';
import { TokenLogo } from './TokenLogo';

export const CreateFastLaunch: React.FC = () => {
  const methods = useForm<FastLaunchForm>({
    defaultValues: {
      beastBiography: '',
      beastDescription: '',
      beastGreeting: '',
      discord: '',
      initialBuy: '',
      lockToken: {
        locked: false,
        period: '10',
      },
      migrationDEX: '0',
      otherLink: '',
      outToken: '',
      telegram: '',
      tokenLogo: null,
      tokenName: '',
      tokenTicker: '',
      twitter: '',
      type: CurveIndex.PRIME_LAUNCH,
      website: '',
    },
  });

  const { isPending, onCreatePool } = useMintToken(() => {
    methods.reset({}, { keepDefaultValues: true });
  });
  const {
    control,
    formState: { errors },

    handleSubmit,
  } = methods;
  const onSubmit = (values: FastLaunchForm) => {
    values.initialBuy = parseFloat(values.initialBuy as string);
    if (!isPending) {
      onCreatePool(values);
    }
  };

  const [modalState, setModalState] = useAtom(modalStateAtom);

  const [cost, setCost] = useState<string>(`${DEPLOYMENT_BASE_COST}`);
  const [tooltpContent, setToolTipContent] = useState('');
  const onCostChange = (costAmount: string, message: string) => {
    setCost(costAmount);
    setToolTipContent(message);
  };

  return (
    <>
      <Box w="100%">
        <Container maxW="container.xl" pb={5} textAlign="center">
          {/* {isPending && <Toast />} */}
          <Card
            bg="#2C3655 !important"
            borderColor="#2C3655 !important"
            borderRadius="8px !important"
            m="auto"
            maxW={684}
            minH={200}
            position="relative"
            pt={4}
          >
            <FormProvider {...methods}>
              <FormLaunchTypeLoader />
              <Box
                as="form"
                borderRadius="inherit"
                onSubmit={handleSubmit(onSubmit)}
                p={{ base: 0, md: 4 }}
              >
                <Flex flexDirection="column" h="100%" justifyContent="space-between" px={5}>
                  <Flex mb={4}>
                    <Heading letterSpacing="tight" size="lg">
                      Create your new AI Beast / Token
                    </Heading>
                  </Flex>
                  <Flex flexDirection="column" gap={4} mb={4}>
                    <FormHandler
                      inputField={
                        <FormInput<FastLaunchForm>
                          rules={{
                            ...TOKEN_NAME_VALIDATION_RULES,
                            pattern: ASCII_STRING_PATTERN,
                            required: 'Required field',
                          }}
                          control={control}
                          maxLength={32}
                          name="tokenName"
                          placeholder="Go for something beasty"
                        />
                      }
                      fieldError={errors.tokenName}
                      htmlFor="tokenName"
                      label="Name your Beast / Token"
                      required
                    />
                  </Flex>
                  <Flex flexDirection="column" gap={4} mb={4}>
                    <FormHandler
                      inputField={
                        <FormInput<FastLaunchForm>
                          inputProps={{
                            textTransform: 'uppercase',
                          }}
                          rules={{
                            ...TOKEN_SYMBOL_VALIDATION_RULES,
                            pattern: ASCII_STRING_PATTERN,
                            required: 'Required field',
                          }}
                          control={control}
                          maxLength={10}
                          name="tokenTicker"
                          placeholder="e.g. EXMPL"
                        />
                      }
                      fieldError={errors.tokenTicker}
                      htmlFor="tokenTicker"
                      label="Token ticker"
                      required
                    />
                  </Flex>
                  <Flex flexDirection="column" gap={4} mb={4}>
                    <TokenLogo label="Token Logo / Face for your Beast" />
                  </Flex>
                  <Flex flexDirection="column" gap={4} mb={4}>
                    <FormHandler
                      inputField={
                        <Textarea
                          bg="surface.base.700"
                          border="none"
                          {...methods.register('beastBiography', { required: true })}
                          placeholder="Tell it what it should know, how to behave."
                          resize="none"
                        />
                      }
                      alignOptionalLabel="right"
                      fieldError={errors.beastBiography}
                      htmlFor="beastBiography"
                      label="Feed the Beast"
                      required
                    />
                  </Flex>

                  <Flex flexDirection="column" gap={4} mb={4}>
                    <FormHandler
                      inputField={
                        <FormInput<FastLaunchForm>
                          rules={{
                            required: 'Required field',
                          }}
                          control={control}
                          name="beastGreeting"
                          placeholder="Type here your Beast's hello message"
                        />
                      }
                      fieldError={errors.beastGreeting}
                      htmlFor="beastGreeting"
                      label="Beast says Hello!"
                      required
                    />
                  </Flex>

                  <Flex flexDirection="column" gap={4} mb={4}>
                    <FormHandler
                      inputField={
                        <FormInput<FastLaunchForm>
                          rules={{
                            required: 'Required field',
                          }}
                          control={control}
                          name="beastDescription"
                          placeholder="Give a short tagline to tell people who your Beast is"
                        />
                      }
                      fieldError={errors.beastDescription}
                      htmlFor="beastDescription"
                      label="Who's your Beast?"
                      required
                    />
                  </Flex>

                  <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-between">
                    <Flex flexDirection="column" gap={4} mb={4} w={{ base: '100%', md: '48%' }}>
                      <FormHandler
                        inputField={
                          <FormInput<FastLaunchForm>
                            inputProps={{
                              autoCapitalize: 'off',
                            }}
                            rules={{
                              pattern: STRING_TWITTER_USERNAME,
                            }}
                            control={control}
                            name="twitter"
                            placeholder="Enter X (Twitter) Username"
                          />
                        }
                        alignOptionalLabel="right"
                        fieldError={errors.twitter}
                        htmlFor="twitter"
                        label="X (Twitter)"
                        optional
                      />
                    </Flex>
                    <Flex flexDirection="column" gap={4} mb={4} w={{ base: '100%', md: '48%' }}>
                      <FormHandler
                        inputField={
                          <FormInput<FastLaunchForm>
                            inputProps={{
                              autoCapitalize: 'off',
                            }}
                            rules={{
                              pattern: STRING_URL_PATTERN,
                            }}
                            control={control}
                            name="website"
                            placeholder="Enter Link"
                          />
                        }
                        alignOptionalLabel="right"
                        fieldError={errors.website}
                        htmlFor="website"
                        label="Website"
                        optional
                      />
                    </Flex>
                    <Flex flexDirection="column" gap={4} mb={4} w={{ base: '100%', md: '48%' }}>
                      <FormHandler
                        inputField={
                          <FormInput<FastLaunchForm>
                            inputProps={{
                              autoCapitalize: 'off',
                            }}
                            rules={{
                              pattern: STRING_URL_PATTERN,
                            }}
                            control={control}
                            name="telegram"
                            placeholder="Enter Telegram Link"
                          />
                        }
                        alignOptionalLabel="right"
                        fieldError={errors.telegram}
                        htmlFor="telegram"
                        label="Telegram"
                        optional
                      />
                    </Flex>
                    <Flex flexDirection="column" gap={4} mb={4} w={{ base: '100%', md: '48%' }}>
                      <FormHandler
                        inputField={
                          <FormInput<FastLaunchForm>
                            inputProps={{
                              autoCapitalize: 'off',
                            }}
                            rules={{
                              pattern: STRING_URL_PATTERN,
                            }}
                            control={control}
                            name="discord"
                            placeholder="Enter Discord Link"
                          />
                        }
                        alignOptionalLabel="right"
                        fieldError={errors.discord}
                        htmlFor="discord"
                        label="Discord"
                        optional
                      />
                    </Flex>
                  </Flex>

                  <Flex flexDirection="column" gap={4} mb={4}>
                    <FormHandler
                      inputField={
                        <FormInput<FastLaunchForm>
                          inputRightElement={
                            <InputGroup.TokenInputRightElement
                              tokenLogo={NATIVE_TOKEN.logoUrl}
                              tokenTicker={NATIVE_TOKEN.symbol}
                            />
                          }
                          rightElementProps={{
                            mr: 2,
                            right: 0,
                            width: 'unset',
                          }}
                          control={control}
                          name="initialBuy"
                          placeholder="0.00"
                          type="number"
                        />
                      }
                      alignOptionalLabel="right"
                      fieldError={errors.initialBuy}
                      helperText="Be the first person to buy your token! "
                      htmlFor="initialBuy"
                      label="Initial buy"
                      optional
                    />
                    <Box>
                      <InitialBuyCount />
                    </Box>
                  </Flex>

                  <Flex mb={4}>
                    <LockToken />
                  </Flex>
                  <Flex>
                    <MigrationDEX name="migrationDEX" />
                  </Flex>
                  <Flex
                    border="solid 2px"
                    borderColor="surface.base.500"
                    borderLeft="none"
                    borderRight="none"
                    flexDirection="row"
                    justifyContent="space-between"
                    mx={{ base: '-20px', md: '-38px' }}
                    position="relative"
                    px={10}
                    py={5}
                  >
                    <Box
                      bg="surface.base.200"
                      bottom={0}
                      left={0}
                      opacity={0.4}
                      position="absolute"
                      right={0}
                      top={0}
                      zIndex={1}
                    />
                    <Flex alignItems="center" flex="auto" position="relative" zIndex={1}>
                      <chakra.span as="span" mr={2} textStyle="body-md">
                        Cost to deploy
                      </chakra.span>
                      <TooltipWithIcon icon={FaQuestionCircle} tooltipContent={tooltpContent} />
                    </Flex>
                    <Flex
                      flex="auto"
                      justifyContent="flex-end"
                      position="relative"
                      textStyle="body-md"
                      zIndex={2}
                    >
                      ~{cost} {NATIVE_TOKEN.symbol}
                    </Flex>
                  </Flex>
                  <Flex mb={4} pb={5} pt={4}>
                    <Checkbox defaultChecked={false} textAlign="initial" variant="accent" required>
                      I agree to the{' '}
                      <Link
                        _hover={{ opacity: 0.7 }}
                        href={getSocialLinkById('gitbook')}
                        target="_blank"
                        textDecoration="underline"
                      >
                        BlockBeast Terms & Conditions and Token Profile Policy
                      </Link>
                    </Checkbox>
                  </Flex>

                  <FormFooter isLoading={isPending} onCostChange={onCostChange} />
                </Flex>
              </Box>
            </FormProvider>
          </Card>
        </Container>
      </Box>
      <BasicModal
        footer={
          <Button
            _hover={{ bg: 'green.200' }}
            as={Link}
            bg="green.100"
            color="gray.800"
            href={modalState.tradePageLink ?? ''}
            mr={3}
            px={6}
            py="0.5rem"
            size="md"
            target="_blank"
            width="100%"
          >
            Trade Token
          </Button>
        }
        modalBody={
          <Flex alignItems="center" direction="column" justifyContent="center">
            <Flex direction="row" gap="0.75rem">
              <Link
                style={{
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                }}
                href={modalState.beastChatLink ?? ''}
                target="_blank"
              >
                View Beast
              </Link>
              <Link
                style={{
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                }}
                href={modalState.transactionPageLink ?? ''}
                target="_blank"
                textDecoration="underline"
              >
                View Transaction
              </Link>
            </Flex>
          </Flex>
        }
        header="Token & Agent Created!"
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      />
    </>
  );
};
