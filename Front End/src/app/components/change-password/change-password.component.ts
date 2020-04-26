import { UsersService } from './../../services/users.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
	passwordForm: FormGroup;

	constructor(private fb: FormBuilder, private usersService: UsersService) {}

	ngOnInit(): void {
		this.init();
	}

	init() {
		this.passwordForm = this.fb.group(
			{
				cpassword: ['', Validators.required],
				newPassword: ['', Validators.required],
				confirmPassword: ['', Validators.required]
			},
			{
				validator: this.Validate.bind(this)
			}
		);
	}

	ChangePassword() {
		this.usersService.ChangePassword(this.passwordForm.value).subscribe(
			data => {
				// this.passwordForm.reset();
				console.log(data);
			},
			err => console.log(err)
		);
	}

	Validate(passwordFormGroup: FormGroup) {
		const new_password = passwordFormGroup.controls.newPassword.value;
		const confirm_password = passwordFormGroup.controls.confirmPassword.value;

		if (confirm_password.length <= 0) {
			return null;
		}

		if (confirm_password !== new_password) {
			return {
				doesNotMatch: true
			};
		}

		return null;
	}
}
