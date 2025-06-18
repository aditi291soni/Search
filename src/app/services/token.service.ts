import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {



    private isRefreshing = false;
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  
    constructor(private http: HttpClient) {}
  
    getToken() {
      return localStorage.getItem('authToken');
    }
  
    setToken(token: string) {
      console.log("Set",token)
      const refreshToken :any = localStorage.getItem('authToken');
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', token);
      this.refreshTokenSubject.next(token);
    }
  
    getRefreshTokenSubject() {
      return this.refreshTokenSubject.asObservable();
    }
  
    isRefreshingToken() {
      return this.isRefreshing;
    }
  
    setRefreshing(value: boolean) {
      this.isRefreshing = value;
    }
  }
  
