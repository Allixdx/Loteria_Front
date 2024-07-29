import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component'
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CrearSalaComponent } from './components/crear-sala/crear-sala.component';
import { UnirseSalaComponent } from './components/unirse-sala/unirse-sala.component';
import { LoteriaComponent } from './components/loteria/loteria.component';
import { MainComponent } from './components/jugando/main/main.component';
import { PlayerComponent } from './components/jugando/player/player.component';


const routes: Routes = [
  { path: 'registro', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'crearSala', component: CrearSalaComponent },
  { path: 'unirseSala', component: UnirseSalaComponent },
  { path: 'loteria', component: LoteriaComponent },
  { path: 'playing/main/:roomId', component: MainComponent },
  { path: 'playing/player/:roomId', component: PlayerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
