import { Region } from './region.model';

export interface Departement {
  id: number;
  nom: string;
  region: Region;
}