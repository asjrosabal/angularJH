jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IHistoria, Historia } from '../historia.model';
import { HistoriaService } from '../service/historia.service';

import { HistoriaRoutingResolveService } from './historia-routing-resolve.service';

describe('Service Tests', () => {
  describe('Historia routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: HistoriaRoutingResolveService;
    let service: HistoriaService;
    let resultHistoria: IHistoria | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(HistoriaRoutingResolveService);
      service = TestBed.inject(HistoriaService);
      resultHistoria = undefined;
    });

    describe('resolve', () => {
      it('should return IHistoria returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultHistoria = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultHistoria).toEqual({ id: 123 });
      });

      it('should return new IHistoria if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultHistoria = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultHistoria).toEqual(new Historia());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Historia })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultHistoria = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultHistoria).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
