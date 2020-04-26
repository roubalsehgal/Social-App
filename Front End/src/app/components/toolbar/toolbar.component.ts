import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import _ from 'lodash';
import * as M from 'materialize-css';
import * as moment from 'moment';
import io from 'socket.io-client';
import { MessageService } from 'src/app/services/message.service';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from './../../services/users.service';

@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterViewInit {
	@Output() onlineUsers = new EventEmitter(); //Child to parent component

	user: any;
	notifications = [];
	socket: any;
	count = [];
	chatList = [];
	msgNumber = 0;
	imageId: any;
	imageVersion: any;

	constructor(
		private tokenService: TokenService,
		private router: Router,
		private usersService: UsersService,
		private messageService: MessageService
	) {
		this.socket = io('http://localhost:3000');
	}

	ngOnInit(): void {
		this.user = this.tokenService.GetPayload();
		console.log(this.user);
		const dropDownElement = document.querySelectorAll('.dropdown-trigger');
		M.Dropdown.init(dropDownElement, {
			alignment: 'right',
			hover: true,
			coverTrigger: false
		});

		const dropDownElementTwo = document.querySelectorAll('.dropdown-trigger1');
		M.Dropdown.init(dropDownElementTwo, {
			alignment: 'right',
			hover: true,
			coverTrigger: false
		});

		this.socket.emit('online', { room: 'global', user: this.user.username });

		this.GetUser();
		this.socket.on('refreshPage', () => {
			this.GetUser();
		});
	}

	ngAfterViewInit() {
		this.socket.on('usersOnline', data => {
			//console.log(data);
			this.onlineUsers.emit(data);
		});
	}

	GetUser() {
		this.usersService.GetUserById(this.user._id).subscribe(
			data => {
				this.imageId = data.result.picId;
				this.imageVersion = data.result.picVersion;
				this.notifications = data.result.notifications.reverse();
				const value = _.filter(this.notifications, ['read', false]);
				this.count = value;
				this.chatList = data.result.chatList;
				this.CheckIfRead(this.chatList);
				//console.log(this.msgNumber);
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

	CheckIfRead(arr) {
		const checkArr = [];
		for (let i = 0; i < arr.length; i++) {
			const receiver = arr[i].msgId.message[arr[i].msgId.message.length - 1];
			//console.log('Receiver Arr', receiver);
			if (this.router.url !== `/chat/${receiver.senderName}`) {
				if (
					receiver.isRead === false &&
					receiver.receiverName === this.user.username
				) {
					checkArr.push(1);
					this.msgNumber = _.sum(checkArr);
				}
			}
		}
	}

	MarkNotification(data) {
		if (!data.read) {
			this.usersService.MarkNotification(data._id).subscribe(value => {
				//console.log('You marked and clicked me');
				this.socket.emit('refresh', {});
			});
		}
	}

	MarkAll() {
		this.usersService.MarkAllAsRead().subscribe(data => {
			//console.log(data);
			this.socket.emit('refresh', {});
		});
	}

	MarkAllMessages() {
		this.messageService.MarkAllMessages().subscribe(data => {
			this.socket.emit('refresh', {});
			this.msgNumber = 0;
		});
	}

	logout() {
		this.tokenService.DeleteToken();
		this.router.navigate(['']);
	}

	GoToHome() {
		this.router.navigate(['streams']);
	}

	GoToChatPage(name) {
		this.router.navigate(['chat', name]);
		//console.log('Debugging', this.user.username, name);
		this.messageService
			.MarkMessages(this.user.username, name)
			.subscribe(data => {
				//console.log(data);
				this.socket.emit('refresh', {});
			});
	}

	TimeFromNow(time) {
		return moment(time).fromNow();
	}

	MessageDate(date) {
		return moment(date).calendar(null, {
			sameDay: '[Today]',
			lastDay: '[Yesterday]',
			lastWeek: '[a week ago]',
			sameElse: 'DD/MM/YYYY'
		});
	}
}
