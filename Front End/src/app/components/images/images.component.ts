import { TokenService } from './../../services/token.service';
import { UsersService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import io from 'socket.io-client';

const URL = 'http://localhost:3000/api/chatapp/upload-image';

@Component({
	selector: 'app-images',
	templateUrl: './images.component.html',
	styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
	uploader: FileUploader = new FileUploader({
		url: URL,
		disableMultipart: true
	});
	socket: any;
	user: any;
	selectedFile: any;
	images = [];

	constructor(
		private usersService: UsersService,
		private tokenService: TokenService
	) {
		this.socket = io('http://localhost:3000');
	}

	ngOnInit(): void {
		this.user = this.tokenService.GetPayload();
		this.GetUser();

		this.socket.on('refreshPage', () => {
			this.GetUser();
		});
	}

	GetUser() {
		this.usersService.GetUserById(this.user._id).subscribe(
			data => {
				this.images = data.result.images;
			},
			err => console.log(err)
		);
	}

	OnFileSelected(event) {
		//console.log(event);
		const file: File = event[0];

		this.ReadAsBase64(file)
			.then(result => {
				this.selectedFile = result;
			})
			.catch(err => console.log(err));
	}

	Upload() {
		if (this.selectedFile) {
			this.usersService.AddImage(this.selectedFile).subscribe(
				data => {
					//console.log(data);
					this.socket.emit('refresh', {});
					const filePath = <HTMLInputElement>(
						document.getElementById('filePath')
					);
					filePath.value = '';
				},
				err => console.log(err)
			);
		}
		//console.log(this.selectedFile); //Base 64 encoded file data in String
	}

	SetProfileImage(image) {
		this.usersService.SetDefaultImage(image.imgId, image.imgVersion).subscribe(
			data => {
				this.socket.emit('refresh', {});
			},
			err => console.log(err)
		);
	}

	ReadAsBase64(file): Promise<any> {
		const reader = new FileReader(); //MDN API
		const fileValue = new Promise((resolve, reject) => {
			reader.addEventListener('load', () => {
				resolve(reader.result);
			});

			reader.addEventListener('error', event => {
				reject(event);
			});

			reader.readAsDataURL(file);
		});

		return fileValue;
	}
}
