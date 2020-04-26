import { UsersService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';
import * as moment from 'moment';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
	socket: any;

	user: any;
	notifications = [];

	constructor(
		private tokenService: TokenService,
		private usersService: UsersService
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
		this.usersService.GetUserByName(this.user.username).subscribe(data => {
			this.notifications = data.result.notifications.reverse();
		});
	}

	TimeFromNow(time) {
		return moment(time).fromNow();
	}

	MarkNotification(data) {
		if (!data.read) {
			this.usersService.MarkNotification(data._id).subscribe(value => {
				//console.log('You marked and clicked me');
				this.socket.emit('refresh', {});
			});
		}
	}

	DeleteNotification(data) {
		this.usersService.MarkNotification(data._id, true).subscribe(value => {
			this.socket.emit('refresh', {});
		});
	}
}
