import { Organisation } from './organisation.model';
import { Domaine } from './domaine.model';
import { Ville } from './ville.model';
import { NiveauEtude, TypeContrat, Statut } from './enums.model';

export interface Opportunite {
<<<<<<< HEAD
    id?: number;
=======
    id: number;
>>>>>>> 7ec9e45d586a8a6253e963dfac2aae135fcfcd9f
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
