import React, { forwardRef } from 'react';

import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { formatFileName, humanFileSize } from '@src/utils/fileUtils';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

import { FilePreviewType } from '@app-types/index';

import { SecondaryCircularProgress } from '@components/ui/Progress';
import { FileUploadStatus } from '@constants/index';
import { TokenFormInput } from '@routes/~lbp/~create/types';

import { FileUploadLogo, FileUploadSuccessLogo } from '@assets/icons';

const UPLOAD_MAX_SIZE = 3 * 1024 * 1024;

type ErrorCode = 'file-invalid-type' | 'file-too-large' | 'too-many-files';

const ErrorMessages = {
  'file-invalid-type': 'File type not supported',
  'file-too-large': 'File size exceeded',
  'too-many-files': 'Too many files',
};
interface DropzoneInputProps {
  fileUploadStatus: FileUploadStatus;
  isInvalid: boolean;
  onChange: (file: File) => void;
  onDeleteFile: () => void;
  selectedFile: FilePreviewType | null;
}

interface FilePreviewProps {
  filePreview: FilePreviewType | null;
  onChangeSelectedFile: () => void;
  onDeleteFile: () => void;
}

export const FilePreview = ({
  filePreview,
  onChangeSelectedFile,
  onDeleteFile,
}: FilePreviewProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const onClickDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    onDeleteFile();
  };

  return (
    <motion.div
      animate={{ height: '92px', opacity: 1 }}
      initial={{ height: '180px', opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Flex
        alignItems="center"
        bg="surface.base.200"
        borderRadius="xl"
        height="100%"
        justifyContent="space-between"
        p={6}
      >
        <HStack>
          {!isMobile ?
            <>
              <Image alt="token-logo" borderRadius="full" boxSize={10} src={filePreview?.preview} />
              <VStack alignItems="flex-start">
                <Text textStyle="body-md">{formatFileName(filePreview?.name ?? '')}</Text>
                <Text opacity={0.3} textStyle="body-sm">
                  {humanFileSize(filePreview?.size ?? 0)}
                </Text>
              </VStack>
            </>
          : <VStack>
              <Image alt="token-logo" borderRadius="full" boxSize={10} src={filePreview?.preview} />
              <VStack gap={0.1}>
                <Text textStyle="body-xs">{formatFileName(filePreview?.name ?? '')}</Text>
                <Text opacity={0.3} textStyle="body-xs">
                  {humanFileSize(filePreview?.size ?? 0)}
                </Text>
              </VStack>
            </VStack>
          }
        </HStack>
        <Flex alignItems="center" gap={2}>
          <Button
            onClick={onChangeSelectedFile}
            size={{ base: 'sm', md: 'md' }}
            variant="ghost-invariant"
          >
            <Text textStyle="body-md">Change</Text>
          </Button>
          <Button onClick={onClickDelete} size={{ base: 'sm', md: 'md' }} variant="filled">
            <Text textStyle="body-md">Delete</Text>
          </Button>
        </Flex>
      </Flex>
    </motion.div>
  );
};

/**
 * TODO: Create the component to be more reusable. Handle form handling in parent component
 */
const DropzoneInput = forwardRef<HTMLInputElement, DropzoneInputProps>(
  ({ fileUploadStatus, isInvalid, onChange, onDeleteFile, selectedFile }, _ref) => {
    const { clearErrors, setError } = useFormContext<TokenFormInput>();

    const { fileRejections, getInputProps, getRootProps, isDragActive, isFileDialogActive, open } =
      useDropzone({
        accept: {
          'image/jpeg': ['.jpeg', '.jpg'],
          'image/png': ['.png'],
        },
        disabled:
          fileUploadStatus !== FileUploadStatus.UPLOAD_IDLE &&
          fileUploadStatus !== FileUploadStatus.UPLOAD_ERROR &&
          fileUploadStatus !== FileUploadStatus.UPLOAD_SUCCESS,
        maxFiles: 1,
        maxSize: UPLOAD_MAX_SIZE,
        ...(selectedFile ?
          {
            noClick: true,
            noKeyboard: true,
          }
        : {}),

        onDragOver: () => {
          clearErrors('tokenLogo');
        },
        onDrop: (acceptedFiles, rejectedFiles) => {
          if (rejectedFiles.length) {
            const errorCode = rejectedFiles[0].errors[0].code as ErrorCode;
            setError('tokenLogo', {
              message: ErrorMessages[errorCode] ?? rejectedFiles[0].errors[0].message,
              type: 'manual',
            });
            return;
          }
          clearErrors('tokenLogo');
          onChange(acceptedFiles[0]);
        },
      });
    const borderColor =
      isDragActive || isFileDialogActive ? 'brand.secondary.600'
      : isInvalid || fileRejections.length ? 'danger.700'
      : 'surface.base.700';

    return (
        selectedFile &&
          (fileUploadStatus === FileUploadStatus.UPLOAD_ERROR ||
            fileUploadStatus === FileUploadStatus.UPLOAD_SUCCESS ||
            fileUploadStatus === FileUploadStatus.UPLOAD_IDLE)
      ) ?
        <Box {...getRootProps()}>
          <FilePreview
            filePreview={selectedFile}
            onChangeSelectedFile={open}
            onDeleteFile={onDeleteFile}
          />
          <input {...getInputProps()} />
        </Box>
      : <Flex
          flexDirection="column"
          {...getRootProps()}
          alignItems="center"
          bg="surface.base.700"
          borderColor={borderColor}
          borderRadius="xl"
          borderWidth={1}
          cursor="pointer"
          gap={4}
          justifyContent="center"
          minH="180px"
          p={5}
          textAlign="center"
        >
          {(
            fileUploadStatus === FileUploadStatus.UPLOAD_IDLE ||
            fileUploadStatus === FileUploadStatus.UPLOAD_ERROR ||
            !selectedFile
          ) ?
            <>
              <Image alt="file-upload" boxSize="14" src={FileUploadLogo} />
              <Flex alignItems="center" flexDirection="column" gap="2" justifyContent="center">
                <HStack textStyle="body-md">
                  {isDragActive ?
                    <Flex alignItems="center" justifyContent="center">
                      <motion.div
                        animate={{ opacity: 0, x: '5%' }}
                        initial={{ opacity: 1, x: 0 }}
                        style={{ display: 'flex', gap: 4, position: 'absolute' }}
                        transition={{ duration: 0.8 }}
                      >
                        <Text borderBottom="1px dashed">Click to select file</Text>
                        <Text>or drag and drop</Text>
                      </motion.div>
                      <motion.div
                        animate={{ opacity: 1, x: 0 }}
                        initial={{ opacity: 0, x: '20%' }}
                        transition={{ duration: 0.8 }}
                      >
                        Drop your file right here
                      </motion.div>
                    </Flex>
                  : <>
                      <Text
                        _hover={{ color: 'brand.secondary.600', transition: '0.1s ease-in' }}
                        borderBottom="1px dashed"
                        // onClick={open}
                      >
                        Click to select file
                      </Text>
                      <Text>or drag and drop</Text>
                    </>
                  }
                </HStack>
                <Text opacity="0.3" textStyle="body-xs">
                  JPEG or PNG (up to 3MB)
                </Text>
              </Flex>

              <input {...getInputProps()} />
            </>
          : <Flex alignItems="center" flexDirection="column" gap={8} justifyContent="space-between">
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 1.5 }}
              >
                {fileUploadStatus === FileUploadStatus.UPLOAD_SUCCESS ?
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 1 }}
                  >
                    <Image alt="file-upload" boxSize="14" src={FileUploadSuccessLogo} />{' '}
                  </motion.div>
                : <SecondaryCircularProgress isIndeterminate />}
              </motion.div>
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  x: '-20%',
                }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Text textStyle="body-md">Uploading...</Text>
              </motion.div>
            </Flex>
          }
        </Flex>;
  }
);

DropzoneInput.displayName = 'DropzoneInput';

export default DropzoneInput;
