import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import liff from '@line/liff/dist/lib';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  orderId :string ;
  messages: string;
  userProfile: any;
  userId: any;
  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private router: Router,
  ){
  
  }

  

  async ngOnInit() {

    try {
      await this.appService.initLineLiffOfferPrice();
      this.userProfile = await liff.getProfile();
      this.userId = this.userProfile.userId;
     
    } catch (err) {
    //  alert(err)
    }
      


      this.route.queryParams.subscribe(params => {
        if(params){
          let orderId = params['orderId'];

         this.router.navigate(['/line/offer',  orderId, this.userProfile.userId]);
  
        }

      });
   
        
    }

}
