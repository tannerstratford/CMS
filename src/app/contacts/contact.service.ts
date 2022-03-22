import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  maxContactId: number;

  contactChangedEvent = new EventEmitter<Contact[]>();
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();

  contacts: Contact[] = [];
  constructor(private http: HttpClient) {
    this.contacts = MOCKCONTACTS;
  }

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
  }

  getMaxId(): number {

    let maxId = 0;

    for (let contact of this.contacts) {
      let currentId = +contact.id
      if (currentId > maxId) {
        maxId = currentId
      }
    }
    return maxId
  }

  getContacts(): Contact[] {
    this.http.get<Contact[]>('https://cms-database-58997-default-rtdb.firebaseio.com/contacts.json')
      .subscribe(
        // success method
        (contacts: Contact[]) => {
          this.contacts = contacts
          //this.maxContactId = this.getMaxId()
          contacts.sort((currentElement, nextElement) => {
            if (currentElement < nextElement) { return -1 }
            if (currentElement > nextElement) { return 1 }
            else { return 0 }
          })
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        // error method
        (error: any) => {
          console.log(error);
        })

    return this.contacts.slice();
  }

  deleteContact(contact: Contact) {
    if (!contact) {
       return;
    }
    let pos = this.contacts.indexOf(contact);
    if (pos < 0) {
       return;
    }
    this.contacts.splice(pos, 1);
    this.storeContacts();
 }

 addContact(newContact: Contact) {
  if (newContact === undefined || newContact === null){
    return
  }
  
  this.maxContactId++
  newContact.id = this.maxContactId.toString();
  this.contacts.push(newContact);
  let contactsListClone = this.contacts.slice();
  //this.contactListChangedEvent.next(contactsListClone);
  this.storeContacts();
}


updateContact(originalContact: Contact, newContact: Contact) {
  if (originalContact ===  undefined || originalContact === null || newContact === undefined || newContact === null){
    return
  }

  let pos = this.contacts.indexOf(originalContact)
  if (pos < 0){
    return
  }

  newContact.id = originalContact.id
  this.contacts[pos] = newContact
  //let contactsListClone = this.contacts.slice()
  //this.contactListChangedEvent.next(contactsListClone)
  this.storeContacts();
}

storeContacts() {
  let jsonContacts = JSON.stringify(this.contacts);
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  this.http.put('https://cms-database-58997-default-rtdb.firebaseio.com/contacts.json', jsonContacts, {headers})
  .subscribe(
    () => {
      this.contactListChangedEvent.next(this.contacts.slice());
    })
}
}