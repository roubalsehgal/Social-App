import { AuthTabsComponent } from './../components/auth-tabs/auth-tabs.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: AuthTabsComponent
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AuthRoutingModule {}
