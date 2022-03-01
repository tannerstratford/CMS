import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subjectInputRef: ElementRef;
  @ViewChild('msgText') messageInputRef: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSender:string = "";

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onSendMessage(){
    const ingSubject = this.subjectInputRef.nativeElement.value;
    const ingMessage = this.messageInputRef.nativeElement.value;
    const newMessage = new Message('6', ingSubject, ingMessage, this.currentSender);
    this.messageService.addMessage(newMessage);
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = "";
    this.messageInputRef.nativeElement.value = "";
  }

}
