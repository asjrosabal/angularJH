import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PacienteService } from '../service/paciente.service';

import { PacienteComponent } from './paciente.component';

describe('Component Tests', () => {
  describe('Paciente Management Component', () => {
    let comp: PacienteComponent;
    let fixture: ComponentFixture<PacienteComponent>;
    let service: PacienteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PacienteComponent],
      })
        .overrideTemplate(PacienteComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PacienteComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PacienteService);

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
      expect(comp.pacientes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
