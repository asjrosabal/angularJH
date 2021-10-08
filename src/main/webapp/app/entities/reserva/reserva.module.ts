import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ReservaComponent } from './list/reserva.component';
import { ReservaDetailComponent } from './detail/reserva-detail.component';
import { ReservaUpdateComponent } from './update/reserva-update.component';
import { ReservaDeleteDialogComponent } from './delete/reserva-delete-dialog.component';
import { ReservaRoutingModule } from './route/reserva-routing.module';

@NgModule({
  imports: [SharedModule, ReservaRoutingModule],
  declarations: [ReservaComponent, ReservaDetailComponent, ReservaUpdateComponent, ReservaDeleteDialogComponent],
  entryComponents: [ReservaDeleteDialogComponent],
})
export class ReservaModule {}
