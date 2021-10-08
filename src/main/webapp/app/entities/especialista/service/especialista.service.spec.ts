import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { Especialidad } from 'app/entities/enumerations/especialidad.model';
import { IEspecialista, Especialista } from '../especialista.model';

import { EspecialistaService } from './especialista.service';

describe('Service Tests', () => {
  describe('Especialista Service', () => {
    let service: EspecialistaService;
    let httpMock: HttpTestingController;
    let elemDefault: IEspecialista;
    let expectedResult: IEspecialista | IEspecialista[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(EspecialistaService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        nombre: 'AAAAAAA',
        apellidos: 'AAAAAAA',
        rut: 'AAAAAAA',
        fechaNacimiento: currentDate,
        registroMedico: 'AAAAAAA',
        especialidad: Especialidad.MEDICINA_GENERAL,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            fechaNacimiento: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Especialista', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            fechaNacimiento: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fechaNacimiento: currentDate,
          },
          returnedFromService
        );

        service.create(new Especialista()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Especialista', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nombre: 'BBBBBB',
            apellidos: 'BBBBBB',
            rut: 'BBBBBB',
            fechaNacimiento: currentDate.format(DATE_FORMAT),
            registroMedico: 'BBBBBB',
            especialidad: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fechaNacimiento: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Especialista', () => {
        const patchObject = Object.assign(
          {
            nombre: 'BBBBBB',
            rut: 'BBBBBB',
            fechaNacimiento: currentDate.format(DATE_FORMAT),
            registroMedico: 'BBBBBB',
          },
          new Especialista()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            fechaNacimiento: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Especialista', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nombre: 'BBBBBB',
            apellidos: 'BBBBBB',
            rut: 'BBBBBB',
            fechaNacimiento: currentDate.format(DATE_FORMAT),
            registroMedico: 'BBBBBB',
            especialidad: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fechaNacimiento: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Especialista', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addEspecialistaToCollectionIfMissing', () => {
        it('should add a Especialista to an empty array', () => {
          const especialista: IEspecialista = { id: 123 };
          expectedResult = service.addEspecialistaToCollectionIfMissing([], especialista);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(especialista);
        });

        it('should not add a Especialista to an array that contains it', () => {
          const especialista: IEspecialista = { id: 123 };
          const especialistaCollection: IEspecialista[] = [
            {
              ...especialista,
            },
            { id: 456 },
          ];
          expectedResult = service.addEspecialistaToCollectionIfMissing(especialistaCollection, especialista);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Especialista to an array that doesn't contain it", () => {
          const especialista: IEspecialista = { id: 123 };
          const especialistaCollection: IEspecialista[] = [{ id: 456 }];
          expectedResult = service.addEspecialistaToCollectionIfMissing(especialistaCollection, especialista);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(especialista);
        });

        it('should add only unique Especialista to an array', () => {
          const especialistaArray: IEspecialista[] = [{ id: 123 }, { id: 456 }, { id: 22308 }];
          const especialistaCollection: IEspecialista[] = [{ id: 123 }];
          expectedResult = service.addEspecialistaToCollectionIfMissing(especialistaCollection, ...especialistaArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const especialista: IEspecialista = { id: 123 };
          const especialista2: IEspecialista = { id: 456 };
          expectedResult = service.addEspecialistaToCollectionIfMissing([], especialista, especialista2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(especialista);
          expect(expectedResult).toContain(especialista2);
        });

        it('should accept null and undefined values', () => {
          const especialista: IEspecialista = { id: 123 };
          expectedResult = service.addEspecialistaToCollectionIfMissing([], null, especialista, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(especialista);
        });

        it('should return initial array if no Especialista is added', () => {
          const especialistaCollection: IEspecialista[] = [{ id: 123 }];
          expectedResult = service.addEspecialistaToCollectionIfMissing(especialistaCollection, undefined, null);
          expect(expectedResult).toEqual(especialistaCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
