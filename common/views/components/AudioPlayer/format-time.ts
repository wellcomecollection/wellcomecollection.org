export const formatTime = (secs: number): string => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedTime: (time: number) => string = time =>
    time < 10 ? `0${time}` : `${time}`;

  return `${returnedTime(minutes)}:${returnedTime(seconds)}`;
};

const pluralise = (count: number, noun: string, suffix = 's'): string =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`;

export const formatListenToTime = (secs: number): string => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);

  return minutes ? pluralise(minutes, 'minute') : pluralise(seconds, 'second');
};

export default formatTime;
