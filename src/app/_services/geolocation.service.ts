import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })

export class GeolocationService {

    constructor(private http: HttpClient) { }

    getLocation(data) {
        return this.http.get<any[]>(`${environment.openweathermap}weather?lat=${data.latitude}&lon=${data.longitude}&appid=${environment.apiKeyOpenWeathermap}`);
    }

    getLocationCity(city) {
        return this.http.get<any[]>(`${environment.openweathermap}weather?q=${city}&appid=${environment.apiKeyOpenWeathermap}`);
    }
}