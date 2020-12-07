import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GroceriesServiceProvider {

  items: any = [];

  dataChanged$: Observable<boolean>;

  private dataChangeSubject: Subject<boolean>;

  baseURL = "https://warm-springs-89915.herokuapp.com/"

  constructor(public http: HttpClient) {
    console.log('Hello GroceriesServiceProvider Provider');
  
// below here is still being worked out. I'm not sure if I was supposed to get these lines from Github so I'm checking with instructor to see. I got them from the repository unde siddique but it wasn't linked in this week's videos.

  this.dataChangeSubject = new Subject<boolean>();
  this.dataChanged$ = this.dataChangeSubject.asObservable();
}

getItems(): Observable<object[]> {
  return this.http.get(this.baseURL + '/api/groceries').pipe(
    map(this.extractData),
    catchError(this.handleError)
  );
}

private extractData(res: Response){
let body = res;
return body || {};
}

private handleError(error: Response | any){
let errMsg: string;
if (error instanceof Response) {
  const err = error || '';
  errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
} else {
  errMsg = error.message ? error.message : error.toString();
}
console.error(errMsg);
return Observable.throw(errMsg);
}

    removeItem(id){
      console.log("Removing item id: ", id);
      this.http.delete(this.baseURL + "/api/groceries/" + id).subscribe(res => {
        this.items = res;
        this.dataChangeSubject.next(true);
      });  
    }

    addItem(item){
      console.log("Adding grocery item to database...");
      this.http.post(this.baseURL + "/api/groceries", item).subscribe(res => {
        this.items = res;
        this.dataChangeSubject.next(true); 
      });
    }

    editItem(item, id){
      console.log("Editing grocery item: ", item);
      this.http.put(this.baseURL + "/api/groceries/" + id, item).subscribe(res => {
        this.items = res;
        this.dataChangeSubject.next(true); 
      }); 
    }}