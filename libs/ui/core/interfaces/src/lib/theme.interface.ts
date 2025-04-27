import { ThemeType } from './theme-type.enum';
import { Tokens } from './tokens.interface';

export interface Theme {
  type: ThemeType;
  tokens: Tokens;
}
