import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-ajout-offre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajout-offre.component.html',
  styleUrls: ['./ajout-offre.component.css']
})
export class AjoutOffreComponent {
  offre = {
    titre: '',
    description: '',
    lieu: '',
    typeContrat: '',
    salaire: null
  };

  soumettreOffre(form: NgForm) {
    if (form.valid) {
      console.log('Offre envoyée :', this.offre);
      alert('Offre publiée avec succès ! ✅');
      form.resetForm();
    }
  }
}
