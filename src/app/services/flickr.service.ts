import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {ImageInfosComponent} from "../image-infos/image-infos.component";
import {BehaviorSubject} from "rxjs";
const mongoose = require('mongoose');


export interface FlickrPhoto {
  farm: string;
  id: string;
  secret: string;
  server: string;
  title: string;
  owner: string,
}
export interface FlickrPerson{
  person: object;
}
export interface FlickrOutput {
  photos: {
    photo: FlickrPhoto[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class FlickrService {
  private focusedImageVar = new BehaviorSubject<object>({});
  currentMessage = this.focusedImageVar.asObservable();
  prevKeyword: string;
  currPage = 1;



  constructor(private http: HttpClient) { }

  search_keyword(keyword: string) {
    if (this.prevKeyword === keyword) {
      this.currPage++;
    } else {
      this.currPage = 1;
    }
    this.prevKeyword = keyword;


    const url = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&';
    const params = `api_key=52dc4d35d61c7d440f989e84083af6da&text=${keyword}&format=json&nojsoncallback=1&per_page=12&page=${this.currPage}`;

    return this.http.get(url + params).pipe(map((res: FlickrOutput) => {
      const urlArr = [];

      res.photos.photo.forEach((ph: FlickrPhoto) => {
        const photoObj = {
          url: `https://farm${ph.farm}.staticflickr.com/${ph.server}/${ph.id}_${ph.secret}`,
          title: ph.title,
          id:ph.id,
          owner:ph.owner
        };
        urlArr.push(photoObj);
      });
      this.focusedImage(urlArr[0]);
      return urlArr;
    }));
  }

  focusedImage(image: FlickrPhoto){
    if(image != null){
      let url2 = 'https://www.flickr.com/services/rest/?method=flickr.people.getInfo&';
      let params2 = `api_key=52dc4d35d61c7d440f989e84083af6da&user_id=${image.owner}&format=json&nojsoncallback=1`;

      this.http.get(url2 + params2).subscribe(data => {
        if (data.hasOwnProperty('person')){
          console.log(data);
          const person: FlickrPerson = data;
          image.owner = person.person;
        }
      }, error => {
        console.log(error);
      });
      console.log(image);
      this.focusedImageVar.next(image);
    }
  }
}
