import { Injectable } from '@angular/core';

declare var data: any;

@Injectable()
export class LampData {

  private list: any[] = [];
  private data: any = {};

  constructor() {
    if (data) {
      for (let upc in data) {
        if (data.hasOwnProperty(upc)) {
          this.data[upc] = data[upc];

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

  getList() {
    return this.list;
  }

  getLamp(upc: string) {
    if (!this.data[upc]) {
      return false;
    }

    return this.data[upc];
  }

}
