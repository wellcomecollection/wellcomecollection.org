// @flow
export default (word: string): string => {
  const [firstLetter] = word;
  const restOfWord = word.slice(1);

  return `${firstLetter.toUpperCase()}${restOfWord}`;
};
