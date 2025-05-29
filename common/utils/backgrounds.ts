// Generates a wobbly SVG string for use as a background image
// topColor: hex or CSS color for the top
// bottomColor: hex or CSS color for the bottom
// percent: number (0-100) for how much of the SVG height is occupied by the top color (the rest is bottom)
// intensity: how wobbly the line is (default 50)
// points: number of points in the wobbly line (default 5)
export function generateWobblySplitSvg({
  topColor = 'white',
  bottomColor = 'black',
  percent = 50,
  intensity = 7,
  points = 15,
}: {
  topColor?: string;
  bottomColor?: string;
  percent?: number;
  intensity?: number;
  points?: number;
}): string {
  // Generate points for the wobbly line
  function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const width = 100;
  const height = 100;
  const yBase = percent;
  const yWobbleMin = Math.max(0, yBase - intensity / 2);
  const yWobbleMax = Math.min(100, yBase + intensity / 2);
  const step = width / points;

  // Build wobbly line from left to right, starting and ending at yBase
  let pointsArr = [`0,${yBase}`];
  for (let i = 1; i < points; i++) {
    const x = i * step;
    const y = randomInt(yWobbleMin, yWobbleMax);
    pointsArr.push(`${x},${y}`);
  }
  pointsArr.push(`${width},${yBase}`);

  // Top shape (topColor) - covers from (0,0) to (width,0), then down to wobbly line (right to left)
  const topPoints = [`0,0`, `${width},0`, ...pointsArr.slice().reverse(), `0,${yBase}`].join(' ');

  // Bottom shape (bottomColor) - starts at (0,yBase), follows wobbly line left to right, then down to bottom
  const bottomPoints = [...pointsArr, `${width},${height}`, `0,${height}`].join(' ');
  
  return `
<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="${topPoints}" fill="${topColor}"/>
  <polygon points="${bottomPoints}" fill="${bottomColor}"/>
</svg>
`.replace(/\s+/g, ' ');
}
export const transparentGif =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
export const whiteBackgroundHalfOpacity =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=';
export const repeatingLs =
  'https://images.prismic.io/wellcomecollection%2F805ad61b-fba6-4dc1-b2d3-55dbcda0c9f1_ls_svg.svg';
export const repeatingLsBlack =
  'https://images.prismic.io/wellcomecollection%2Fe483a8f3-f7bb-4c3f-8081-8f5d8875230e_ls_svg_black.svg';
export const headerBackgroundLs =
  'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F43a35689-4923-4451-85d9-1ab866b1826d_event_header_background.svg';
export const landingHeaderBackgroundLs =
  'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg';
