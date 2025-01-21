import { ChartingLibraryWidgetOptions, ResolutionString } from '@adapters/charting_library/';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { mergeWith } from 'lodash';

import { CHARTING_LIBRARY_PATH } from '@constants/config';
import { formatNumber, NumberFormatType } from '@utils/formatNumbers';

dayjs.extend(utc);

export interface ChartContainerProps {
  autosize: ChartingLibraryWidgetOptions['autosize'];
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];

  clientId: ChartingLibraryWidgetOptions['client_id'];
  container: ChartingLibraryWidgetOptions['container'];
  datafeedUrl: string;
  fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
  interval: ChartingLibraryWidgetOptions['interval'];
  libraryPath: ChartingLibraryWidgetOptions['library_path'];
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
}
export const defaultProps: Omit<ChartContainerProps, 'container' | 'symbol'> = {
  autosize: true,
  chartsStorageApiVersion: '1.1',
  clientId: 'tradingview.com',
  datafeedUrl: '',
  fullscreen: false,
  interval: '5' as ResolutionString,
  libraryPath: CHARTING_LIBRARY_PATH,
  studiesOverrides: {},
};

export const widgetOptions: Omit<ChartingLibraryWidgetOptions, 'container' | 'datafeed'> = {
  autosize: defaultProps.autosize,
  client_id: defaultProps.clientId,
  custom_css_url: `${window.location.origin}/styles/trading-view.css`,
  custom_formatters: {
    dateFormatter: {
      format: (timestamp) => {
        const date = dayjs.utc(timestamp);
        const formattedTime = date.local().format('DD MMM YYYY');
        return formattedTime;
      },
      formatLocal: (date) => dayjs.utc(date).local().toString(),
      parse: (value) => value,
    },
    priceFormatterFactory: (symbolInfo, minTick) => {
      if (symbolInfo?.fractional || (minTick !== 'default' && minTick.split(',')[2] === 'true')) {
        return {
          format: (price) =>
            formatNumber({
              input: price,
              type: NumberFormatType.TxDisplayValuesFormatterWithSubscript,
            }),
        };
      }
      return null;
    },
    timeFormatter: {
      format(timestamp) {
        const date = dayjs.utc(timestamp);
        const formattedTime = date.local().format('HH:mm');
        return formattedTime;
      },
      formatLocal: (date) => dayjs.utc(date).local().toString(),
      parse: (value) => value,
    },
  },

  disabled_features: [
    'header_compare',
    'header_compare',
    'header_symbol_search',
    'symbol_info',
    'seconds_resolution',
    'timeframes_toolbar',
    'header_saveload',
    'display_market_status',
    'header_chart_type',
  ],
  enabled_features: [
    'study_templates',
    'use_localstorage_for_settings',
    'save_chart_properties_to_local_storage',
  ],
  fullscreen: defaultProps.fullscreen,
  interval: defaultProps.interval as ChartingLibraryWidgetOptions['interval'],
  library_path: defaultProps.libraryPath as string,
  locale: 'en',

  studies_overrides: defaultProps.studiesOverrides,
  timezone: 'Etc/UTC',
};

export const getWidgetConfig = (
  config: Partial<ChartingLibraryWidgetOptions> &
    Pick<ChartingLibraryWidgetOptions, 'container' | 'datafeed' | 'symbol'>
): ChartingLibraryWidgetOptions =>
  mergeWith(widgetOptions, config, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  });
