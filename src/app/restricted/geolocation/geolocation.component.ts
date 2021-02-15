import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { GeolocationService } from '../../_services/geolocation.service';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit, OnChanges {

  @Input() geolocation;
  endereco: string = '';
  geoData: any;
  private searchTerms: Subject<string> = new Subject<string>();
  loading: boolean = false;
  

  constructor(private geolocationService: GeolocationService) { }

  ngOnInit(): void {
    this.searchLocation();  
  }

  ngOnChanges(){
    this.getLocation(this.geolocation)
  }

  getLocation(geolocation){
      this.loading = true;
      this.geolocationService.getLocation(geolocation).subscribe(res => {
        this.geoData = res;
        if (this.geoData.main.temp) {
          this.toCelsius(this.geoData.main.temp)
        }
        this.endereco = this.geoData.name;
        this.loading = false;
      })
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
