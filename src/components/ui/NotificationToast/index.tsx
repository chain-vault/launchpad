import React from 'react';

import {
  Box,
  HStack,
  Link,
  SimpleGrid,
  Spinner,
  SystemStyleObject,
  Text,
  useMultiStyleConfig,
  VStack,
} from '@chakra-ui/react';
import { Link as TanstackLink } from '@tanstack/react-router';
import isFunction from 'lodash/isFunction';
import { GoCheckCircleFill } from 'react-icons/go';
import { IoIosCloseCircle } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';

import { ToastType } from '@constants/index';
import { isExternalUrl } from '@utils/isExternalUrl';

const NAME = 'ApeToast';

type ToastAction = {
  label: string;
  link?: string;
  onClick?: () => void;
};

type ToastVariants = 'accent' | 'secondary';

export type NotificationToastProps = {
  actions?: ToastAction[];
  message?: string;
  onClose?: () => void;
  title: string;
  type?: ToastType;
  variant?: ToastVariants;
};

const SpinnerIcon: React.FC<
  { failed: boolean; isPending: boolean } & Pick<NotificationToastProps, 'variant'>
> = ({ failed, isPending, variant }) => {
  const { icon, iconFailed, iconSuccess, spinner, spinnerEmptyColor } = useMultiStyleConfig(NAME, {
    variant,
  });
  if (isPending)
    return (
      <Spinner
        boxSize="20px"
        color={`${spinner.color}`}
        emptyColor={`${spinnerEmptyColor.color}`}
        thickness="2px"
      />
    );
  return (
    <Box __css={{ ...icon, ...(failed ? iconFailed : iconSuccess) }} fontSize="25px">
      {failed ?
        <IoIosCloseCircle />
      : <GoCheckCircleFill />}
    </Box>
  );
};
const ActionButton: React.FC<{ style?: SystemStyleObject } & ToastAction> = ({
  label,
  link,
  onClick,
  style = {},
}) => {
  const onClickHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isFunction(onClick)) {
      e.preventDefault();
      onClick();
    }
  };
  return (
    <Link
      as={TanstackLink}
      fontSize={10}
      mr={1}
      onClick={onClickHandler}
      sx={style}
      target={isExternalUrl(link ?? '') ? '_blank' : ''}
      textStyle="body-xs"
      to={link ?? ''}
    >
      {label}
    </Link>
  );
};
const ActionLinks = ({ actions, variant }: { actions: ToastAction[]; variant: ToastVariants }) => {
  const { link } = useMultiStyleConfig(NAME, { variant });

  return (
    <Box color="surface.base.900" display="flex" mt={1} w="100%">
      {actions &&
        actions.length > 0 &&
        actions.map((action, index) => {
          if (!action.link && !isFunction(action.onClick)) {
            return null;
          }
          return (
            <ActionButton
              key={action.label}
              style={actions.length > 1 && index === 0 ? link : {}}
              {...action}
            />
          );
        })}
    </Box>
  );
};

const CloseButton: React.FC<Pick<NotificationToastProps, 'onClose' | 'type' | 'variant'>> = ({
  onClose,
  type,
  ...props
}) => {
  const { closeButton } = useMultiStyleConfig(NAME, { variant: props.variant });
  const onClickHandler = () => isFunction(onClose) && onClose();

  return onClose && ToastType.LOADING !== type ?
      <Box __css={closeButton} boxShadow="15px" onClick={onClickHandler}>
        <IoClose />
      </Box>
    : null;
};

export const NotificationToast: React.FC<NotificationToastProps> = ({
  actions,
  message,
  onClose,
  title,
  type = ToastType.SUCCESS,
  variant = 'accent',
}) => {
  const { toast } = useMultiStyleConfig(NAME, { variant });
  const isPending = type === ToastType.LOADING;
  const failed = type === ToastType.FAILED;

  return (
    <SimpleGrid __css={toast} data-group>
      <CloseButton onClose={onClose} type={type} variant={variant} />
      <HStack position="relative">
        <Box
          alignItems="center"
          borderRadius="full"
          color="base.800"
          display="flex"
          justifyContent="center"
          px={3}
          width="45px"
        >
          <SpinnerIcon failed={failed} isPending={isPending} variant={variant} />
        </Box>

        <VStack
          alignItems="flex-start"
          display="flex"
          gap={0}
          justifyContent="center"
          paddingRight={5}
          width="100%"
        >
          <Text textStyle="body-sm-bold" transitionDuration="0.2s">
            {title}
          </Text>

          {message && (
            <Text
              color={failed ? 'danger.500' : undefined}
              mt={message ? 1 : 0}
              textStyle="body-xs"
              w="100%"
            >
              <Box textStyle="body-xs" whiteSpace="pre-line" wordBreak="break-word">
                {message}
              </Box>
            </Text>
          )}
          {actions && actions.length > 0 && <ActionLinks actions={actions} variant={variant} />}
        </VStack>
      </HStack>
    </SimpleGrid>
  );
};

NotificationToast.displayName = 'NotificationToast';
