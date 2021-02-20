import { Component, OnInit } from '@angular/core';
import { FlickrService } from '../services/flickr.service';
import { ImageInfosComponent } from '../image-infos/image-infos.component';
import * as mongoose from "mongoose";


@Component({
  selector: 'app-search-images',
  templateUrl: './search-images.component.html',
  styleUrls: ['./search-images.component.css']
})
export class SearchImagesComponent implements OnInit {
  images = [];
  keyword: string;
  Search: any;

  constructor(private flickrService: FlickrService) { }

  ngOnInit() {
  }

  search(event: any) {
    mongoose.connect('mongodb://localhost/search', {useNewUrlParser: true, useUnifiedTopology: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      const searchSchema = new mongoose.Schema({
        keyword: String,
        images: Array
      });

      this.Search = mongoose.model('Search', searchSchema);
    });


    this.keyword = event.target.value.toLowerCase();

    if (this.keyword && this.keyword.length > 0) {
      if(this.findByKeyword(this.keyword) == null){
        this.flickrService.search_keyword(this.keyword)
          .toPromise()
          .then(res => {
            this.images = res;
          });
      }else{
        this.images = this.findByKeyword(this.keyword);
      }

    }
  }

  onScroll() {
    if (this.keyword && this.keyword.length > 0) {
      this.flickrService.search_keyword(this.keyword)
      .toPromise()
      .then(res => {
        this.images = this.images.concat(res);
      });
    }
  }
  showInfo(item){
    this.flickrService.focusedImage(item);
  }

  findByKeyword(kw: string): any[]{
    let searchV = null;
    this.Search.find({keyword: kw}, (err, search) => {
      if (err) {
        searchV = null;
      }else{
        searchV = search;
      }
    });
    return searchV;
  }

}
