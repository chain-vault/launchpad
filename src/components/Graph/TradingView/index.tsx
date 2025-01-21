import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  ChartPropertiesOverrides,
  IChartingLibraryWidget,
  ResolutionString,
  SeriesType,
  widget as TradingViewWidget,
} from '@adapters/charting_library';
import { Box, Card, useColorMode, useColorModeValue, useToken } from '@chakra-ui/react';
import isFunction from 'lodash/isFunction';

import { opacify } from '@theme/utils';

import { ChartSkeleton } from '../GraphSkelton';
import { getWidgetConfig } from './chart.config';
import ApeonDataFeedV2 from './feed';

const isDevelopment = import.meta.env.MODE === 'development';
type GraphPropType<T extends object> = {
  data: T[];
  height?: number;
  isLoading: boolean;
  onChartReady?: (chart: IChartingLibraryWidget) => void;
  overrides?: Partial<ChartPropertiesOverrides>;
  symbol: string;
  type: SeriesType;
};

export const Graph: React.FC<GraphPropType<any>> = ({
  data,
  height = 400,
  isLoading,
  onChartReady,
  overrides = {},
  symbol,
  type,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartingLibraryWidget | null>(null);
  const dataFeed = useRef<ApeonDataFeedV2 | null>(null);
  const chartBg = useToken('colors', useColorModeValue('base.100', 'base.800'));
  const chartReady = useRef<boolean>(false);
  const initialRender = useRef<boolean>(true);

  const lineColor = useToken(
    'colors',
    useColorModeValue('brand.secondary.600', 'brand.secondary.600')
  );

  const backgroundColor = useToken('colors', useColorModeValue('base.100', 'base.800'));
  const { colorMode } = useColorMode();
  const IS_AREA_CHART = type === SeriesType.Area;

  const AREA_CHART_OVERRIDES: Partial<ChartPropertiesOverrides> = useMemo(
    () => ({
      'mainSeriesProperties.areaStyle.color1': lineColor,
      'mainSeriesProperties.areaStyle.color2': opacify(50, backgroundColor, true),
      'mainSeriesProperties.areaStyle.linecolor': lineColor,
      'mainSeriesProperties.areaStyle.linestyle': 0,
      'mainSeriesProperties.areaStyle.linewidth': 3,
      'mainSeriesProperties.areaStyle.priceSource': 'close',
    }),
    [backgroundColor, lineColor]
  );

  const applyOverrides = useCallback(async () => {
    if (chart.current && isFunction(chart.current.applyOverrides)) {
      chart.current.applyOverrides({
        ...{
          'paneProperties.background': chartBg,
          'paneProperties.backgroundType': 'solid',
          ...(IS_AREA_CHART ? AREA_CHART_OVERRIDES : {}),
        },
        ...overrides,
      });
    }
  }, [AREA_CHART_OVERRIDES, IS_AREA_CHART, chartBg, overrides]);

  const changeTheme = useCallback(
    async (onComplete?: () => void) => {
      try {
        if (chart.current && isFunction(chart.current.changeTheme)) {
          await chart.current.changeTheme(colorMode);
          if (isFunction(onComplete)) {
            onComplete();
          }
        }
      } catch (er) {
        console.error();
      }
    },
    [colorMode]
  );

  const fitContent = useCallback(() => {
    if (chartReady.current && data && data.length) {
      const start = data[0].time;
      const end = data[data.length - 1].time;
      const safeMargin = Math.ceil((end - start) * (2 / 100)); // two percentage of visible range
      chart.current?.chart().setVisibleRange({
        from: start - safeMargin,
        to: end + safeMargin,
      });
      chart.current?.chart().setSymbol(symbol);
    }
  }, [data, symbol]);

  useEffect(() => {
    if (!container.current || chart.current) {
      return;
    }
    dataFeed.current = new ApeonDataFeedV2(
      {
        supported_resolutions: [
          '1',
          ...(!IS_AREA_CHART ? ['5', '20', '60'] : []),
        ] as ResolutionString[],
      },
      { name: symbol },
      data
    );
    chart.current = new TradingViewWidget(
      getWidgetConfig({
        container: container.current,
        datafeed: dataFeed.current as any,
        disabled_features: IS_AREA_CHART ? ['header_indicators'] : [],
        interval: (IS_AREA_CHART ? '1' : '5') as ResolutionString,
        symbol,
        theme: colorMode,
      })
    );

    const onChartReadyHandler = () => {
      chartReady.current = true;
      if (chart.current) {
        chart.current.chart().setChartType(type);
        if (IS_AREA_CHART) {
          fitContent();
        }
        applyOverrides();
        if (isFunction(onChartReady)) {
          onChartReady(chart.current);
        }
      }
    };
    chart.current.onChartReady(onChartReadyHandler);
  }, [
    symbol,
    onChartReady,
    type,
    overrides,
    chartBg,
    data,
    colorMode,
    applyOverrides,
    IS_AREA_CHART,
    fitContent,
  ]);

  useEffect(() => {
    changeTheme(applyOverrides);
  }, [applyOverrides, changeTheme, colorMode]);

  useEffect(() => {
    if (data && dataFeed.current) {
      dataFeed.current.emit('update', data);
      if (IS_AREA_CHART && initialRender.current) {
        fitContent();
        initialRender.current = false;
      }
    }
  }, [IS_AREA_CHART, data, fitContent, symbol]);

  useEffect(
    () => () => {
      if (chart.current && !isDevelopment) {
        chart.current.remove();
      }
    },
    []
  );

  return (
    <Card borderRadius="0 !important" display="block" width="100%">
      {isLoading ?
        <ChartSkeleton height={height} />
      : <Box data-type={type} height={height} ref={container} />}
    </Card>
  );
};

Graph.displayName = 'Graph';
