import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EspecialistaComponent } from '../list/especialista.component';
import { EspecialistaDetailComponent } from '../detail/especialista-detail.component';
import { EspecialistaUpdateComponent } from '../update/especialista-update.component';
import { EspecialistaRoutingResolveService } from './especialista-routing-resolve.service';

const especialistaRoute: Routes = [
  {
    path: '',
    component: EspecialistaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EspecialistaDetailComponent,
    resolve: {
      especialista: EspecialistaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EspecialistaUpdateComponent,
    resolve: {
      especialista: EspecialistaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EspecialistaUpdateComponent,
    resolve: {
      especialista: EspecialistaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(especialistaRoute)],
  exports: [RouterModule],
})
export class EspecialistaRoutingModule {}
