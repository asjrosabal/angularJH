import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HistoriaComponent } from '../list/historia.component';
import { HistoriaDetailComponent } from '../detail/historia-detail.component';
import { HistoriaUpdateComponent } from '../update/historia-update.component';
import { HistoriaRoutingResolveService } from './historia-routing-resolve.service';

const historiaRoute: Routes = [
  {
    path: '',
    component: HistoriaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HistoriaDetailComponent,
    resolve: {
      historia: HistoriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HistoriaUpdateComponent,
    resolve: {
      historia: HistoriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HistoriaUpdateComponent,
    resolve: {
      historia: HistoriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(historiaRoute)],
  exports: [RouterModule],
})
export class HistoriaRoutingModule {}
