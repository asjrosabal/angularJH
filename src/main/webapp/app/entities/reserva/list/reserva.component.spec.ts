import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ReservaService } from '../service/reserva.service';

import { ReservaComponent } from './reserva.component';

describe('Component Tests', () => {
  describe('Reserva Management Component', () => {
    let comp: ReservaComponent;
    let fixture: ComponentFixture<ReservaComponent>;
    let service: ReservaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ReservaComponent],
      })
        .overrideTemplate(ReservaComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ReservaComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ReservaService);

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
      expect(comp.reservas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
