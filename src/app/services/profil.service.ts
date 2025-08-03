import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  private profil = {
    nom: 'Waly Guisse',
    email: 'waly@example.com',
    telephone: '77 123 45 67'
  };

  getProfil() {
    return this.profil;
  }

  updateProfil(newProfil: any) {
    this.profil = {...this.profil, ...newProfil};
  }
}
