import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AiChatService, ChatRequest, ChatResponse } from './ai-chat.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss']
})
export class AiChatComponent implements OnInit {
  chatForm: FormGroup;
  messages: ChatMessage[] = [];
  isLoading = false;
  challengeCompleted = false;
  currentScore = 0;
  userId = 'demo-user-123'; // 实际应从 Juice Shop 认证服务获取

  constructor(
    private fb: FormBuilder,
    private aiChatService: AiChatService
  ) {
    this.chatForm = this.fb.group({
      prompt: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadChallengeStatus();
    this.addMessage('assistant', '你好！我是 Juice Shop 智能客服助手。我可以帮你查询订单、推荐饮品或者解释我们的安全策略。请问有什么可以帮你的？');
  }

  loadChallengeStatus(): void {
    this.aiChatService.getChallengeStatus(this.userId).subscribe({
      next: (res) => {
        this.challengeCompleted = res.isCompleted;
      }
    });
  }

  sendMessage(): void {
    if (this.chatForm.invalid || this.isLoading) return;

    const prompt = this.chatForm.value.prompt.trim();
    this.addMessage('user', prompt);
    this.chatForm.reset();
    this.isLoading = true;

    const request: ChatRequest = {
      userId: this.userId,
      prompt
    };

    this.aiChatService.sendMessage(request).subscribe({
      next: (res: ChatResponse) => {
        this.addMessage('assistant', res.response);
        
        if (res.flagLeaked) {
          this.challengeCompleted = res.challengeCompleted;
          if (res.scoreAwarded) {
            this.currentScore = res.newScore || 0;
          }
        }
        
        this.isLoading = false;
      },
      error: () => {
        this.addMessage('assistant', '抱歉，服务暂时不可用，请稍后再试。');
        this.isLoading = false;
      }
    });
  }

  addMessage(role: 'user' | 'assistant', content: string): void {
    this.messages.push({
      role,
      content,
      timestamp: new Date()
    });
  }

  clearChat(): void {
    this.messages = [];
    this.addMessage('assistant', '你好！我是 Juice Shop 智能客服助手。请问有什么可以帮你的？');
  }
}