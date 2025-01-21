/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { Box, Grid, GridItem, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';

import { colors as Colors, semanticColors } from './colors';

const meta: Meta = {
  title: 'Tokens/Colors',
};

export default meta;
type Story = StoryObj;

interface ColorValues {
  _dark: string;
  default: string;
}

interface SemanticColorEntry {
  color: string;
  colorValues: ColorValues;
}

type SemanticColorFormatted = {
  [key: string]: SemanticColorEntry[];
};

function convertSemanticColorsToArray(): SemanticColorFormatted {
  const result: SemanticColorFormatted = {};

  function traverse(obj: any, path: string[] = []): void {
    for (const key in obj) {
      const newPath = [...path, key];
      const value = obj[key];

      if (typeof value === 'object' && !('_dark' in value && 'default' in value)) {
        traverse(value, newPath);
      } else {
        const color = newPath.join('.');
        const title = newPath[0];
        const colorValues: ColorValues = value;
        const colors: SemanticColorEntry = { color, colorValues };

        if (result[title]) {
          result[title].push(colors);
        } else {
          result[title] = [colors];
        }
      }
    }
  }

  traverse(semanticColors);

  return result;
}

const ColorBox = ({ color, label, parent }: { color: string; label: string; parent?: string }) => (
  <Box mb={4}>
    <Box
      background={color.includes('linear-gradient') ? color : undefined}
      bg={color.includes('linear-gradient') ? undefined : color}
      borderRadius="12px"
      height="100px"
      p={4}
      width="100px"
    />
    {parent && (
      <Text mt={2} textStyle="body-xs">
        {`${parent}-${label}`}
      </Text>
    )}
    <Text mt={2} opacity={0.5} textStyle="body-xs">
      {color}
    </Text>
  </Box>
);

const ColorSection = ({
  colors,
  title,
}: {
  colors: { [key: string]: { [key: string]: { [key: string]: string } | string } | string };
  title: string;
}) => (
  <Box mb={8}>
    <Text mb={4} textStyle="h3">
      {title}
    </Text>
    <Grid gap={2} templateColumns="repeat(10, 1fr)">
      {Object.entries(colors).map(([key, value]) => {
        if (typeof value === 'string') {
          return (
            <GridItem key={key}>
              <ColorBox color={value} label={key} parent={title} />
            </GridItem>
          );
        }
        if (typeof value === 'object' && !Array.isArray(value)) {
          return (
            <GridItem colSpan={10} key={key}>
              <Text mb={2}>{key}</Text>
              <SimpleGrid columns={[1, 2, 10]} spacing={4}>
                {Object.entries(value).map(([subKey, subValue]) => {
                  if (typeof subValue === 'string') {
                    return <ColorBox color={subValue} key={subKey} label={subKey} parent={key} />;
                  }
                  return (
                    <GridItem colSpan={10} key={subKey}>
                      <Text mb={2}>{subKey}</Text>
                      <SimpleGrid columns={[1, 2, 10]} spacing={4}>
                        {Object.entries(subValue).map(([subSubKey, subSubValue]) => (
                          <ColorBox
                            color={subSubValue}
                            key={subSubKey}
                            label={subSubKey}
                            parent={`${key}-${subKey}`}
                          />
                        ))}
                      </SimpleGrid>
                    </GridItem>
                  );
                })}
              </SimpleGrid>
            </GridItem>
          );
        }
        return null;
      })}
    </Grid>
  </Box>
);

const SemanticColorSection = ({
  colors,
  title,
}: {
  colors: SemanticColorEntry[];
  title: string;
}) => {
  const labelKey = useColorModeValue('default', '_dark');
  return (
    <Box mb={8}>
      <Text mb={4} textStyle="h3">
        {title}
      </Text>
      <Grid gap={2} templateColumns="repeat(10, 1fr)">
        {colors.map(({ color, colorValues }) => (
          <GridItem key={color} maxW="100px">
            <ColorBox color={color} label={colorValues[labelKey]} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export const Default: Story = {
  render: () => (
    <Box p={4}>
      <Text mb={6} textStyle="h2">
        Colors
      </Text>
      {Object.entries(Colors).map(([category, colorValues]) => (
        <ColorSection colors={colorValues} key={category} title={category} />
      ))}
      <Text mb={6} textStyle="h2">
        Semantic Colors
      </Text>
      {Object.entries(convertSemanticColorsToArray()).map(([title, colors]) => (
        <SemanticColorSection colors={colors} key={title} title={title} />
      ))}
    </Box>
  ),
};
