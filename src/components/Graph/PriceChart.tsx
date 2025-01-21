import { useEffect, useRef } from 'react';

import { Box, Flex, Text, useBreakpointValue, useColorModeValue, useToken } from '@chakra-ui/react';
import dayjs from 'dayjs';
import {
  BarPrice,
  createChart,
  CrosshairMode,
  IChartApi,
  LineData,
  LineStyle,
  LineType,
  TickMarkType,
  UTCTimestamp,
} from 'lightweight-charts';

import { opacify } from '@theme/utils';

/**
 * Custom time formatter used to customize tick mark labels on the time scale.
 * Follows the function signature of lightweight-charts' TickMarkFormatter.
 */
export function formatTickMarks(
  time: UTCTimestamp,
  tickMarkType: TickMarkType,
  locale: string
): string {
  const date = new Date(time.valueOf() * 1000);
  switch (tickMarkType) {
    case TickMarkType.Year:
      return date.toLocaleString(locale, { year: 'numeric' });
    case TickMarkType.Month:
      return date.toLocaleString(locale, { month: 'short', year: 'numeric' });
    case TickMarkType.DayOfMonth:
      return date.toLocaleString(locale, { day: 'numeric', month: 'short' });
    case TickMarkType.Time:
      return date.toLocaleString(locale, { hour: 'numeric', minute: 'numeric' });
    case TickMarkType.TimeWithSeconds:
      return date.toLocaleString(locale, { hour: 'numeric', minute: 'numeric', second: '2-digit' });
    default:
      return '';
  }
}

const currentLocale = window.navigator.languages[0];

export const PriceChart = ({
  graphBaseColor,
  graphData,
}: {
  graphBaseColor: string;
  graphData: LineData<UTCTimestamp>[];
}) => {
  const [lineColor, base100, base200, base700, base800] = useToken('colors', [
    graphBaseColor,
    'base.100',
    'base.200',
    'base.700',
    'base.800',
  ]);
  const gridColor = useColorModeValue(base200, base700);
  const textColor = useColorModeValue(base800, base100);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const toolTipRef = useRef<HTMLDivElement>(null);

  const graphHeight = useBreakpointValue({ base: 320, md: 435 });

  useEffect(() => {
    if (!chartContainerRef.current) {
      return;
    }

    const chart: IChartApi = createChart(chartContainerRef.current, {
      autoSize: true,
      crosshair: {
        horzLine: {
          color: opacify(40, lineColor),
          labelVisible: false,
          style: 3,
          width: 1,
        },
        mode: CrosshairMode.Magnet,
        vertLine: {
          color: opacify(40, lineColor),
          labelVisible: false,
          style: 3,
          width: 1,
        },
      },
      grid: {
        horzLines: {
          color: gridColor,
        },
        vertLines: {
          color: 'transparent',
        },
      },
      handleScale: false,
      handleScroll: false,
      height: graphHeight,
      layout: {
        attributionLogo: false,
        background: { color: 'transparent' },
        textColor: opacify(65, textColor),
      },
      leftPriceScale: {
        autoScale: true,
        borderVisible: false,
        mode: 0,
        scaleMargins: {
          bottom: 0.08,
          top: 0.1,
        },
        visible: true,
      },
      rightPriceScale: {
        autoScale: true,
        borderVisible: false,
        mode: 0,
        scaleMargins: {
          bottom: 0.05,
          top: 0.1,
        },
        visible: false,
      },
      timeScale: {
        borderVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        rightOffset: 0,
        secondsVisible: true,
        tickMarkFormatter: formatTickMarks,
        ticksVisible: false,
        timeVisible: true,
      },
      width: chartContainerRef.current.clientWidth,
    });

    chart.timeScale().fitContent();

    const lineSeries = chart.addAreaSeries({
      bottomColor: 'transparent',
      crosshairMarkerBorderColor: opacify(30, lineColor),
      crosshairMarkerBorderWidth: 3,
      crosshairMarkerRadius: 5,
      lastValueVisible: false,
      lineColor,
      lineStyle: LineStyle.Solid,
      lineType: LineType.Curved,
      priceLineVisible: false,
      topColor: opacify(10, lineColor),
    });
    // const lineSeries = chart.addLineSeries({
    //   color: lineColor,
    //   crosshairMarkerBorderColor: opacify(30, lineColor),
    //   crosshairMarkerBorderWidth: 3,
    //   crosshairMarkerRadius: 5,
    //   lastValueVisible: false,
    //   lineStyle: LineStyle.Solid,
    //   lineType: LineType.Curved,
    //   priceLineVisible: false,
    // });
    lineSeries.setData(graphData);
    lineSeries.applyOptions({
      // autoscaleInfoProvider: () => ({
      //   priceRange: {
      //     // maxValue: 100,
      //     minValue: 0,
      //   },
      // }),
      lastValueVisible: false,
      priceFormat: {
        formatter: (price: BarPrice) => {
          if (price <= 0.0000000001) return '0';
          return new Intl.NumberFormat(currentLocale, {
            maximumSignificantDigits: 6,
            style: 'decimal',
          }).format(price);
        },
        minMove: 0.0000002,
        type: 'custom',
      },
    });

    // tooltip
    const toolTip = toolTipRef.current;
    if (toolTip) toolTip.style.display = 'none';

    let lastTooltipWidth: null | number = null;

    chart.subscribeCrosshairMove((param) => {
      if (!toolTip || !chartContainerRef.current) return;
      if (!param || !param.point || !param.time || !param.seriesData) {
        toolTip.style.display = 'none';
        return;
      }

      const tooltipData = param.seriesData.get(lineSeries) as LineData | undefined;
      if (!tooltipData) {
        return;
      }

      const dateStr = param.time;
      const price = tooltipData.value;

      toolTip.style.display = 'flex';
      const tooltipPriceText = toolTip.querySelector('#tooltip-price');
      const tooltipDateText = toolTip.querySelector('#tooltip-date');

      if (tooltipPriceText) {
        tooltipPriceText.textContent = `${price.toFixed(12)} SOL`;
      }

      if (tooltipDateText) {
        const formattedDate = dayjs.unix(Number(dateStr)).format('MMM DD, YYYY - HH:mm');
        tooltipDateText.textContent = formattedDate;
      }

      // Tooltip positioning logic
      const x = param.point.x + chart.priceScale('left').width() + 10;
      const deadzoneWidth = lastTooltipWidth ? Math.ceil(lastTooltipWidth) : 45;
      const xAdjusted = Math.min(x, chart.paneSize().width - deadzoneWidth);
      const transformX = `calc(${xAdjusted}px)`;

      const { y } = param.point;
      const flip = y <= 20 + 100;
      const yPx = y + (flip ? 1 : -1) * 20;
      const yPct = flip ? '' : ' - 100%';
      const transformY = `calc(${yPx}px${yPct})`;

      toolTip.style.transform = `translate(${transformX}, ${transformY})`;

      const tooltipMeasurement = toolTip.getBoundingClientRect();
      lastTooltipWidth = tooltipMeasurement?.width || null;
    });

    return () => {
      chart.remove();
    };
  }, [gridColor, lineColor, textColor, graphData, graphHeight]);

  return (
    <Box
      h={graphHeight}
      // Prevents manipulating the chart with touch so that it doesn't interfere with scrolling the page.
      onTouchMove={(e) => e.stopPropagation()}
      position="relative"
      pr={1}
      pt={4}
      ref={chartContainerRef}
      w="100%"
    >
      <Flex
        alignItems="flex-start"
        background="surface.base.500"
        border="1px solid"
        borderColor="surface.base.500"
        borderRadius="xl"
        flexDirection="column"
        gap={1}
        id="tooltip"
        justifyContent="flex-start"
        left="0%"
        padding={3}
        position="absolute"
        ref={toolTipRef}
        top={0}
        zIndex={1080}
      >
        <Text id="tooltip-price" textStyle="body-regular" />
        <Text id="tooltip-date" opacity={0.5} textStyle="body-xs" />
      </Flex>
    </Box>
  );
};
