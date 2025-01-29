import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
   selector: 'app-add-address',
   standalone: true,
   imports: [FormsModule, InputTextModule, ButtonModule, CardModule, CommonModule],
   templateUrl: './add-address.component.html',
   styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent implements AfterViewInit {
   @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
   @ViewChild('searchBox', { static: false }) searchBox!: ElementRef;

   map: google.maps.Map | undefined;
   marker: google.maps.Marker | undefined;
   geocoder = new google.maps.Geocoder();

   isFormVisible = false;
   formData: any = {
      address_name: '',
      address_details: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      latitude: '',
      longitude: '',
   };

   // Geofencing parameters
   cityCoordinates = { lat: 23.2599, lng: 77.4126 }; // Bhopal coordinates
   geofenceRadius = 10000; // 10 km radius (in meters)

   ngAfterViewInit(): void {
      this.initializeMap();

      const searchBox = new google.maps.places.SearchBox(this.searchBox.nativeElement);

      this.map?.addListener('bounds_changed', () => {
         searchBox.setBounds(this.map!.getBounds() as google.maps.LatLngBounds);
      });

      searchBox.addListener('places_changed', () => {
         const places = searchBox.getPlaces();

         if (!places || places.length === 0) {
            console.error("No places were found.");
            return;
         }

         const place = places[0];
         if (!place.geometry || !place.geometry.location) {
            console.error("Place has no geometry or location.");
            return;
         }

         const selectedLocation = place.geometry.location;

         if (!this.isWithinGeofence(selectedLocation)) {
            alert("The selected address is outside the allowed city boundary.");
            return;
         }

         this.map?.setCenter(selectedLocation);
         this.map?.setZoom(15);

         if (this.marker) {
            this.marker.setMap(null);
         }
         this.marker = new google.maps.Marker({
            position: selectedLocation,
            map: this.map
         });

         const addressComponents = place.address_components || [];
         const getAddressComponent = (type: string) => {
            const component = addressComponents.find(c => c.types.includes(type));
            return component ? component.long_name : null;
         };

         this.formData = {
            address_details: place.formatted_address,
            city: getAddressComponent('locality'),
            state: getAddressComponent('administrative_area_level_1'),
            country: getAddressComponent('country'),
            postal_code: getAddressComponent('postal_code'),
            latitude: selectedLocation.lat(),
            longitude: selectedLocation.lng(),
         };

         this.searchBox.nativeElement.value = place.formatted_address || '';
      });
   }

   initializeMap(): void {
      const defaultLocation = this.cityCoordinates;

      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
            (position) => {
               const currentLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
               };

               this.setMapLocation(currentLocation);
            },
            () => {
               this.setMapLocation(defaultLocation);
            }
         );
      } else {
         this.setMapLocation(defaultLocation);
      }
   }

   setMapLocation(location: { lat: number, lng: number }): void {
      this.map = new google.maps.Map(this.mapContainer.nativeElement, {
         center: location,
         zoom: 12
      });

      this.marker = new google.maps.Marker({
         position: location,
         map: this.map
      });

      this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
         if (event.latLng) {
            const position = event.latLng;

            if (this.marker) {
               this.marker.setMap(null);
            }
            this.marker = new google.maps.Marker({
               position,
               map: this.map
            });

            if (!this.isWithinGeofence(position)) {
               alert("The selected address is outside the allowed city boundary.");
               return;
            }

            this.geocoder.geocode({ location: position }, (results, status) => {
               if (status === 'OK' && results && results[0]) {
                  const address = results[0].formatted_address;
                  const addressComponents = results[0].address_components;

                  const getAddressComponent = (type: string) => {
                     const component = addressComponents.find(c => c.types.includes(type));
                     return component ? component.long_name : null;
                  };

                  this.formData = {
                     formatted_address: address,
                     city: getAddressComponent('locality'),
                     state: getAddressComponent('administrative_area_level_1'),
                     country: getAddressComponent('country'),
                     postal_code: getAddressComponent('postal_code'),
                     latitude: position.lat(),
                     longitude: position.lng(),
                  };

                  this.searchBox.nativeElement.value = address;
               }
            });
         }
      });
   }

   isWithinGeofence(location: google.maps.LatLng): boolean {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
         location,
         new google.maps.LatLng(this.cityCoordinates.lat, this.cityCoordinates.lng)
      );

      return distance <= this.geofenceRadius;
   }

   openForm(): void {
      this.isFormVisible = !this.isFormVisible;
   }

   submitForm(): void {
      alert("Address added successfully!");
      this.isFormVisible = false;
   }
}
