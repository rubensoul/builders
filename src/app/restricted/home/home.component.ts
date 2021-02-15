import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../../_models';
import { UserService } from '../../_services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
    loading = false;
    users: User[];
    dataGeolocation: any = "";

    constructor() { }

    ngOnInit() {
        this.getLocation();
    }


    getLocation(): void{
        if (navigator.geolocation) {
            this.loading = true
            navigator.geolocation.getCurrentPosition((position)=>{
              this.dataGeolocation = { "longitude": position.coords.longitude, "latitude": position.coords.latitude }
              this.loading = false;
            });
        } else {
           console.log("No support for geolocation")
        }
      }
      
}