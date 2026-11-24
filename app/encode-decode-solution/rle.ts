// Run-length encoding. Pure functions, so they can be tested without React.

export function encode(text: string): string {
   let out = "";
   let i = 0;
   while (i < text.length) {
      let j = i;
      while (j < text.length && text[j] === text[i]) j++;
      out += `${j - i}${text[i]}`;
      i = j;
   }
   return out;
}

// Zero or more groups: a count from 1 upward (no leading zero) followed by one non-digit character.
const ENCODED = /^(?:[1-9]\d*\D)*$/;

export function isValidEncoded(text: string): boolean {
   return ENCODED.test(text);
}

export function hasDigit(text: string): boolean {
   return /\d/.test(text);
}

export function decode(text: string): string {
   return text.replace(/([1-9]\d*)(\D)/g, (_, count: string, char: string) => char.repeat(Number(count)));
}
