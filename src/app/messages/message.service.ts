import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  messages: Message[];

  constructor() {
    this.messages = MOCKMESSAGES;
   }

   getMessage(id: string): Message {
    for (let message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
  }

  getMessages(): Message[] {
    console.log(this.messages);
    return this.messages.slice();
  }

  addMessage(message: Message) {
    message.id = (this.messages.length + 1).toString();
    this.messages.push(message);
    this.messageChangedEvent.emit(this.messages.slice());
  }
}
