jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { HistoriaService } from '../service/historia.service';

import { HistoriaDeleteDialogComponent } from './historia-delete-dialog.component';

describe('Component Tests', () => {
  describe('Historia Management Delete Component', () => {
    let comp: HistoriaDeleteDialogComponent;
    let fixture: ComponentFixture<HistoriaDeleteDialogComponent>;
    let service: HistoriaService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [HistoriaDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(HistoriaDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(HistoriaDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(HistoriaService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({})));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        jest.spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
