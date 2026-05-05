import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatRequest {
  userId: string;
  prompt: string;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  detection: any;
  flagLeaked: boolean;
  flag?: string;
  scoreAwarded: boolean;
  newScore?: number;
  challengeCompleted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private apiBase = '/api/ai';

  constructor(private http: HttpClient) { }

  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiBase}/chat`, request);
  }

  getChallengeStatus(userId: string): Observable<any> {
    return this.http.get(`${this.apiBase}/challenge/status/${userId}`);
  }
}