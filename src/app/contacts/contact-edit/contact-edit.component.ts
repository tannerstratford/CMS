import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
   contact: Contact;
   groupContacts: Contact[] = [];
   editMode: boolean = false;
   id: string;
   
   constructor(
        private contactService: ContactService,
        private router: Router,
        private route: ActivatedRoute) {
        }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id']
        if (this.id === undefined || this.id === null) {
          this.editMode = false
          return
        }
        this.originalContact = this.contactService.getContact(this.id)

        if (this.originalContact === undefined || this.originalContact === null) {
          return
        }
        this.editMode = true
        this.contact = JSON.parse(JSON.stringify(this.originalContact));

        if(this.contact.group !== null && this.contact.group !== undefined){
          this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group));
        }
      })
  }

  onCancel() {
    this.router.navigate(['/contacts'])
  }

  onSubmit(form: NgForm) {
    let value = form.value // get values from form’s fields
    let newContact = new Contact(value.id, value.name, value.email, value.phone, value.url, this.groupContacts);

    if (this.editMode == true) {
      this.contactService.updateContact(this.originalContact, newContact)
    } else {
      this.contactService.addContact(newContact)
    }
    this.router.navigate(['/contacts'])
  }

  
isInvalidContact(newContact: Contact) {
  if (!newContact) {// newContact has no value
    console.log("Not new contact")
    return true;
  }
  if (this.contact && newContact.id === this.contact.id) {
     return true;
  }
  for (let i = 0; i < this.groupContacts.length; i++){
     if (newContact.id === this.groupContacts[i].id) {
       return true;
    }
  }
  return false;
}


addToGroup($event: any) {
  const selectedContact: Contact = $event.dragData;
  const invalidGroupContact = this.isInvalidContact(selectedContact);
  if (invalidGroupContact){
    console.log("invalid group contact")
     return;
  }
  this.groupContacts.push(selectedContact);
}

onRemoveItem(index: number) {
  if (index < 0 || index >= this.groupContacts.length) {
     return;
  }
  this.groupContacts.splice(index, 1);
}

}
