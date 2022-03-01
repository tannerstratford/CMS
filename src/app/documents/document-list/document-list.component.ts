import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents:Document[] = [
    new Document('1', 'First Document', 'This is the first sample document', 'https://mydocumentexampleurl.com/mydocument1', null),
    new Document('2', 'Second Document', 'This is the second sample document', 'https://mydocumentexampleurl.com/mydocument2', null),
    new Document('3', 'Third Document', 'This is the third sample document', 'https://mydocumentexampleurl.com/mydocument3', null),
    new Document('4', 'Fourth Document', 'This is the fourth sample document', 'https://mydocumentexampleurl.com/mydocument4', null),
    new Document('5', 'Fifth Document', 'This is the fifth sample document', 'https://mydocumentexampleurl.com/mydocument5', null)
    
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
