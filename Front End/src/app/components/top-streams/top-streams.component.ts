import { Router } from '@angular/router';
import { TokenService } from './../../services/token.service';
import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';

@Component({
	selector: 'app-top-streams',
	templateUrl: './top-streams.component.html',
	styleUrls: ['./top-streams.component.css']
})
export class TopStreamsComponent implements OnInit {
	socket: any;
	topPosts = [];
	user: any;
	constructor(
		private postService: PostService,
		private tokenService: TokenService,
		private router: Router
	) {
		this.socket = io('http://localhost:3000');
	}

	ngOnInit(): void {
		this.user = this.tokenService.GetPayload();
		this.AllPosts();

		this.socket.on('refreshPage', data => {
			this.AllPosts();
		});
	}

	AllPosts() {
		this.postService.getAllPosts().subscribe(
			data => {
				this.topPosts = data.top;
			},
			err => {
				if (err.error.token === null) {
					//alert('Session Timed out! Login Again');
					this.tokenService.DeleteToken();
					this.router.navigate(['']);
				}
			}
		);
	}

	LikePost(post) {
		this.postService.addLike(post).subscribe(
			data => {
				console.log(data);
				this.socket.emit('refresh', {});
			},
			err => console.log(err)
		);
	}

	CheckInLikesArray(arr, username) {
		return _.some(arr, { username: username });
	}

	TimeFromNow(time) {
		return moment(time).fromNow();
	}

	OpenCommentBox(post) {
		this.router.navigate(['post', post._id]);
	}
}
