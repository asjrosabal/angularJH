import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEspecialista } from '../especialista.model';

@Component({
  selector: 'jhi-especialista-detail',
  templateUrl: './especialista-detail.component.html',
})
export class EspecialistaDetailComponent implements OnInit {
  especialista: IEspecialista | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ especialista }) => {
      this.especialista = especialista;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
