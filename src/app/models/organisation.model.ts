import { Ville } from './ville.model';

export interface Organisation {
    id: number;
    nom: string;
    presentation: string;
    secteurActivite?: string;
    logoUrl?: string;
    adresse: string;
    siteWeb?: string;
    emailContact: string;
    telephone?: string;
    ville?: Ville;
}