import { Box, Button, ButtonProps } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { GoArrowUpLeft, GoArrowUpRight } from 'react-icons/go';

type AlignProps = 'left' | 'right';

interface LinkButtonProps extends ButtonProps {
  align: AlignProps;
  isExternalLink?: boolean;
  label: string;
  link: string;
  maxWidth?: number | string;
  variant?: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  align,
  isExternalLink,
  label,
  link,
  maxWidth = 240,
  variant = 'solid',
  ...props
}: LinkButtonProps) => (
  <Button
    as={Link}
    fontWeight={700}
    height={50}
    isDisabled={link === '#' || props.disabled}
    justifyContent={align === 'right' ? 'flex-end' : 'flex-start'}
    maxWidth={maxWidth}
    minWidth={{ base: 150, md: 210 }}
    p={0}
    pl={align === 'left' ? 5 : 10}
    position="relative"
    pr={align === 'left' ? 10 : 5}
    rel={isExternalLink ? 'noopener noreferrer' : undefined}
    role="button"
    target={isExternalLink ? '_blank' : '_self'}
    textAlign={align}
    to={link}
    variant={variant}
    {...props}
  >
    <Box
      alignItems="center"
      as="span"
      bottom={0}
      display="flex"
      fontWeight="bold"
      height="100%"
      justifyContent="center"
      position="absolute"
      top={0}
      width={50}
      {...(align === 'right' ? { left: 0 } : { right: 0 })}
    >
      {align === 'left' ?
        <GoArrowUpRight />
      : <GoArrowUpLeft />}
    </Box>
    {label}
  </Button>
);

export default LinkButton;
