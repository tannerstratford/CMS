import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  maxContactId: number;
  foundContact: Contact;

  contactChangedEvent = new EventEmitter<Contact[]>();
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();

  contacts: Contact[] = [];
  constructor(private http: HttpClient) {
  }

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
  }


  getContacts(): Contact[] {
    console.log("Contact service get contacts called")
    this.http.get<Contact[]>('http://localhost:3000/contacts')
      .subscribe(
        // success method
        (contacts: Contact[]) => {
          console.log("called")
          this.contacts = contacts["contacts"];
          //this.maxcontactId = this.getMaxId()
          this.sortAndSend();
        },
        // error method
        (error: any) => {
          console.log(error);
        })
        console.log("contacts slice " + this.contacts.slice())
        
        return this.contacts.slice();
  }

  sortAndSend() {
    console.log(this.contacts);
    //this.contacts.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0);
    this.contactListChangedEvent.next(this.contacts.slice());
  }

 deleteContact(contact: Contact) {

  if (!contact) {
    return;
  }

  const pos = this.contacts.findIndex(d => d.id === contact.id);

  if (pos < 0) {
    return;
  }

  // delete from database
  this.http.delete('http://localhost:3000/contacts/' + contact.id)
    .subscribe(
      (response: Response) => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      }
    );
}

addContact(contact: Contact) {
  if (!contact) {
    return;
  }

  // make sure id of the new contact is empty
  contact.id = '';

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // add to database
  this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
    contact,
    { headers: headers })
    .subscribe(
      (responseData) => {
        // add new contact to contacts
        this.contacts.push(responseData.contact);
        this.sortAndSend();
      }
    );
}

updateContact(originalContact: Contact, newContact: Contact) {
  if (!originalContact || !newContact) {
    return;
  }

  const pos = this.contacts.findIndex(d => d.id === originalContact.id);

  if (pos < 0) {
    return;
  }

  // set the id of the new contact to the id of the old contact
  newContact.id = originalContact.id;
  //newcontact._id = originalcontact._id;

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // update database
  this.http.put('http://localhost:3000/contacts/' + originalContact.id,
    newContact, { headers: headers })
    .subscribe(
      (response: Response) => {
        this.contacts[pos] = newContact;
        this.sortAndSend();
      }
    );
}
}