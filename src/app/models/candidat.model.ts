import { NiveauEtude } from './enums.model';

export interface Candidat {
    id: number;
    dateNaissance: string;
    niveauEtude: NiveauEtude;
    cv: string;
    statutActuel: string;
}