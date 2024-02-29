function formatNumber(
  num: number,
  minDigits: number = 0,
  maxDigits: number = 2,
  locale: string = "en-US"
): string {
  if (num === undefined || num === null) return `${num}`;

  if (isNaN(num)) return `${num}`;

  const numStr = `${num}`;

  if (!numStr.includes(".")) return num.toLocaleString(locale);

  return num.toLocaleString(locale, {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  });
}

function shortenNumber(
  num: number,
  digits: number = 2,
  locale: string = "en-US"
): string {
  if (num === undefined || num === null) return `${num}`;

  if (isNaN(num)) return `${num}`;

  if (num >= 1e12) return `${formatNumber(num / 1e12)}T`;
  if (num >= 1e9) return `${formatNumber(num / 1e9)}B`;
  if (num >= 1e6) return `${formatNumber(num / 1e6)}M`;
  if (num >= 10 * 1e3) return `${formatNumber(num / 1e3)}K`;
  if (num >= 1e3) return `${formatNumber(Math.floor(num))}`;

  return formatNumber(num, digits, digits, locale);
}

function ellipsis(str: string, max: number) {
  if (!str) return str;

  if (str.length <= max) {
    return str;
  }

  const mid = Math.floor(max / 2);
  return str.slice(0, mid) + ".." + str.slice(str.length - mid);
}

function randomAmount() {
  return (
    (Math.random() *
      (Math.random() * (Math.random() * (100000000 - 1) + 1 - 1) + 1 - 1) +
      1) /
    100
  );
}

function onlyNumbers(text: string) {
  return text.replace(/[^\d]/g, "");
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toCamelCase(text: string) {
  return text.replace(/-\w/g, clearAndUpper);
}

function toPascalCase(text: string) {
  return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

function clearAndUpper(text: string) {
  return text.replace(/-/, "").toUpperCase();
}

export {
  capitalize,
  ellipsis,
  formatNumber,
  onlyNumbers,
  randomAmount,
  shortenNumber,
  toCamelCase,
  toPascalCase,
};
