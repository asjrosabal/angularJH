import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PacienteComponent } from './list/paciente.component';
import { PacienteDetailComponent } from './detail/paciente-detail.component';
import { PacienteUpdateComponent } from './update/paciente-update.component';
import { PacienteDeleteDialogComponent } from './delete/paciente-delete-dialog.component';
import { PacienteRoutingModule } from './route/paciente-routing.module';

@NgModule({
  imports: [SharedModule, PacienteRoutingModule],
  declarations: [PacienteComponent, PacienteDetailComponent, PacienteUpdateComponent, PacienteDeleteDialogComponent],
  entryComponents: [PacienteDeleteDialogComponent],
})
export class PacienteModule {}
