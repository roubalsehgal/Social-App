import { MessageService } from './../services/message.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StreamsComponent } from './../components/streams/streams.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenService } from '../services/token.service';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { SideComponent } from '../components/side/side.component';
import { PostFormComponent } from '../components/post-form/post-form.component';
import { PostsComponent } from '../components/posts/posts.component';
import { PostService } from '../services/post.service';
import { CommentsComponent } from '../components/comments/comments.component';
import { PeopleComponent } from '../components/people/people.component';
import { UsersService } from '../services/users.service';
import { FollowingComponent } from '../components/following/following.component';
import { FollowersComponent } from '../components/followers/followers.component';
import { NotificationsComponent } from '../components/notifications/notifications.component';
import { TopStreamsComponent } from '../components/top-streams/top-streams.component';
import { ChatComponent } from '../components/chat/chat.component';
import { MessageComponent } from '../components/message/message.component';
import { NgxAutoScrollModule } from 'ngx-auto-scroll';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ImagesComponent } from '../components/images/images.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ViewUserComponent } from '../components/view-user/view-user.component';
import { ChangePasswordComponent } from '../components/change-password/change-password.component';

@NgModule({
	declarations: [
		StreamsComponent,
		ToolbarComponent,
		SideComponent,
		PostFormComponent,
		PostsComponent,
		CommentsComponent,
		PeopleComponent,
		FollowingComponent,
		FollowersComponent,
		NotificationsComponent,
		TopStreamsComponent,
		ChatComponent,
		MessageComponent,
		ImagesComponent,
		ViewUserComponent,
		ChangePasswordComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		RouterModule,
		NgxAutoScrollModule,
		FileUploadModule
	],
	exports: [StreamsComponent, ToolbarComponent, SideComponent],
	providers: [TokenService, PostService, UsersService, MessageService]
})
export class StreamsModule {}
