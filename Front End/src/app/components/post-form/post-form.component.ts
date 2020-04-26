import { PostService } from './../../services/post.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import io from 'socket.io-client';

const URL = 'http://localhost:3000/api/chatapp/upload-image';

@Component({
	selector: 'app-post-form',
	templateUrl: './post-form.component.html',
	styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
	socket: any;
	postForm: FormGroup;

	uploader: FileUploader = new FileUploader({
		url: URL,
		disableMultipart: true
	});

	selectedFile: any;

	constructor(private fb: FormBuilder, private postService: PostService) {
		this.socket = io('http://localhost:3000');
	}

	ngOnInit(): void {
		this.init();
	}

	init() {
		this.postForm = this.fb.group({
			post: ['', Validators.required]
		});
	}

	SubmitPost() {
		let body;
		if (!this.selectedFile) {
			body = {
				post: this.postForm.value.post // No image post
			};
		} else if ((this.selectedFile as String).charAt(5) === 'v') {
			body = {
				post: this.postForm.value.post, // with video post
				video: this.selectedFile
			};
		} else {
			body = {
				post: this.postForm.value.post, // with image post
				image: this.selectedFile
			};
		}

		console.log(body);

		this.postService.addPost(body).subscribe(data => {
			this.socket.emit('refresh', { data: 'this is an event test' });
			this.postForm.reset();
		});
	}

	OnFileSelected(event) {
		//console.log(event);
		const file: File = event[0];

		this.ReadAsBase64(file)
			.then(result => {
				this.selectedFile = result;
				//console.log(this.selectedFile);
			})
			.catch(err => console.log(err));
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
