import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'especialista',
        data: { pageTitle: 'Especialistas' },
        loadChildren: () => import('./especialista/especialista.module').then(m => m.EspecialistaModule),
      },
      {
        path: 'paciente',
        data: { pageTitle: 'Pacientes' },
        loadChildren: () => import('./paciente/paciente.module').then(m => m.PacienteModule),
      },
      {
        path: 'reserva',
        data: { pageTitle: 'Reservas' },
        loadChildren: () => import('./reserva/reserva.module').then(m => m.ReservaModule),
      },
      {
        path: 'historia',
        data: { pageTitle: 'Historias' },
        loadChildren: () => import('./historia/historia.module').then(m => m.HistoriaModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
