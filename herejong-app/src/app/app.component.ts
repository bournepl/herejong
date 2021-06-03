import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MetaService } from './service/meta.service';
import { SeoService } from './service/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'herejong-app';

  constructor(
    private mateService : MetaService ,
    private titleService: Title, 
    private seo: SeoService,
    private metaService: Meta
  ){
   
  }
  ngOnInit() {

    const url = "www.herejong.com" ;
    const description = "เฮียจอง เช่าเครื่องจักร รถเช่า รถบรรทุก เครน รถขุด รถบด รถแบคโฮ เช็คราคารถเช่า ให้บริการทั่วประเทศ" ;
    const title  = "Here Jong เฮียจอง" ;
    const iamge  = "https://herejong-s3-bucket.s3-ap-southeast-1.amazonaws.com/image/public/logo/S__12886240.jpg" ;

    this.metaService.addTags([
      { name: 'keywords', content: description },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: title },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { charset: 'UTF-8' }
    ]);

   

   
  }


}
