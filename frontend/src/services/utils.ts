export const checkMaskRegex = (value: string, regex: RegExp): boolean => {
  const matchArray: RegExpMatchArray | null = value.match(regex);
  return matchArray !== null && value === matchArray[0];
}
