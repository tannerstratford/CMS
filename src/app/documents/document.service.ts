import { EventEmitter, Injectable } from '@angular/core';
import { max, Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  maxDocumentId: number;
  documentChangedEvent = new EventEmitter<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];

  constructor(private http: HttpClient) {
    //this.documents = MOCKDOCUMENTS;
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
    this.http.get<Document[]>('https://cms-database-58997-default-rtdb.firebaseio.com/documents.json')
      .subscribe(
        // success method
        (documents: Document[]) => {
          this.documents = documents
          this.maxDocumentId = this.getMaxId()
          documents.sort((currentElement, nextElement) => {
            if (currentElement < nextElement) { return -1 }
            if (currentElement > nextElement) { return 1 }
            else { return 0 }
          })
          this.documentListChangedEvent.next(this.documents.slice());
        },
        // error method
        (error: any) => {
          console.log(error);
        })

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
    //this.documentChangedEvent.emit(this.documents.slice());
    this.storeDocuments();
  }


  getMaxId(): number {

    let maxId = 0;

    for (let document of this.documents) {
      let currentId = +document.id
      if (currentId > maxId) {
        maxId = currentId
      }
    }
    return maxId
  }

  addDocument(newDocument: Document) {
    if (newDocument === undefined || newDocument === null) {
      return
    }

    this.maxDocumentId++
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    let documentsListClone = this.documents.slice();
    //this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
  }


  updateDocument(originalDocument: Document, newDocument: Document) {
    if (originalDocument === undefined || originalDocument === null || newDocument === undefined || newDocument === null) {
      return
    }

    let pos = this.documents.indexOf(originalDocument)
    if (pos < 0) {
      return
    }

    newDocument.id = originalDocument.id
    this.documents[pos] = newDocument
    let documentsListClone = this.documents.slice()
    //this.documentListChangedEvent.next(documentsListClone)
    this.storeDocuments();
  }

  storeDocuments() {
    let jsonDocuments = JSON.stringify(this.documents);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put('https://cms-database-58997-default-rtdb.firebaseio.com/documents.json', jsonDocuments, {headers})
    .subscribe(
      () => {
        this.documentListChangedEvent.next(this.documents.slice());
      })
  }
}
