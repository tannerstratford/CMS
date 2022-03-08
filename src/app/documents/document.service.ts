import { EventEmitter, Injectable } from '@angular/core';
import { max, Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  maxDocumentId: number;
  documentChangedEvent = new EventEmitter<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[];

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
   }

   getDocument(id: string): Document {
    for (let document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  deleteDocument(document: Document) {
    if (!document) {
       return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
       return;
    }
    this.documents.splice(pos, 1);
    this.documentChangedEvent.emit(this.documents.slice());
 }

 
getMaxId(): number {

  let maxId = 0;

  for(let document of this.documents){
    let currentId = +document.id
    if(currentId > maxId){
      maxId = currentId
    }
  }
  return maxId
}

addDocument(newDocument: Document) {
  if (newDocument === undefined || newDocument === null){
    return
  }
  
  this.maxDocumentId++
  newDocument.id = this.maxDocumentId.toString();
  this.documents.push(newDocument);
  let documentsListClone = this.documents.slice();
  this.documentListChangedEvent.next(documentsListClone);
}


updateDocument(originalDocument: Document, newDocument: Document) {
  if (originalDocument ===  undefined || originalDocument === null || newDocument === undefined || newDocument === null){
    return
  }

  let pos = this.documents.indexOf(originalDocument)
  if (pos < 0){
    return
  }

  newDocument.id = originalDocument.id
  this.documents[pos] = newDocument
  let documentsListClone = this.documents.slice()
  this.documentListChangedEvent.next(documentsListClone)
}
}
