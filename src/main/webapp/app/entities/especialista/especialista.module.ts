import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EspecialistaComponent } from './list/especialista.component';
import { EspecialistaDetailComponent } from './detail/especialista-detail.component';
import { EspecialistaUpdateComponent } from './update/especialista-update.component';
import { EspecialistaDeleteDialogComponent } from './delete/especialista-delete-dialog.component';
import { EspecialistaRoutingModule } from './route/especialista-routing.module';

@NgModule({
  imports: [SharedModule, EspecialistaRoutingModule],
  declarations: [EspecialistaComponent, EspecialistaDetailComponent, EspecialistaUpdateComponent, EspecialistaDeleteDialogComponent],
  entryComponents: [EspecialistaDeleteDialogComponent],
})
export class EspecialistaModule {}
