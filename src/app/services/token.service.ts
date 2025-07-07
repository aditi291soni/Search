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
    getAuthToken() {
      return localStorage.getItem('authToken');
    }
  
    getRefreshToken() {
      return localStorage.getItem('refreshToken');
    }
  
    setAuthToken(token: string) {
      localStorage.setItem('authToken', token);
    }
  
    setRefreshToken(token: string) {
      localStorage.setItem('refreshToken', token);
    }
  
    clearTokens() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  }