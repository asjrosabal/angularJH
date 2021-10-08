import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HistoriaComponent } from './list/historia.component';
import { HistoriaDetailComponent } from './detail/historia-detail.component';
import { HistoriaUpdateComponent } from './update/historia-update.component';
import { HistoriaDeleteDialogComponent } from './delete/historia-delete-dialog.component';
import { HistoriaRoutingModule } from './route/historia-routing.module';

@NgModule({
  imports: [SharedModule, HistoriaRoutingModule],
  declarations: [HistoriaComponent, HistoriaDetailComponent, HistoriaUpdateComponent, HistoriaDeleteDialogComponent],
  entryComponents: [HistoriaDeleteDialogComponent],
})
export class HistoriaModule {}
