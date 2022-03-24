import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';
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

  constructor(private messageService: MessageService,
    private contactService: ContactService) { }
    sender = "623a8ed19586c44d7f2af3fc"

  ngOnInit(): void {
    
  }

  onSendMessage(){
    const ingSubject = this.subjectInputRef.nativeElement.value;
    const ingMessage = this.messageInputRef.nativeElement.value;
    const newMessage = new Message('', ingSubject, ingMessage, this.sender, "");
    this.messageService.addMessage(newMessage);
    this.onClear();
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = "";
    this.messageInputRef.nativeElement.value = "";
  }

}
