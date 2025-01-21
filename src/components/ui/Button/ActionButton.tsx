import { Button, type ButtonProps, Icon, Text } from '@chakra-ui/react';
import { MdArrowOutward } from 'react-icons/md';

interface ActionButtonProps extends ButtonProps {
  action: string;
}

const ActionButton = ({ action, ...props }: ActionButtonProps) => (
  <Button
    display="flex"
    justifyContent={props.isLoading ? 'center' : 'space-between'}
    w="100%"
    {...props}
  >
    <Text textStyle="body-md-bold">{action}</Text>
    <Icon as={MdArrowOutward} boxSize={5} />
  </Button>
);

export default ActionButton;
