import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'CamelCase',
})
export class CamelCasePipe implements PipeTransform {
  transform(value: string) {
    const words = value.trim().toLowerCase().split(/\s+/);

    if (words.length === 0) {
      return '';
    }

    const firstWord = words[0];
    const transformedTail = words
      .slice(1)
      .map((currentWord) => {
        const firstCharacter = currentWord.charAt(0).toUpperCase();
        const remainingCharacters = currentWord.slice(1);
        return firstCharacter + remainingCharacters;
      })
      .join('');

    return firstWord + transformedTail;
  }
}
