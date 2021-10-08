import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPaciente } from '../paciente.model';
import { PacienteService } from '../service/paciente.service';

@Component({
  templateUrl: './paciente-delete-dialog.component.html',
})
export class PacienteDeleteDialogComponent {
  paciente?: IPaciente;

  constructor(protected pacienteService: PacienteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pacienteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
