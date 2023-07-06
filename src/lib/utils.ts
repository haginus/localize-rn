import { Translations } from "./types";

export function accessTanslations(o: Translations, s: string): Translations {
  if(!s) return o;
  s = s.replace(/\[(\w+)\]/g, '.$1');
  s = s.replace(/^\./, '');
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      // @ts-ignore
      o = o[k];
    } else {
      // @ts-ignore
      return;
    }
  }
  return o;
}