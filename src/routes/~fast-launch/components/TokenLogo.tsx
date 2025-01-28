import React, { useCallback, useEffect, useState } from 'react';

import { Box, Flex, FormLabel, Text } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { BsCloudArrowUpFill } from 'react-icons/bs';
import Resizer from 'react-image-file-resizer';

import { FormInput } from '@components/ui/Form';

const UPLOAD_MAX_SIZE = 3 * 1024 * 1024;

type TokenLogoProps = {
  label: string;
};
export const TokenLogo: React.FC<TokenLogoProps> = ({ label }) => {
  const name = 'tokenLogo';
  const { clearErrors, control, getFieldState, getValues, register, setValue } = useFormContext();
  const field = getFieldState(name);
  const [fileName, setFileName] = useState<string>('');
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length) {
        const file = acceptedFiles[0];

        // Check if file size is greater than 100KB
        if (file.size > 100 * 1024) {
          Resizer.imageFileResizer(
            file,
            800,
            800,
            'JPEG',
            70,
            0,
            (resizedFile) => {
              if (resizedFile instanceof File) {
                setValue(name, resizedFile);
                setFileName(resizedFile.name);
                clearErrors(name);
              }
            },
            'file'
          );
        } else {
          // If the file size is already below 100KB, use the original file
          setValue(name, file);
          setFileName(file.name);
          clearErrors(name);
        }
      }
    },
    [name, setValue, clearErrors]
  );
  const values = getValues();
  useEffect(() => {
    if (!values[name]) {
      setFileName('');
    }
  }, [values]);
  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: {
      // 'image/gif': ['.gif'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },

    maxFiles: 1,
    maxSize: UPLOAD_MAX_SIZE,
    onDrop,
  });

  return (
    <Box>
      <Flex justifyContent="space-between">
        <FormLabel>{label} *</FormLabel>
        {field.invalid && (
          <Text color="danger.700" textStyle="body-sm">
            Required field
          </Text>
        )}
      </Flex>

      <Box
        bg="surface.base.700"
        borderRadius="lg"
        position="relative"
        px={4}
        py={3}
        textAlign="initial"
        {...getRootProps()}
        border={`solid 1px ${field.invalid ? 'red' : 'transparent'}`}
        cursor="pointer"
      >
        <Box bottom={0} height={1} overflow="hidden" position="absolute" right={8} width={1}>
          <input style={{ opacity: 0 }} type="text" {...register(name, { required: true })} />
        </Box>
        <Box
          as="span"
          color="base.500"
          display="inline-block"
          fontWeight="semibold"
          lineHeight={4}
          maxWidth="100%"
          overflow="hidden"
          position="relative"
          pr="60px"
          textOverflow="ellipsis"
          textStyle="body-regular"
          top={1}
          whiteSpace="nowrap"
        >
          {isDragActive ? 'Drop your file' : fileName || 'Upload your Token / Beast Image'}
        </Box>

        <input name={name} {...getInputProps()} />
        <Box height={2} overflow="hidden" position="absolute" width={2}>
          <FormInput control={control} name={name} placeholder="file upload" />
        </Box>
        <Box
          alignItems="center"
          bottom={0}
          display="flex"
          fontSize={30}
          height="50px"
          justifyContent="center"
          my="auto"
          position="absolute"
          right="5px"
          top={0}
          width="50px"
        >
          <BsCloudArrowUpFill />
        </Box>
      </Box>
    </Box>
  );
};
