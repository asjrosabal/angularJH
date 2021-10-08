import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHistoria, Historia } from '../historia.model';
import { HistoriaService } from '../service/historia.service';

@Injectable({ providedIn: 'root' })
export class HistoriaRoutingResolveService implements Resolve<IHistoria> {
  constructor(protected service: HistoriaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHistoria> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((historia: HttpResponse<Historia>) => {
          if (historia.body) {
            return of(historia.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Historia());
  }
}
