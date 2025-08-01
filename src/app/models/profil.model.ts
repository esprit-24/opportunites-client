import { User } from './user.model';
import { Domaine } from './domaine.model';

export interface Profil {
    id: number;
    intitule: string;
    user: User;
    domaine: Domaine;
}