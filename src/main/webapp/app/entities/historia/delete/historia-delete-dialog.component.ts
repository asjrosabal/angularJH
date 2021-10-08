import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHistoria } from '../historia.model';
import { HistoriaService } from '../service/historia.service';

@Component({
  templateUrl: './historia-delete-dialog.component.html',
})
export class HistoriaDeleteDialogComponent {
  historia?: IHistoria;

  constructor(protected historiaService: HistoriaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.historiaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
