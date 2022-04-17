import {AfterViewInit, Component} from '@angular/core';
import { LocationIQProvider } from 'leaflet-geosearch';
import {FormControl} from '@angular/forms';
import { RawResult } from 'leaflet-geosearch/dist/providers/openStreetMapProvider';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.css']
})
export class LocationSearchComponent implements AfterViewInit {
  myProvider: LocationIQProvider | undefined;
  filteredOptions: any;
  searchFormControl = new FormControl('');

  constructor() {
  }

  ngAfterViewInit(): void {
    this.myProvider = new LocationIQProvider({
      params: {
        'accept-language': 'en', // render results in English
        key: 'pk.f9ebfe3b0c08c548a67c904a161c73ad',
        countrycodes: 'us,ca', // limit search results to the United States and Canada
      },
    });
    this.searchFormControl.valueChanges.pipe(
        debounceTime(500)
    ).subscribe( searchTerm => {
          this.showOptions(searchTerm);
        }
    );
  }

  showOptions(searchTerm: string): void {
    this.filteredOptions = this.search(searchTerm);
  }

  async search(searchTerm: string): Promise<string[]> {
    const labels: string[] = [];
    if (this.myProvider === undefined) {
      return labels;
    }
    let results: SearchResult<RawResult>[];
    try {
      results = await this.myProvider.search({ query: searchTerm });
    } catch (e) {
      console.log(e);
      return [];
    }
    for (const result of results) {
      labels.push(result.label);
    }
    return labels;
  }

}
