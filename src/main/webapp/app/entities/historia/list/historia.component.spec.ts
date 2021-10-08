import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { HistoriaService } from '../service/historia.service';

import { HistoriaComponent } from './historia.component';

describe('Component Tests', () => {
  describe('Historia Management Component', () => {
    let comp: HistoriaComponent;
    let fixture: ComponentFixture<HistoriaComponent>;
    let service: HistoriaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [HistoriaComponent],
      })
        .overrideTemplate(HistoriaComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(HistoriaComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(HistoriaService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.historias?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
