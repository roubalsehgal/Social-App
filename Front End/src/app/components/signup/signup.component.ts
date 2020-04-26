import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from './../../services/users.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
	signupForm: FormGroup;
	errorMessage: String;
	showSpinner: boolean = false;
	message:any;
	constructor(
		private authService: AuthService,
		private fb: FormBuilder,
		private router: Router,
		private tokenService: TokenService,
		private service:UsersService
	) {}

	ngOnInit(): void {
		// this.init();
	}

	// init() {
	// 	this.signupForm = this.fb.group({
	// 		// username: ['', Validators.required],
	// 		// email: ['', [Validators.email, Validators.required]],
	// 		// password: ['', Validators.required]
	// 	});
	// }

	signupUser(form) {
		// this.showSpinner = true;
		console.log(form);
		this.authService.registerUser(form.value).subscribe(
			data => {
				console.log(data);
				this.tokenService.SetToken(data.token);
				form.reset();
				this.router.navigate(['streams']);
				// setTimeout(() => {
				
				// }, 2000);
			},
			err => {
				// this.showSpinner = false;
				//console.log(err);
				if (err.error.msg) {
					this.errorMessage = err.error.msg[0].message;
				}
				if (err.error.message) {
					this.errorMessage = err.error.message;
				}
			}
		);
	}
	
}

