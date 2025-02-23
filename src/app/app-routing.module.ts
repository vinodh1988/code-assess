import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmentComponent } from './assessment/assessment.component';

const routes: Routes = [
  { path: 'code-assessments/:assessmentCode', component: AssessmentComponent },
  { path: '', redirectTo: '/code-assessments/000-000', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
