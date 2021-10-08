import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IReserva } from '../reserva.model';
import { ReservaService } from '../service/reserva.service';
import { ReservaDeleteDialogComponent } from '../delete/reserva-delete-dialog.component';

@Component({
  selector: 'jhi-reserva',
  templateUrl: './reserva.component.html',
})
export class ReservaComponent implements OnInit {
  reservas?: IReserva[];
  isLoading = false;

  constructor(protected reservaService: ReservaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.reservaService.query().subscribe(
      (res: HttpResponse<IReserva[]>) => {
        this.isLoading = false;
        this.reservas = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IReserva): number {
    return item.id!;
  }

  delete(reserva: IReserva): void {
    const modalRef = this.modalService.open(ReservaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.reserva = reserva;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
