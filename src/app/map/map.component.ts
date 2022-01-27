import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { LocationIQProvider } from 'leaflet-geosearch';
import { GeoSearchControl } from 'leaflet-geosearch';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements AfterViewInit {

  private map: L.Map | L.LayerGroup<any> | undefined;

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 29.651634, -82.324829 ],
      zoom: 12,
      scrollWheelZoom: true,
      zoomControl: false,
      attributionControl: false,
    });

    const myProvider = new LocationIQProvider({
      params: {
        'accept-language': 'en', // render results in English
        key: 'pk.f9ebfe3b0c08c548a67c904a161c73ad',
        countrycodes: 'us,ca', // limit search results to United States and Canada
      },
    });

    L.tileLayer('https://{s}-tiles.locationiq.com/v2/obk/r/{z}/{x}/{y}.png?key=pk.f9ebfe3b0c08c548a67c904a161c73ad').addTo(this.map);
    const search = GeoSearchControl({
      provider: myProvider,
      autoComplete: true,
      searchLabel: 'Enter Location',
      showMarker: false
    });
    this.map.addControl(search);
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
