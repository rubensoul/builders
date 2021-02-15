import { Component, OnInit } from '@angular/core';
import { of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { GeolocationService } from '../../_services/geolocation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {

  endereco: string = '';
  geoData: any;
  private searchTerms: Subject<string> = new Subject<string>();
  loading: boolean = false;
  dataGeolocation: any = "";


  constructor(private geolocationService: GeolocationService) {
   }

  ngOnInit(): void {
    this.searchLocation();  
    this.getPositionUser();
  }

  getPositionUser(){
    if (navigator.geolocation) {
      setTimeout(() => {
        navigator.geolocation.watchPosition((position) => {
        this.dataGeolocation = { "longitude": position.coords.longitude, "latitude": position.coords.latitude }
        this.getLocation();
      });
    }, 100);

    } else {
     console.log("No support for geolocation");
    }

  }

  getLocation(){
    if (this.dataGeolocation) {
        this.loading = true;
        this.geolocationService.getLocation(this.dataGeolocation).subscribe(res => {
          this.geoData = res;
          if (this.geoData.main.temp) {
            this.toCelsius(this.geoData.main.temp)
          }
          this.endereco = this.geoData.name;
          this.loading = false;
        })
      }

  }

  toCelsius(temp){
    //let hTemp = (temp - 32.0 ) * ( 5.0 / 9.0) // fahrenheit to celsius
    let ktemp = temp -273.15 // kelvin to celsius
    this.geoData.main.temp = Math.round(ktemp)
  }

  getLocationByCity(){
    this.geolocationService.getLocationCity(this.endereco).subscribe(res => (this.geoData = res))
  }

  searchLocation(){
    this.searchTerms.pipe(
      debounceTime(1000), 
      distinctUntilChanged(),
      switchMap(
        term => 
          term 
            ? 
            this.geolocationService.getLocationCity(term)
            : 
            of<any>([])
      ),
      catchError(error => {
        // TODO: real error handling
        return of<any>([]);
      })
    ).subscribe(res => { 
      this.geoData = res;
      if (this.geoData.main) {
        this.toCelsius(this.geoData.main.temp)
      }
    });
  }

  search(term){
    if (term.target.value && term.target.value.trim() !== '') {
      this.searchTerms.next(term.target.value);
    } else {
      this.searchTerms.next('');
    }
  }
   
      
}