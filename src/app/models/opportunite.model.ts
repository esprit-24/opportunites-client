import { Organisation } from './organisation.model';
import { Domaine } from './domaine.model';
import { Ville } from './ville.model';
import { NiveauEtude, TypeContrat, Statut } from './enums.model';

export interface Opportunite {
showFullDescription: any;
    id?: number;
    titre: string;
    description: string;
    dateDebut: string;
    dateFin?: string | null;
    adresse?: string | null;
    niveauEtudeRequis?: NiveauEtude | null;
    nombrePostes: number;
    salaire?: number | null;
    statut?: Statut;
    typeContrat?: TypeContrat;
    organisation?: Organisation;
    domaine?: Domaine;
    ville?: Ville;
}
