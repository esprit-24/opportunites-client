import { Organisation } from './organisation.model';
import { Domaine } from './domaine.model';
import { Ville } from './ville.model';
import { NiveauEtude, TypeContrat, Statut } from './enums.model';

export interface Opportunite {
    id?: number;
    titre: string;
    description: string;
    dateDebut: string;
    dateFin?: string;
    adresse?: string;
    niveauEtudeRequis?: NiveauEtude;
    nombrePostes?: number;
    salaire?: number;
    statut?: Statut;
    typeContrat?: TypeContrat;
    organisation?: Organisation;
    domaine?: Domaine;
    ville?: Ville;
}