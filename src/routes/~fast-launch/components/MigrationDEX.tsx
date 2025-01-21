import React from 'react';

import { Box, Button, Flex, FormLabel, Image, Text, useBoolean } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { TbChevronDown, TbChevronUp } from 'react-icons/tb';

import { DEX_OPTIONS } from '@constants/config';

type MigrationDEXProps = {
  name: string;
};
export const MigrationDEX: React.FC<MigrationDEXProps> = ({ name }) => {
  const { getValues, watch } = useFormContext();
  const [flag, flagControl] = useBoolean();
  const { register } = useFormContext();
  watch([name]);
  const selectedValue = getValues()[name];
  return (
    <Box mb={5} width="100%">
      <Box>
        <Button
          border="solid 1px"
          borderColor="surface.base.900"
          onClick={flagControl.toggle}
          px={4}
          rightIcon={!flag ? <TbChevronDown /> : <TbChevronUp />}
          variant="unstyled"
        >
          Advanced options
        </Button>
      </Box>
      {flag && (
        <>
          <Box mt={4}>
            <FormLabel>Select your migration DEX</FormLabel>
          </Box>
          <Box>
            <Flex direction="row" justifyContent="space-between" width="100%" wrap="wrap">
              {DEX_OPTIONS.map((option) => (
                <Flex
                  sx={{
                    [`input:checked+label`]: {
                      borderColor: 'brand.accent.600',
                    },
                  }}
                  key={option.value}
                  mb={{ base: 2, md: 0 }}
                  minW={{ base: '100%', md: '49%' }}
                  textAlign="center"
                  w={{ base: '100%', md: '49%' }}
                >
                  <input
                    id={option.value}
                    style={{ display: 'none' }}
                    type="radio"
                    value={option.value}
                    {...register(name, { required: true })}
                    disabled={option.disabled}
                  />

                  <Flex
                    as="label"
                    border="solid 2px"
                    borderColor="base.500"
                    borderRadius="15px"
                    className="test"
                    cursor={option.disabled ? 'not-allowed' : 'pointer'}
                    direction="column"
                    display="flex"
                    htmlFor={option.value}
                    opacity={option.disabled ? 0.7 : 1}
                    px={1}
                    py={3}
                    transitionDuration=".5s"
                    width="100%"
                  >
                    <Box mb={1} textAlign="center">
                      <Text as="span" display="inline-block" fontSize={19} textStyle="h3">
                        <Image display="inline-block" src={option.icon} verticalAlign="middle" />
                        {option.title}
                      </Text>
                    </Box>
                    <Box fontSize={14}>
                      <Text
                        as="p"
                        fontWeight="medium"
                        opacity={selectedValue === option.value ? 0.5 : 0.3}
                      >
                        {option.description}
                      </Text>
                    </Box>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </Box>
        </>
      )}
    </Box>
  );
};
