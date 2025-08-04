import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Opportunite } from '../../models/opportunite.model';
import { TypeContrat } from '../../models/enums.model';
import { VilleService } from '../../services/ville.service';
import { Ville } from '../../models/ville.model';


@Component({
  selector: 'app-candidat-dashboard',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './candidat-dashboard.component.html',
  styleUrl: './candidat-dashboard.component.css'
})
export class CandidatDashboardComponent implements OnInit {

  displayedOpportunites: Opportunite[] = [];
  form!: FormGroup;
  villes: Ville[] = [];

  constructor(private router: Router, private fb: FormBuilder, private villeService: VilleService) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      TypeContrat: ['']

    });

    this.villeService.getAllVilles().subscribe(villes => {
      this.villes = villes.filter(ville => ville.departement !== undefined) as Ville[];
    });
  }

  logout() {
    //Deconnexion
    console.log('Déconnexion');
    this.router.navigate(['/login']);
  }

  TypeContrat = TypeContrat;
  selectedTypeContrat: string = '';

  //gerer les options pour typeContrat
  contratOptions: TypeContrat[] = Object.values(TypeContrat);



}
