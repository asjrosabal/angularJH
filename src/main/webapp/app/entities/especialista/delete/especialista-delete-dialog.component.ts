import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEspecialista } from '../especialista.model';
import { EspecialistaService } from '../service/especialista.service';

@Component({
  templateUrl: './especialista-delete-dialog.component.html',
})
export class EspecialistaDeleteDialogComponent {
  especialista?: IEspecialista;

  constructor(protected especialistaService: EspecialistaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.especialistaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
