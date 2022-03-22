import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  messages: Message[];
  maxMessageId: number;

  constructor(private http: HttpClient) {
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
    this.http.get<Message[]>('https://cms-database-58997-default-rtdb.firebaseio.com/messages.json')
      .subscribe(
        // success method
        (messages: Message[]) => {
          this.messages = messages
          this.maxMessageId = this.getMaxId()
          messages.sort((currentElement, nextElement) => {
            if (currentElement < nextElement) { return -1 }
            if (currentElement > nextElement) { return 1 }
            else { return 0 }
          })
          this.messageChangedEvent.next(this.messages.slice());
        },
        // error method
        (error: any) => {
          console.log(error);
        })

    return this.messages.slice();
    
  }

  addMessage(message: Message) {
    message.id = (this.messages.length + 1).toString();
    this.messages.push(message);
    //this.messageChangedEvent.emit(this.messages.slice());
    this.storeMessages();
  }

  getMaxId(): number {

    let maxId = 0;

    for (let message of this.messages) {
      let currentId = +message.id
      if (currentId > maxId) {
        maxId = currentId
      }
    }
    return maxId
  }

  storeMessages() {
    let jsonMessages = JSON.stringify(this.messages);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put('https://cms-database-58997-default-rtdb.firebaseio.com/messages.json', jsonMessages, {headers})
    .subscribe(
      () => {
        this.messageChangedEvent.next(this.messages.slice());
      })
  }
}
