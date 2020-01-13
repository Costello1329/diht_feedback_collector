export const checkMaskRegex = (value: string, regex: RegExp): boolean => {
  const matchArray: RegExpMatchArray | null = value.match(regex);
  return matchArray !== null && value === matchArray[0];
}

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

console.log(guid());