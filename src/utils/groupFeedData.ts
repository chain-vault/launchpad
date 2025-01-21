type InputType = {
  price: string;
  time: number;
};

export type CandleData = {
  close: number;
  dateTime: string;
  high: number;
  low: number;
  open: number;
  time: number;
};

export const formatGraphData = <T extends object>(data: T[], price: keyof T, time: keyof T) =>
  data.map((item) => ({
    ...item,
    price: item[price],
    time: item[time],
  }));

const getIntervalStartTime = (timestamp: number, interval: number): number => {
  const dayStart = new Date(timestamp);
  dayStart.setHours(0, 0, 0, 0);

  const targetTime = new Date(timestamp);
  return targetTime.getTime() - ((targetTime.getTime() - dayStart.getTime()) % interval);
};

export const groupPriceFeed = <T extends InputType>(
  data: T[],
  intervalMinutes: number
): CandleData[] => {
  const groupedData = new Map<number, CandleData>();
  let currentIntervalStart: null | number = null;
  let nextIntervalStart: null | number = null;
  const intervalMs = intervalMinutes * 60 * 1000;
  let lastClosePrice: null | number = null;

  for (const entry of data) {
    const timestampMs = entry.time * 1000;
    const price = parseFloat(entry.price);

    if (!currentIntervalStart || timestampMs >= nextIntervalStart!) {
      currentIntervalStart = getIntervalStartTime(timestampMs, intervalMs);
      nextIntervalStart = currentIntervalStart + intervalMs;
    }

    const currentGroup = groupedData.get(currentIntervalStart) || {
      close: price,
      dateTime: '',
      high: price,
      low: price,
      open: lastClosePrice ?? price,
      time: currentIntervalStart,
    };

    currentGroup.high = Math.max(currentGroup.high, price);
    currentGroup.low = Math.min(currentGroup.low, price, currentGroup.open);
    currentGroup.close = price;
    lastClosePrice = price;

    groupedData.set(currentIntervalStart, currentGroup);
  }

  return Array.from(groupedData.values()).map((group) => ({
    close: group.close,
    dateTime: new Date(group.time).toString(),
    high: group.high,
    low: group.low,
    open: group.open,
    time: group.time,
  }));
};
