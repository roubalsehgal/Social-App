import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
// var bcrypt = require('bcryptjs');
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	errorMessage: string;
	showSpinner: boolean = false;
	credentials:any;
	flag:Boolean;
	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router,
		private tokenService: TokenService,
		
	) {}

	ngOnInit(): void {}

	loginUser(form) {
		  if(form.value.email!="" && form.value.password!=""){
			 this.authService.checkUser(form.value).subscribe(
				data => {
					 
					//  var userData = JSON.parse(data);
				   
					 if(data == '') {
						alert('Invalid Credentials');
					 }
					 else {
						const userData = JSON.parse(data);
						console.log(userData);
						this.setUserToken(userData);
					 }
					
				},
				err => {
					if (err.error.message) {
						this.errorMessage = err.error.message;
					}
				}
			);
		}
		else {
		  alert("Pls enter all fields");
		}
	}
	 setUserToken(userData)
	{
		console.log('hehe');
		this.authService.loginUser(userData).subscribe( (data) => {
		this.tokenService.SetToken(data.token);
	    this.router.navigate(['streams']);
		});
	}
}

