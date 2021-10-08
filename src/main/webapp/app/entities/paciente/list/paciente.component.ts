import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPaciente } from '../paciente.model';
import { PacienteService } from '../service/paciente.service';
import { PacienteDeleteDialogComponent } from '../delete/paciente-delete-dialog.component';

@Component({
  selector: 'jhi-paciente',
  templateUrl: './paciente.component.html',
})
export class PacienteComponent implements OnInit {
  pacientes?: IPaciente[];
  isLoading = false;

  constructor(protected pacienteService: PacienteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.pacienteService.query().subscribe(
      (res: HttpResponse<IPaciente[]>) => {
        this.isLoading = false;
        this.pacientes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPaciente): number {
    return item.id!;
  }

  delete(paciente: IPaciente): void {
    const modalRef = this.modalService.open(PacienteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.paciente = paciente;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
