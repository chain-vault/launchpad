import React, { memo } from 'react';

type CountDownProps = {
  endDate: number;
  startDate: number;
};
export const CountDown: React.FC<CountDownProps> = ({ endDate, startDate }) => {
  const a = Math.random() * endDate * startDate;
  return <div>{a}</div>;
};

export default memo(CountDown);
