import {
  DatafeedConfiguration,
  DatafeedErrorCallback,
  HistoryCallback,
  IBasicDataFeed,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
  ResolutionString,
  ResolveCallback,
  SubscribeBarsCallback,
} from '@adapters/charting_library/charting_library';
import dayjs from 'dayjs';
import { EventEmitter } from 'events';
import isFunction from 'lodash/isFunction';

import { CandleData, groupPriceFeed } from '@utils/groupFeedData';

export type Transaction = {
  price: string;
  time: number;
};

export default class ApeonDataFeedV2 extends EventEmitter implements Partial<IBasicDataFeed> {
  config: DatafeedConfiguration;

  symbol: {
    supported_resolutions: string[];
  } & Omit<LibrarySymbolInfo, 'supported_resolutions'> = {
    currency_code: 'SOL',
    description: '',
    exchange: '',
    format: 'price',
    fractional: true,
    has_intraday: true,
    listed_exchange: '',
    minmov: 0.000_000_001,
    name: '',
    pricescale: 100,
    session: '24x7',
    supported_resolutions: ['1', '5', '20', '60'],
    timezone: 'Etc/UTC',
    type: 'crypto',
  };

  transactions: Transaction[];

  constructor(
    config: Partial<DatafeedConfiguration>,
    symbol: { name: string },
    data: Transaction[]
  ) {
    super();
    this.config = config;
    this.transactions = data;
    this.symbol = {
      ...this.symbol,
      ...symbol,
      ticker: symbol.name,
    };
  }

  getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    { from, to }: PeriodParams,
    onResult: HistoryCallback,
    onError: DatafeedErrorCallback
  ): void {
    setTimeout(() => {
      if (this.symbol.name === symbolInfo.name) {
        const intervalInMins = parseFloat(resolution);

        const candles = groupPriceFeed<Transaction>(this.transactions, intervalInMins);

        const filterdCandles = candles.filter((item) => {
          const { time } = item;
          return time > new Date(from * 1000).getTime() && time < new Date(to * 1000).getTime();
        });

        if (!filterdCandles.length) {
          const nextTime = this.getNextTime(candles, from);
          return onResult([], { nextTime, noData: !nextTime });
        }
        onResult(filterdCandles, {
          noData: !filterdCandles.length,
        });
      } else {
        onError('');
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getNextTime(candles: CandleData[], from: number): number | undefined {
    let { length } = candles;
    // eslint-disable-next-line no-plusplus
    while (length--) {
      if (candles[length].time < from * 1000) {
        return dayjs(candles[length].time).unix();
      }
    }
  }

  onReady(callback: OnReadyCallback): void {
    if (isFunction(callback)) {
      setTimeout(() => callback(this.config));
    }
  }

  resolveSymbol(
    symbolName: string,
    onResolve: ResolveCallback,
    onError: DatafeedErrorCallback
  ): void {
    setTimeout(() => {
      if (this.symbol && symbolName === this.symbol.name) {
        onResolve(this.symbol as LibrarySymbolInfo);
      } else {
        onError(`${symbolName} not found`);
      }
    });
  }

  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    _resolution: ResolutionString,
    onTick: SubscribeBarsCallback
  ): void {
    if (this.symbol && this.symbol.name === symbolInfo.name) {
      this.on('update', (transactions: Transaction[]) => {
        const data = groupPriceFeed(transactions, parseFloat(_resolution));
        this.transactions = transactions;
        if (data.length > 0) {
          onTick(data[data.length - 1]);
        }
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  unsubscribeBars(_listenerGuid: string): void {}
}
