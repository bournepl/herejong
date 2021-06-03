import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';


@Injectable({providedIn: 'root'})
export class SeoService {
   
  constructor(private meta: Meta) { }

  generateTags(title,description,image,url) {

    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:url', content: url });
  }

}