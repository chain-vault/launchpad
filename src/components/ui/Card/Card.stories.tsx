import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardProps,
  Heading,
} from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<CardProps> = {
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['subtle', 'solid', 'outline', 'secondary'],
    },
  },
  component: Card,
  title: 'Atoms/Card',
};

export default meta;
type Story = StoryObj<typeof Card>;
export const Default: Story = {
  args: {
    children: 'This is a button',
    size: 'md',
    variant: 'solid',
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <Heading>Card header</Heading>
      </CardHeader>
      <CardBody>This is card body</CardBody>
      <CardFooter justifyContent="end">
        <Button> Cancel</Button>
      </CardFooter>
    </Card>
  ),
};
