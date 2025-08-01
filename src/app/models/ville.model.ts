import { Departement } from './departement.model';

export interface Ville {
    id: number;
    nom: string;
    departement: Departement;
}