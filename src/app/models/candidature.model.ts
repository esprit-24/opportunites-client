import { Opportunite } from './opportunite.model';
import { StatutCandidature } from './enums.model';
import { User } from './user.model';

export interface Candidature {
    id: number;
    datePostulation: string;
    statutCandidature: StatutCandidature;
    textBlob: string;
    opportunite: Opportunite;
    candidat: User;
}