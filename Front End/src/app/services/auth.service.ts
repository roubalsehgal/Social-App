import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASEURL = 'http://localhost:3000/api/chatapp';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	constructor(private http: HttpClient) {}

	registerUser(body): Observable<any> {
		return this.http.post(`${BASEURL}/register`, body);
	}
	
	checkUser(body):Observable<any> {
		return this.http.post("http://localhost:8080/userLogin",body,{responseType:'text' as 'json'});
	}	

	loginUser(body): Observable<any> {
		return this.http.post(`${BASEURL}/login`, body);
	}
}
