import { PaletteColor, themeValues } from '@weco/common/views/themes/config';

export type Props = { color: PaletteColor };

const WEdge = ({ color }: Props) => {
  return (
    <svg
      viewBox="0 0 1256 127"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', position: 'relative', bottom: '-1px' }}
    >
      <path
        d="M961.015 1.15779C977.287 -0.546414 985.386 -2.49896 985.386 12.2896C985.386 30.0005 985.342 22.8145 985.386 31.525C985.429 40.2357 985.295 62.8153 985.386 67.0191C985.477 71.2226 987.661 72.4794 994.005 71.7818L1211.63 53.4791C1233.5 51.6294 1239.94 66.2941 1243.92 81.147C1247.9 96 1256 127.001 1256 127.001H0V92.4058C298.394 64.1875 596.816 36.0385 895.205 7.81404C921.359 5.34016 944.741 2.86205 961.015 1.15779Z"
        fill={themeValues.color(color)}
      />
    </svg>
    // <span>
    //   <WShape variant="edge" color={backgroundColor} />
    // </span>
  );
};

export default WEdge;
