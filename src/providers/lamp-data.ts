import { Injectable } from '@angular/core';
import {Lamp} from "../models/lamp";

declare var data: any;

@Injectable()
export class LampData {

  private list: any[] = [];
  private data: any = {};

  constructor() {
    if (data) {
      for (let upc in data) {
        if (data.hasOwnProperty(upc)) {

          let lamp = new Lamp();
          if (lamp.init(data[upc])) {
            this.data[upc] = lamp;
          }

          let title = data[upc].brand + ' ' + data[upc].model;
          if (title) {
            this.list.push({
              title: title,
              upc: upc,
              normalizedTitle: title.toLowerCase()
            });
          }
        }
      }
    }
  }

  getList(keyword: any) {
    if (typeof keyword === 'string' && keyword.length) {
      let normalizedKeyword = keyword.toLowerCase();
      return this.list.filter((listEntry) => {
        if (listEntry.normalizedTitle.indexOf(normalizedKeyword) === 0) {
          return true;
        }
        return false;
      });
    }

    return this.list;
  }

  getLamp(upc: string) {
    if (!this.data[upc]) {
      return false;
    }

    return this.data[upc];
  }

  isLampAvailable(upc: string) {
    if (!this.data[upc]) {
      return false;
    }

    return true;
  }

}
