import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EspecialistaService } from '../service/especialista.service';

import { EspecialistaComponent } from './especialista.component';

describe('Component Tests', () => {
  describe('Especialista Management Component', () => {
    let comp: EspecialistaComponent;
    let fixture: ComponentFixture<EspecialistaComponent>;
    let service: EspecialistaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EspecialistaComponent],
      })
        .overrideTemplate(EspecialistaComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EspecialistaComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(EspecialistaService);

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
      expect(comp.especialistas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
