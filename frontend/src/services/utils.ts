export const checkMaskEquals = (value: string, mask: RegExp): boolean => {
  const matchArray: RegExpMatchArray | null = value.match(mask);
  return matchArray !== null && value === matchArray[0];
}

export const checkMaskIncluded = (value: string, mask: RegExp): boolean => {
  return value.search(mask) !== -1;
}

export const guid4 = (): string => {
  const replacer = (chart: string): string => { 
    const randomValue = Math.random() * 16 | 0;
    return (chart === 'x' ? randomValue : (randomValue & 0x3 | 0x8)).toString(16); 
  };

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, replacer);
}
