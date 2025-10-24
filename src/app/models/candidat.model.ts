import { NiveauEtude } from './enums.model';
import { User } from './user.model';

export interface Candidat {
    id: number;
    dateNaissance: string;
    niveauEtude: NiveauEtude;
    cv: string;
    statutActuel: string;
    user?: User
}