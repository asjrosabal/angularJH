import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PacienteComponent } from '../list/paciente.component';
import { PacienteDetailComponent } from '../detail/paciente-detail.component';
import { PacienteUpdateComponent } from '../update/paciente-update.component';
import { PacienteRoutingResolveService } from './paciente-routing-resolve.service';

const pacienteRoute: Routes = [
  {
    path: '',
    component: PacienteComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PacienteDetailComponent,
    resolve: {
      paciente: PacienteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PacienteUpdateComponent,
    resolve: {
      paciente: PacienteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PacienteUpdateComponent,
    resolve: {
      paciente: PacienteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pacienteRoute)],
  exports: [RouterModule],
})
export class PacienteRoutingModule {}
