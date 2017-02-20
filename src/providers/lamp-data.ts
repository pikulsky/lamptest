import { Injectable } from '@angular/core';
import {Lamp} from "../models/lamp";

declare let data: any;

@Injectable()
export class LampData {

  private list: any[] = [];
  private data: any = {};

  constructor() {
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
