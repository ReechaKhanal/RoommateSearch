import {AfterViewInit, Component, Input, Output, ViewEncapsulation} from '@angular/core';
import { LocationIQProvider } from 'leaflet-geosearch';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { RawResult } from 'leaflet-geosearch/dist/providers/openStreetMapProvider';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider';
import {debounceTime} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LocationSearchComponent implements AfterViewInit {
  myProvider: LocationIQProvider | undefined;
  filteredOptions: Promise<SearchResult<RawResult>[]> | undefined;
  @Input()
  parentFormGroup: FormGroup | undefined;
  searchFormControl = new FormControl('', [Validators.required]);
  selectedAddress: SearchResult<RawResult> | undefined;

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
    this.parentFormGroup?.addControl('address' , this.searchFormControl);
  }

  showOptions(searchTerm: string): void {
    this.filteredOptions = this.search(searchTerm);
  }

  async search(searchTerm: string): Promise<SearchResult<RawResult>[]> {
    const labels: string[] = [];
    if (this.myProvider === undefined) {
      throw Error;
    }
    let results: SearchResult<RawResult>[];
    try {
      results = await this.myProvider.search({ query: searchTerm });
    } catch (e) {
      console.log(e);
      return [];
    }
    return results;
  }

  displayFn(value: SearchResult<RawResult>): string {
    if (value) {
      return value.label;
    }
    return '';
  }

  onSelected($event: MatAutocompleteSelectedEvent): void {
    this.selectedAddress =  $event.option.value;
  }
}
