import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobService } from '../services/job.service';
import { Opportunite } from '../models/opportunite.model';
import { Domaine } from '../models/domaine.model';
import { Region } from '../models/region.model';
import { TypeContrat } from '../models/enums.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accueil',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit {

  opportunites: Opportunite[] = [];
  domaines: Domaine[] = [];
  regions: Region[] = [];
  filteredOpportunites: Opportunite[] = [];
  displayedOpportunites: Opportunite[] = [];


  constructor(private jobService: JobService) {}

  ngOnInit(): void { }

}
