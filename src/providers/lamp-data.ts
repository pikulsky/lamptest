import { Injectable } from '@angular/core';
import { Lamp } from '../models/lamp';

import http from 'http';
import process from 'process';
import url from 'url';


//let http = require('http');

declare let data: any;

@Injectable()
export class LampData {

  private list: any[] = [];
  private data: any = {};

  constructor() {
    let show = true;
    let lampShow = null;
    if (data) {
      for (let upc in data) {
        if (data.hasOwnProperty(upc)) {

          if (!this.data[upc]) {
            this.data[upc] = [];
          }

          for (let i = 0; i < data[upc].length; i++) {
            let lampData = data[upc][i];
            let lamp = new Lamp();
            if (lamp.init(lampData)) {
              this.data[upc].push(lamp);

              if (lampShow === null) {
                lampShow = lamp;
              }

            }
            
            let title = lampData.brand + ' ' + lampData.model;
            if (title) {
              this.list.push({
                title: title,
                upc: upc,
                offset: i,
                normalizedTitle: title.toLowerCase()
              });
            }
            
          }
          
          
          if (show) {
            console.log(lampShow.externalPageLink);
            show = false;
            this.checkURL(lampShow.externalPageLink);
            //this.checkURL(lamp.lampPhoto);
            //this.checkURL(lamp.lampGraph);
            //this.checkURL(lamp.lampCRIGraph);
          }





        }
      }
    }
  }

  checkURL(fullurl) {
    var req = new XMLHttpRequest();
    req.open('HEAD', fullurl);
    req.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
            //callback(this.status !== 200);
            console.log('Failed ' + this.status + ' ' + fullurl);
        }
    };
    req.send();
  }



  checkURL2(fullurl) {

    const parts = url.parse(fullurl, true);
    const options = {
      method: 'HEAD',
      host: parts.host,
      path: parts.pathname
    }
    http.get(options, function(response) {
      response.on('data', function (chunk) {
        // discard data if any
      });
      response.on('end', function () {
        //this.checkStatusCode(url, response.statusCode);
        if (response.statusCode !== 200) {
          console.log('Failed ' + response.statusCode + ' ' + url);
          process.exit();
        }
      });
    });
  }

  getList(keyword: any) {
    if (typeof keyword === 'string' && keyword.length) {
      let normalizedKeyword = keyword.toLowerCase();
      return this.list.filter((listEntry) => {
        if (listEntry.normalizedTitle.indexOf(normalizedKeyword) !== -1) {
          return true;
        }
        return false;
      });
    }

    return this.list;
  }

  getLampsByUpc(upc: string) {
    if (!this.data[upc]) {
      return false;
    }

    return this.data[upc];
  }

  areLampsAvailableByUpc(upc: string) {
    if (!this.data[upc]) {
      return false;
    }

    return true;
  }

  getLamp(upc: string, offset: number) {
    if (!this.data[upc]) {
      return false;
    }
    if (!this.data[upc][offset]) {
      return false;
    }

    return this.data[upc][offset];
  }

  isLampAvailable(upc: string, offset: number) {
    if (!this.data[upc]) {
      return false;
    }
    if (!this.data[upc][offset]) {
      return false;
    }

    return true;
  }

}
