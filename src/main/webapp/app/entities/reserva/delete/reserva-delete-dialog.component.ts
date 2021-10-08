import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IReserva } from '../reserva.model';
import { ReservaService } from '../service/reserva.service';

@Component({
  templateUrl: './reserva-delete-dialog.component.html',
})
export class ReservaDeleteDialogComponent {
  reserva?: IReserva;

  constructor(protected reservaService: ReservaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.reservaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
