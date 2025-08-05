import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  private profil = {
    nom: 'Waly Guisse',
    titre: 'Développeur Full Stack',
    ville: 'Saint-Louis',
    organisation: 'Opportunités Sénégal',
    email: 'waly@example.com',
    telephone: '77 123 45 67',
    photo: 'https://i.pravatar.cc/150?img=3'
  };

  getProfil() {
    return this.profil;
  }

  updateProfil(newProfil: any) {
    this.profil = { ...this.profil, ...newProfil };
  }
}
