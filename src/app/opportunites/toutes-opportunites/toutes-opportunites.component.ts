import { Component, OnInit } from '@angular/core';
import { OpportuniteService } from '../../services/opportunite.service';
import { Opportunite } from '../../models/opportunite.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-toutes-opportunites',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './toutes-opportunites.component.html',
  styleUrls: ['./toutes-opportunites.component.css']
})
export class ToutesOpportunitesComponent implements OnInit {
  opportunites: Opportunite[] = [];

  constructor(private opportuniteService: OpportuniteService) {}

  ngOnInit(): void {
    this.opportuniteService.getAllOpportunites().subscribe(data => {
      this.opportunites = data;
    });
  }

  showToast = false;
toastOffreTitre = '';

postuler(offre: Opportunite): void {
  this.toastOffreTitre = offre.titre;
  this.showToast = true;

  setTimeout(() => {
    this.showToast = false;
  }, 3000); // masque le toast après 3 secondes
}

voirPlus(offre: any): void {
     offre.showFullDescription = !offre.showFullDescription;
  }

}
