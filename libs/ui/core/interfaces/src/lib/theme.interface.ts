import { ThemeType } from './theme-type.type';
import { Tokens } from './tokens.interface';

export interface Theme {
  type: ThemeType;
  tokens: Tokens;
}
