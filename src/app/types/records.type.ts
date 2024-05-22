import { SkyCountryFieldCountry } from '@skyux/lookup';

export interface RecordsType {
  id: string;
  name: string;
  event: string;
  country: SkyCountryFieldCountry;
  award: string;
  selected?: boolean;
  edit?: boolean;
  delete?: boolean;
}
