export const dropDownOptionGenerator = <T>(
  arr: T[],
  valField: keyof T,
  textField: keyof T,
) => {
  return arr.map((item) => ({
    value: item[valField]!,
    text: item[textField]!,
  }));
};
