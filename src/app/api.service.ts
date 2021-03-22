import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';

import {throwError} from "rxjs";
import {catchError, retry, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public first: string = "";
  public next: string = "";
  public last: string = "";
  public prev: string = "";

  parseLinkHeader(header: any) {
    if (header.length == 0) {
      return;
    }

    let parts = header.split(',');
    var links: any = [];
    parts.forEach((p: string) => {
      let section = p.split(';');
      var url = section[0].replace(/<(.*)>/, '$1').trim();
      var name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;

    });

    this.first = links["first"];
    this.last = links["last"];
    this.prev = links["prev"];
    this.next = links["next"];
  }

  private SERVER_URL = "http://localhost:3000/products";

  constructor(private httpClient: HttpClient) {//lookup
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = "Unknown error";

    if (error.error instanceof ErrorEvent) {
      errorMessage = 'Error ${error.error.message}';
    } else {
      errorMessage = 'Error: ${error.status}\nMessage: ${error.message}';
    }

    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public sendGetRequestToUrl(url: string){
    return this.httpClient.get(url, {observe: "response"}).pipe(retry(3),
    catchError(this.handleError), tap(res => {
      console.log(res.headers.get('link'));
      this.parseLinkHeader(res.headers.get('Link'));
    })
    )
  }

  public sendGetRequest() {
    return this.httpClient.get(this.SERVER_URL, {params: new HttpParams({fromString: "_page=1&_limit=5"}), observe: "response"}).pipe(retry(3), catchError(this.handleError), tap(res =>{
      console.log(res.headers.get('Link'));
      this.parseLinkHeader(res.headers.get('Link'));
    }));
  }
}
