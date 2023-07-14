export const formatPlayerTime = (
  secs: number
): { visual: string; nonVisual: string } => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);

  const nonVisualMinutes = (minutes: number): string => {
    switch (minutes) {
      case 0:
        return '';
      case 1:
        return '1 minute and';
      default:
        return `${minutes} minutes and`;
    }
  };

  return {
    visual: `${`${minutes}`.padStart(2, '0')}:${`${seconds}`.padStart(2, '0')}`,
    nonVisual: `${nonVisualMinutes(minutes)} ${seconds} seconds`,
  };
};

export const formatVolume = (vol: number): string => {
  return `${Math.floor(vol * 100)}`;
};
