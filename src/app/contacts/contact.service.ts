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
  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  deleteContact(contact: Contact) {
    if (!contact) {
       return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
       return;
    }
    this.contacts.splice(pos, 1);
    this.contactChangedEvent.emit(this.contacts.slice());
 }

 addcontact(newContact: Contact) {
  if (newContact === undefined || newContact === null){
    return
  }
  
  this.maxContactId++
  newContact.id = this.maxContactId.toString();
  this.contacts.push(newContact);
  let contactsListClone = this.contacts.slice();
  this.contactListChangedEvent.next(contactsListClone);
}


updatecontact(originalContact: Contact, newContact: Contact) {
  if (originalContact ===  undefined || originalContact === null || newContact === undefined || newContact === null){
    return
  }

  let pos = this.contacts.indexOf(originalContact)
  if (pos < 0){
    return
  }

  newContact.id = originalContact.id
  this.contacts[pos] = newContact
  let contactsListClone = this.contacts.slice()
  this.contactListChangedEvent.next(contactsListClone)
}
}