import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { MetaTag } from '../model/MetaTag';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  private urlMeta: string = "og:url";
  private titleMeta: string = "og:title";
  private descriptionMeta: string = "og:description";
  private imageMeta: string = "og:image";
  private twitterTitleMeta: string = "twitter:text:title";
  private twitterImageMeta: string = "twitter:image";

  constructor(private titleService: Title, private metaService: Meta) { }

  public setTitle(title: string): void {
    this.titleService.setTitle(title);
  }

  public setSocialMediaTags(url: string, title: string, description: string, image: string): void {

    var tags = [
      new MetaTag(this.urlMeta, url, true),
      new MetaTag(this.titleMeta, title, true),
      new MetaTag(this.descriptionMeta, description, true),
      new MetaTag(this.imageMeta, image, true),
      new MetaTag(this.twitterTitleMeta, title, false),
      new MetaTag(this.twitterImageMeta, image, false)
    ];
    this.setTags(tags);
  }

  private setTags(tags: MetaTag[]): void {
    tags.forEach(siteTag => {
      if (siteTag.isFacebook) {
        this.metaService.updateTag({ property: siteTag.name, content: siteTag.value  });
      } else {
        this.metaService.updateTag({ name: siteTag.name, content: siteTag.value });
      }
    });
  }
}