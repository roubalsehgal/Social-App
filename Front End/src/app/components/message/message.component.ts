import { UsersService } from './../../services/users.service';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import {
	Component,
	OnInit,
	AfterViewInit,
	Input,
	OnChanges
} from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import io from 'socket.io-client';
import _ from 'lodash';

@Component({
	selector: 'app-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewInit, OnChanges {
	@Input() users; //Parent to child component

	receiver: String;
	user: any;
	message: String;
	receiverData: any;
	messagesArray = [];
	socket: any;
	typingMessage;
	typing = false;
	isOnline = false;

	constructor(
		private tokenService: TokenService,
		private msgService: MessageService,
		private route: ActivatedRoute,
		private usersService: UsersService
	) {
		this.socket = io('http://localhost:3000');
	}

	ngOnInit(): void {
		this.user = this.tokenService.GetPayload();
		this.route.params.subscribe(params => {
			this.receiver = params.name;
			//console.log(this.receiverName);
			this.GetUserByUsername(this.receiver);

			this.socket.on('refreshPage', () => {
				this.GetUserByUsername(this.receiver);
			});
		});

		this.socket.on('is_typing', data => {
			if (data.sender === this.receiver) {
				this.typing = true;
			}
		});

		this.socket.on('has_stopped_typing', data => {
			if (data.sender === this.receiver) {
				this.typing = false;
			}
		});
	}

	ngOnChanges() {
		const title = document.querySelector('.nameCol');
		if (this.users.length > 0) {
			//console.log(this.users);
			const result = _.indexOf(this.users, this.receiver);
			if (result > -1) {
				this.isOnline = true;
				(title as HTMLElement).style.marginTop = '30px';
			} else {
				this.isOnline = false;
				(title as HTMLElement).style.marginTop = '15px';
			}
		}
	}

	ngAfterViewInit() {
		const params = {
			room1: this.user.username,
			room2: this.receiver
		};

		this.socket.emit('join chat', params);
	}

	GetUserByUsername(name) {
		this.usersService.GetUserByName(name).subscribe(data => {
			//console.log(data);
			this.receiverData = data.result;

			this.GetMessages(this.user._id, data.result._id);
		});
	}

	SendMessage() {
		if (this.message) {
			this.msgService
				.SendMessage(
					this.user._id,
					this.receiverData._id,
					this.receiverData.username,
					this.message
				)
				.subscribe(data => {
					this.socket.emit('refresh', {});
					this.message = '';
				});
		}
	}

	GetMessages(senderId, receiverId) {
		this.msgService.GetAllMessages(senderId, receiverId).subscribe(data => {
			this.messagesArray = data.messages.message;
		});
	}

	IsTyping() {
		this.socket.emit('start_typing', {
			sender: this.user.username,
			receiver: this.receiver
		});

		if (this.typingMessage) {
			clearTimeout(this.typingMessage);
		}

		this.typingMessage = setTimeout(() => {
			this.socket.emit('stop_typing', {
				sender: this.user.username,
				receiver: this.receiver
			});
		}, 500);
	}
}
