import { City } from "./city";

export interface Address {
  id: number;
  city: City;
  neighborhood: string;
  street: string;
  num: number;
  complement: string;
  cep: string;
}
