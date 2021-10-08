import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IHistoria } from '../historia.model';
import { HistoriaService } from '../service/historia.service';
import { HistoriaDeleteDialogComponent } from '../delete/historia-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-historia',
  templateUrl: './historia.component.html',
})
export class HistoriaComponent implements OnInit {
  historias?: IHistoria[];
  isLoading = false;

  constructor(protected historiaService: HistoriaService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.historiaService.query().subscribe(
      (res: HttpResponse<IHistoria[]>) => {
        this.isLoading = false;
        this.historias = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IHistoria): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(historia: IHistoria): void {
    const modalRef = this.modalService.open(HistoriaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.historia = historia;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
