import React, { useEffect, useRef, useState } from 'react';

import {
  Box,
  Button,
  Slider as ChakraSlider,
  Container,
  Flex,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { FiArrowUpRight } from 'react-icons/fi';
import Slider from 'react-slick';

import { LBPPoolStatus } from '@app-types/index';

import Pool from '@components/PoolCard/Pool';
import PoolCardSkeleton from '@components/PoolCardSkeleton';
import { skeletonItems } from '@constants/index';
import { usePoolData } from '@hooks/lbp/useGetPoolsWithToken';

import { sliderOptions } from './settings';

const getPreviousCount = () => {
  const count = localStorage.getItem('poolsCount');
  return count && !Number.isNaN(parseFloat(count)) ? parseFloat(count) : 0;
};
export const Pools: React.FC = () => {
  const prevListCount = useRef<number>(getPreviousCount());

  const [currentSlide, setCurrentSlide] = useState(0);
  const { data, isLoading } = usePoolData({}, [LBPPoolStatus.COMPLETED]);
  const slider = useRef<Slider>(null);
  const slidesToScroll =
    (slider.current?.innerSlider as any)?.props?.slidesToScroll || sliderOptions.slidesToScroll;
  const NUMBER_OF_SLIDES = Math.floor(data.length / slidesToScroll);
  const bgImage = useColorModeValue('bg-light.png', 'bg-dark.png');
  const useDragging = useRef<boolean>(false);
  const onSlideChange = (slide: number) => {
    useDragging.current = !0;
    const targetSlide = Math.round((data.length / 100) * slide);
    slider.current?.slickGoTo(targetSlide);
  };
  useEffect(() => {
    localStorage.setItem('poolsCount', data.length.toString());
  }, [data]);
  if (isLoading && !prevListCount.current) {
    return null;
  }
  return data.length ?
      <Box
        backgroundBlendMode="overlay"
        backgroundColor="surface.base.500"
        backgroundImage={`url(./assets/images/${bgImage})`}
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
      >
        <Box
          bgGradient="linear(surface.base.trending 30%,  rgba(0,0,0,0) 50%, surface.base.trending 90%)"
          pb={[10, '70px']}
        >
          <Container maxWidth={1080} textAlign="left">
            <Flex direction="row">
              <Flex alignItems="center" flex="auto">
                <Text textStyle="h2">Trending Apes</Text>
              </Flex>
              <Flex alignItems="center" flex="auto" justifyContent="flex-end" maxWidth="100px">
                <Box>
                  <Button
                    as={Link}
                    display="inline-flex"
                    textStyle="body-regular-semibold"
                    to="/launches/lbp"
                    variant="unstyled"
                  >
                    View All <FiArrowUpRight style={{ marginLeft: 8 }} />
                  </Button>
                </Box>
              </Flex>
            </Flex>
          </Container>

          <Container display="flex" justifyContent="flex-end" maxW="100%" px={0} data-oops>
            <Box
              display="flex"
              maxWidth="calc( 100% - calc(calc( 100% - 1080px ) / 2))"
              mt={5}
              width="calc( 100% - calc(calc( 100% - 1080px ) / 2))"
            >
              <Box
                display="block"
                height="550px"
                overflow="hidden"
                position="relative"
                width="100%"
              >
                <Box bottom={0} left={0} overflow="hidden" position="absolute" right={0} top={0}>
                  <Box pb="30px">
                    <Slider
                      {...sliderOptions}
                      afterChange={(n: number) => {
                        if (!useDragging.current) {
                          setCurrentSlide(Math.ceil((n / data.length) * 100));
                        }
                        useDragging.current = !1;
                      }}
                      ref={slider}
                    >
                      {data &&
                        data.length &&
                        data.map((pool) => (
                          <Box
                            display="block"
                            key={`${pool.poolAddress.toString()}`}
                            px="8px"
                            py={0}
                          >
                            <Pool {...pool} />
                          </Box>
                        ))}
                      {isLoading &&
                        skeletonItems(prevListCount.current).map((item) => (
                          <Box display="block" key={item} pr="16px" py={0}>
                            <PoolCardSkeleton />
                          </Box>
                        ))}
                    </Slider>
                  </Box>

                  {NUMBER_OF_SLIDES > 1 && (
                    <Box>
                      <Box
                        as="ul"
                        display="flex"
                        flexDirection="row"
                        margin="auto"
                        maxWidth={{ base: '50%', md: 350 }}
                      >
                        <ChakraSlider
                          aria-label="slider-ex-2"
                          defaultValue={1}
                          max={100}
                          min={1}
                          onChange={(value) => setCurrentSlide(value)}
                          onChangeEnd={onSlideChange}
                          step={data.length / NUMBER_OF_SLIDES}
                          value={currentSlide}
                          variant="unstyled"
                        >
                          <SliderTrack bg="surface.base.100 !important">
                            <SliderFilledTrack bg="surface.base.100" />
                          </SliderTrack>
                          <SliderThumb
                            bg="surface.base.900 !important"
                            borderColor="surface.base.900 !important"
                            height="4px"
                            width="30px"
                          />
                        </ChakraSlider>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    : null;
};
export default Pools;
