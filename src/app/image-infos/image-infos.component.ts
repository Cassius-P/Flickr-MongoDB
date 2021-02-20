import {Component, Input, OnInit} from '@angular/core';
import {FlickrService} from '../services/flickr.service';

@Component({
  selector: 'app-image-info',
  templateUrl: './image-infos.component.html',
  styleUrls: ['./image-infos.component.css']
})
export class ImageInfosComponent implements OnInit {
  image: object;
  constructor(private flickerService: FlickrService) { }

  ngOnInit() {
    this.flickerService.currentMessage.subscribe(message => {
      this.image = message;
    });
  }

}
