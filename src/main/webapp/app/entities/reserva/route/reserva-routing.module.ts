import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReservaComponent } from '../list/reserva.component';
import { ReservaDetailComponent } from '../detail/reserva-detail.component';
import { ReservaUpdateComponent } from '../update/reserva-update.component';
import { ReservaRoutingResolveService } from './reserva-routing-resolve.service';

const reservaRoute: Routes = [
  {
    path: '',
    component: ReservaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReservaDetailComponent,
    resolve: {
      reserva: ReservaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReservaUpdateComponent,
    resolve: {
      reserva: ReservaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReservaUpdateComponent,
    resolve: {
      reserva: ReservaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(reservaRoute)],
  exports: [RouterModule],
})
export class ReservaRoutingModule {}
