import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  id: string
  contact:Contact;
  originalContact: Contact;
  groupContacts: Contact[] = [];

  
  constructor(private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id']

        this.originalContact = this.contactService.getContact(this.id)

        if (this.originalContact === undefined || this.originalContact === null) {
          return
        }
        
        this.contact = JSON.parse(JSON.stringify(this.originalContact));

        if(this.contact.group !== null && this.contact.group !== undefined){
          this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group));
        }
      })
  }

  onDelete() {
    console.log(this.contact.id)
    this.contactService.deleteContact(this.contact);
    this.router.navigate(['/contacts']);
 }
}
