import { Component, OnInit } from '@angular/core';
import * as M from 'materialize-css';

@Component({
	selector: 'app-auth-tabs',
	templateUrl: './auth-tabs.component.html',
	styleUrls: ['./auth-tabs.component.css']
})
export class AuthTabsComponent implements OnInit {
	constructor() {}
	userForms: HTMLElement = document.getElementById('user_options-forms');
	loginButton: HTMLElement = document.getElementById('login-button');
	signupButton: HTMLElement = document.getElementById('signup-button');

	ngOnInit(): void {
		const tabs = document.querySelector('.tabs');
		M.Tabs.init(tabs, {});

		this.userForms = document.getElementById('user_options-forms');
		this.loginButton = document.getElementById('login-button');
		this.signupButton = document.getElementById('signup-button');
	}
	onLogin() {
		this.userForms.classList.remove('bounceLeft');
		this.userForms.classList.add('bounceRight');
	}

	
	onSignup() {
		this.userForms.classList.remove('bounceRight');
		this.userForms.classList.add('bounceLeft');
	}

}
