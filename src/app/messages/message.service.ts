import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];
  //maxMessageId: number;

  constructor(private http: HttpClient) {
    //this.messages = MOCKMESSAGES;
   }

   getMessage(id: string): Message {
    for (let message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
  }

  getMessages(): Message[] {
    this.http.get<Message[]>('http://localhost:3000/messages')
      .subscribe(
        // success method
        (messages: Message[]) => {
          this.messages = messages["messages"]
          //this.maxMessageId = this.getMaxId()
          //this.sortAndSend();
          this.messageChangedEvent.next(this.messages.slice())
        },
        // error method
        (error: any) => {
          console.log(error);
        })

        console.log("End" + this.messages);
    return this.messages.slice();
  }

  sortAndSend() {
    this.messages.sort((a, b) => a.id > b.id ? 1 : b.id > a.id ? -1 : 0);
    this.messageChangedEvent.next(this.messages.slice());
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    // make sure id of the new message is empty
    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ Message: string, message: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new message to messages
          
          responseData.message.sender = responseData.message.senderContact;
          console.log("Response data message: " + JSON.stringify(responseData.message))
          this.messages.push(responseData.message);
          console.log(this.messages);
          this.messageChangedEvent.next(this.messages.slice());
        }
      );
  }
}
