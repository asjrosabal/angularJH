import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEspecialista } from '../especialista.model';
import { EspecialistaService } from '../service/especialista.service';
import { EspecialistaDeleteDialogComponent } from '../delete/especialista-delete-dialog.component';

@Component({
  selector: 'jhi-especialista',
  templateUrl: './especialista.component.html',
})
export class EspecialistaComponent implements OnInit {
  especialistas?: IEspecialista[];
  isLoading = false;

  constructor(protected especialistaService: EspecialistaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.especialistaService.query().subscribe(
      (res: HttpResponse<IEspecialista[]>) => {
        this.isLoading = false;
        this.especialistas = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEspecialista): number {
    return item.id!;
  }

  delete(especialista: IEspecialista): void {
    const modalRef = this.modalService.open(EspecialistaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.especialista = especialista;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
