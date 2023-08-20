import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { users } from '../users/users.module';

@Injectable({
  providedIn: 'root'
})
export class GetusersService {

  constructor(private http:HttpClient) { }
  getallusers():Observable<users[]>
  {
     return this.http.get<users[]>('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
  }
}
