import { Injectable } from '@angular/core';


// Define the DataService locally. It is provided globally via providedIn: 'root'.
interface Post {
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService { 

}