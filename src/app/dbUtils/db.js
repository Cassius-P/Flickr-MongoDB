import * as queryString from "querystring";

const mongoose = require('mongoose');

export class Db{

  constructor(kw) {
    mongoose.connect('mongodb://localhost/search', {useNewUrlParser: true, useUnifiedTopology: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      const searchSchema = new mongoose.Schema({
        keyword: String,
        images: Array
      });

      this.Search = mongoose.model('Search', searchSchema);
    });
  }

  findByKeyword(kw){
    this.Search.find({keyword: kw}, (err, search) => {
      if (err) {
        return null
      }else{
        return search
      }
    })
  }

  addKeyword(kw, images){
    const search = new this.Search({keyword: kw, images: images})
    search.save(function (err, fluffy) {
      if (err) {
        return false
      }else{
        return true
      }
    });
  }

  addImages(kw, images){
    this.Search.find({keyword: kw}, (err, search) => {
      if (err) {
        return null
      }else{
        search.images.put(images)
      }
    })
  }
}
module.exports(Db);
