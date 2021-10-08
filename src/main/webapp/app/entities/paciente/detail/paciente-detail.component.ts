import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPaciente } from '../paciente.model';

@Component({
  selector: 'jhi-paciente-detail',
  templateUrl: './paciente-detail.component.html',
})
export class PacienteDetailComponent implements OnInit {
  paciente: IPaciente | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paciente }) => {
      this.paciente = paciente;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
