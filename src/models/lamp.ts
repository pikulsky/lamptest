export class Lamp {

  private normalizedBrand: string;
  private normalizedModel: string;

  public brand: string;
  public model: string;
  public upc: string;
  public baseType: string;
  public class: string;
  public type: string;
  public subtype: string;
  public matte: string;
  public P: string;
  public lm: string;
  public ekv: string;
  public color: string;
  public age: string;
  public effectiveness: string;
  public cri: string;
  public switchIndicatorSupport: string;
  public dimmerSupport: string;
  public diameter: string;
  public height: number;
  public voltage: number;
  public priceRur: number;
  public priceUsd: number;
  public testDate: string;
  public relevant: string;
  public rating: string;

  public measured: any = {};
  public measuredBetter: any = {};

  public externalPageLink: string;
  public lampPhoto: string;
  public lampGraph: string;

  constructor() {}

  init(options: any) {
    if (!options.brand || !options.model) {
      return false;
    }

    this.brand = options.brand;
    this.model = options.model;
    this.upc = options.upc;

    this.normalizedBrand = options.brand.toLowerCase().replace(/[\s\/]+/g, '-').replace(/=/g, '-').replace(/[^A-Za-zА-Яа-я0-9\-\_]/g, '');
    this.normalizedBrand = this.transliterate(this.normalizedBrand);

    this.normalizedModel = options.model.toLowerCase().replace(/[\s\/]+/g, '-').replace(/=/g, '-').replace(/[^A-Za-zА-Яа-я0-9\-\_]/g, '');
    this.normalizedModel = this.transliterate(this.normalizedModel);

    this.externalPageLink = 'http://lamptest.ru/review/' + this.normalizedBrand + '-' + this.normalizedModel;
    this.lampPhoto = 'http://lamptest.ru/images/photo/' + this.normalizedBrand + '-' + this.normalizedModel + '.jpg';
    this.lampGraph = 'http://lamptest.ru/images/graph/' + this.normalizedBrand + '-' + this.normalizedModel + '.png';

    this.baseType = options.base_type;
    this.class = options.class;
    this.type = options.type;
    this.subtype = options.subtype ? options.subtype : 'Н/Д';
    this.matte = options.matte;
    this.cri = options.cri ? options.cri : 'Н/Д';
    this.age = options.age;
    this.priceRur = options.price_rur ? options.price_rur : null;
    this.priceUsd = options.price_usd ? options.price_usd : null;
    this.matte = options.matte ? 'матовая' : 'нет';
    this.effectiveness = (options.measured.lm / options.measured.P).toFixed(1);
    this.relevant = options.relevant && options.relevant == 1 ? 'есть в продаже' : 'не продается';
    this.dimmerSupport = options.dimmer_support ? 'поддерживается' : 'нет';
    this.diameter = options.diameter;
    this.height = options.height;
    this.voltage = options.voltage;
    this.testDate = options.test_date;
    this.rating = options.rating;

    this.switchIndicatorSupport = 'Н/Д';
    switch (parseInt(options.switch_indicator_support)) {
      case 0:
        this.switchIndicatorSupport = 'нет';
        break;
      case 1:
        this.switchIndicatorSupport = 'поддерживается';
        break;
      case 2:
        this.switchIndicatorSupport = 'слабо светится';
        break;
      case 3:
        this.switchIndicatorSupport = 'вспыхвает';
        break;
    }

    this.measured = options.measured;

    let measuredParams = ['P', 'lm', 'ekv', 'color'];
    let totalMeasuredParams = measuredParams.length;
    for (let i = 0; i < totalMeasuredParams; i++) {
      let key = measuredParams[i];
      this.measuredBetter[key] = false;
      if (options.measured[key] && options[key] && options.measured[key] >= options[key]) {
        this.measuredBetter[key] = true;
      }
    }

    return true;
  }

  private transliterate(str: string) {
    let cyr2latChars: any[] = [
      ['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'],
      ['д', 'd'],  ['е', 'ye'], ['ё', 'yo'], ['ж', 'zh'], ['з', 'z'],
      ['и', 'i'], ['й', 'y'], ['к', 'k'], ['л', 'l'],
      ['м', 'm'],  ['н', 'n'], ['о', 'o'], ['п', 'p'],  ['р', 'r'],
      ['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'],
      ['х', 'h'],  ['ц', 'c'], ['ч', 'ch'],['ш', 'sh'], ['щ', 'shch'],
      ['ъ', ''],  ['ы', 'y'], ['ь', ''],  ['э', 'e'], ['ю', 'yu'], ['я', 'ya'],

      ['А', 'A'], ['Б', 'B'],  ['В', 'V'], ['Г', 'G'],
      ['Д', 'D'], ['Е', 'E'], ['Ё', 'YO'],  ['Ж', 'ZH'], ['З', 'Z'],
      ['И', 'I'], ['Й', 'Y'],  ['К', 'K'], ['Л', 'L'],
      ['М', 'M'], ['Н', 'N'], ['О', 'O'],  ['П', 'P'],  ['Р', 'R'],
      ['С', 'S'], ['Т', 'T'],  ['У', 'U'], ['Ф', 'F'],
      ['Х', 'H'], ['Ц', 'C'], ['Ч', 'CH'], ['Ш', 'SH'], ['Щ', 'SHCH'],
      ['Ъ', ''],  ['Ы', 'Y'],
      ['Ь', ''],
      ['Э', 'E'],
      ['Ю', 'YU'],
      ['Я', 'YA']
    ];

    let newStr: string = '';

    for (let i = 0; i < str.length; i++) {
      let ch: string = str.charAt(i);
      let newCh = ch;

      for (let j = 0; j < cyr2latChars.length; j++) {
        if (ch === cyr2latChars[j][0]) {
          newCh = cyr2latChars[j][1];
        }
      }

      newStr += newCh;
    }

    return newStr;
  }
}
