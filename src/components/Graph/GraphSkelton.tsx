import { Box } from '@chakra-ui/react';

import { opacify } from '@theme/utils';

const ChartSkeletonAxes = ({
  //   fillColor,
  height,
  hideYAxis,
  tickColor,
}: {
  //   fillColor: string;
  height: number;
  hideYAxis?: boolean;
  tickColor: string;
}) => (
  <g>
    {/* <rect fill={fillColor} height="32" rx="4" width="180" y="0" />
    <rect fill={fillColor} height="13" rx="4" width="80" y="48" /> */}
    <g transform={`translate(0, ${height - 14})`}>
      <rect fill={tickColor} height="6" rx="3" width="7%" x="10%" />
      <rect fill={tickColor} height="6" rx="3" width="7%" x="28.25%" />
      <rect fill={tickColor} height="6" rx="3" width="7%" x="46.5%" />
      <rect fill={tickColor} height="6" rx="3" width="7%" x="64.75%" />
      <rect fill={tickColor} height="6" rx="3" width="7%" x="83%" />
    </g>
    {!hideYAxis && (
      <g transform="translate(0, 10)">
        <rect fill={tickColor} height="6" rx="3" width="24" x="3%" y={(0 * height) / 5} />
        <rect fill={tickColor} height="6" rx="3" width="24" x="3%" y={(1 * height) / 5} />
        <rect fill={tickColor} height="6" rx="3" width="24" x="3%" y={(2 * height) / 5} />
        <rect fill={tickColor} height="6" rx="3" width="24" x="3%" y={(3 * height) / 5} />
        <rect fill={tickColor} height="6" rx="3" width="24" x="3%" y={(4 * height) / 5} />
      </g>
    )}
  </g>
);

const ChartLoadingStateMask = ({ id }: { id: string }) => (
  <>
    <defs>
      <linearGradient id={`${id}-gradient`} x1="0%" x2="100%" y1="0%" y2="0%">
        <stop offset="0" stopColor="rgba(56, 56, 56, 0.5)">
          <animate attributeName="offset" dur="1.3s" repeatCount="indefinite" values="-1;3" />
        </stop>
        <stop offset="0.5" stopColor={opacify(20, '#383838')}>
          <animate attributeName="offset" dur="1.3s" repeatCount="indefinite" values="-0.5;3.5" />
        </stop>
        <stop offset="1" stopColor="rgba(56, 56, 56, 0.5)">
          <animate attributeName="offset" dur="1.3s" repeatCount="indefinite" values="0;4" />
        </stop>
      </linearGradient>
    </defs>
    <mask id={id} style={{ maskType: 'alpha' }}>
      <path
        d="M0 122.5L7.26 116.158L14.52 109.916L21.78 103.873L29.04 98.1233L36.3 92.7582L43.56 87.862L50.82 83.5121L58.08 79.7771L65.34 76.7159L72.6 74.3767L79.86 72.7964L87.12 72H94.38L101.64 72.7964L108.9 74.3767L116.16 76.7159L123.42 79.7771L130.68 83.5121L137.94 87.862L145.2 92.7582L152.46 98.1233L159.72 103.873L166.98 109.916L174.24 116.158L181.5 122.5L188.76 128.842L196.02 135.084L203.28 141.127L210.54 146.877L217.8 152.242L225.06 157.138L232.32 161.488L239.58 165.223L246.84 168.284L254.1 170.623L261.36 172.204L268.62 173H275.88L283.14 172.204L290.4 170.623L297.66 168.284L304.92 165.223L312.18 161.488L319.44 157.138L326.7 152.242L333.96 146.877L341.22 141.127L348.48 135.084L355.74 128.842L363 122.5L370.26 116.158L377.52 109.916L384.78 103.873L392.04 98.1233L399.3 92.7582L406.56 87.862L413.82 83.5121L421.08 79.7771L428.34 76.7159L435.6 74.3767L442.86 72.7964L450.12 72L457.38 72L464.64 72.7964L471.9 74.3767L479.16 76.7159L486.42 79.7771L493.68 83.5121L500.94 87.862L508.2 92.7582L515.46 98.1233L522.72 103.873L529.98 109.916L537.24 116.158L544.5 122.5L551.76 128.842L559.02 135.084L566.28 141.127L573.54 146.877L580.8 152.242L588.06 157.138L595.32 161.488L602.58 165.223L609.84 168.284L617.1 170.623L624.36 172.204L631.62 173H638.88L646.14 172.204L653.4 170.623L660.66 168.284L667.92 165.223L675.18 161.488L682.44 157.138L689.7 152.242L696.96 146.877L704.22 141.127L711.48 135.084L718.74 128.842L726 122.5"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="4"
        transform="translate(60, 75)"
      />
    </mask>
  </>
);

export const ChartSkeleton = ({ height, hideYAxis }: { height: number; hideYAxis?: boolean }) => {
  const neutral3Opacified = opacify(50, 'rgba(56, 56, 56, 0.5)');

  const tickColor = neutral3Opacified;

  const maskId = 'mask-price';

  return (
    <Box style={{ position: 'relative' }}>
      <svg fill="none" height={height} width="100%" xmlns="http://www.w3.org/2000/svg">
        <ChartSkeletonAxes
          //   fillColor={fillColor}
          height={height}
          hideYAxis={hideYAxis}
          tickColor={tickColor}
        />
        <ChartLoadingStateMask id={maskId} />
        <g mask={`url(#${maskId})`}>
          <rect fill={`url(#${maskId}-gradient)`} height={height} rx="4" width="94%" />
        </g>
      </svg>
    </Box>
  );
};
