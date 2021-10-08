jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IEspecialista, Especialista } from '../especialista.model';
import { EspecialistaService } from '../service/especialista.service';

import { EspecialistaRoutingResolveService } from './especialista-routing-resolve.service';

describe('Service Tests', () => {
  describe('Especialista routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: EspecialistaRoutingResolveService;
    let service: EspecialistaService;
    let resultEspecialista: IEspecialista | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(EspecialistaRoutingResolveService);
      service = TestBed.inject(EspecialistaService);
      resultEspecialista = undefined;
    });

    describe('resolve', () => {
      it('should return IEspecialista returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEspecialista = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultEspecialista).toEqual({ id: 123 });
      });

      it('should return new IEspecialista if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEspecialista = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultEspecialista).toEqual(new Especialista());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Especialista })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEspecialista = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultEspecialista).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
