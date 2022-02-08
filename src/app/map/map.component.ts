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

    const search = GeoSearchControl({
      provider: myProvider,
      autoComplete: true,
      searchLabel: 'Enter Location',
      showMarker: false,
      style: 'bar'
    });

    try {
      this.map.addControl(search);
    } catch (error) {
      debugger
      console.log('Error in Map, while adding search box', error);
    }
  }
  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
    let element = Array.from(document.getElementsByClassName('glass') as HTMLCollectionOf<HTMLElement>)[0];
    if(element.style != null){
      element.style.width='60vw';
      element.style.height='1.5vw';
      element.style.borderRadius='10px';
      element.style.borderWidth='revert';
      element.style.borderColor='lightblue';
    }

    let element1 = Array.from(document.getElementsByClassName('leaflet-top leaflet-left') as HTMLCollectionOf<HTMLElement>)[0];
    if(element1.style != null){
      element1.style.visibility='HIDDEN';
    }

    let element2 = Array.from(document.getElementsByClassName('reset') as HTMLCollectionOf<HTMLElement>)[0];
    if(element2.style != null){
      element2.style.visibility='HIDDEN';
    }

  }

}
