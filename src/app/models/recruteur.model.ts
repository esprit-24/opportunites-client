import { Organisation } from './organisation.model';

export interface Recruteur {
    id: number;
    titreProfessionnel: string;
    biographie: string;
    organisation: Organisation;
}