import { Opportunite } from './opportunite.model';
import { StatutCandidature } from './enums.model';
import { Candidat } from './candidat.model';

export interface Candidature {
    id: number;
    datePostulation: string;
    statutCandidature: StatutCandidature;
    lettreMotivation?: string;
    opportunite?: Opportunite;
    candidat?: Candidat;
}