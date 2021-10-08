import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReserva } from '../reserva.model';

@Component({
  selector: 'jhi-reserva-detail',
  templateUrl: './reserva-detail.component.html',
})
export class ReservaDetailComponent implements OnInit {
  reserva: IReserva | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reserva }) => {
      this.reserva = reserva;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
