import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Select } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { ApiService } from '../services/api.service';
import { ToastNotificationService } from '../services/toast-notification.service';

@Component({
   selector: 'app-add-address',
   standalone: true,
   imports: [  ButtonModule, CardModule, CommonModule,InputTextModule, ButtonModule, CommonModule, SkeletonModule, FormsModule, 
         ReactiveFormsModule,],
   templateUrl: './add-address.component.html',
   styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent implements AfterViewInit {
   @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
   @ViewChild('searchBox', { static: false }) searchBox!: ElementRef;
   addressType: any;
   projectForm: any;
   businessDetail: any;
   drops: any;
 
   constructor(private route: ActivatedRoute,private router: Router,private fb: FormBuilder ,private apiService: ApiService,private toastService: ToastNotificationService) {

   
      this.route.params.subscribe((params) => {
     
        this.addressType = params['type'];
      });
    this.businessDetail = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
 
   //    this.pickupLocation = this.apiService.getLocalValueInJSON(localStorage.getItem('selectedPickup'));
   //    this.dropLocation = this.apiService.getLocalValueInJSON(localStorage.getItem('selectedDrop'));
   //    this.businessDetails = this.apiService.getLocalValueInJSON(localStorage.getItem('bussinessDetails'));
   //    this.cityCoordinates = { lat: 23.2599, lng: 77.4126 }; // Bhopal coordinates
   //    this.geofenceRadius = 10000; // 10 km radius (in meters)
    }
    ngOnInit() {
      this.projectForm = this.fb.group({
  
  
  
        address_details: ['', Validators.required],
        address_name: ['', Validators.required],
        city: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
        country_id: ['101'],
        state_id: ['', ],
        country: ['101'],
        state: ['', ],
        lat_val:'',
        long_val: '',
        status: ['1'],
        user_id: [''],
        postal_code:['',[Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(6), Validators.minLength(6)]],
        landmark:[''],
        house_no:[''],
        person_phone_no: ['',[Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10), Validators.minLength(10)]],
      person_name: ['',[Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
  super_admin_id: [environment.superAdminId],
      });
     
  
  
    }
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
      lat_val: '',
      long_val: '',
      person_phone_no: '',
      person_name: '',
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
        // this.isFormVisible = true;
        if (!places || places.length === 0) {
          console.error("No places were found.");
          return;
        }
  
        const place = places[0];
        if (!place.geometry || !place.geometry.location) {
          console.error("Place has no geometry or location.");
          return;
        }
        // this.isFormVisible = true;
        const selectedLocation = place.geometry.location;
  
        // Check if the selected address is within the geofence
        // if (!this.isWithinGeofence(selectedLocation)) {
        //   alert("The selected address is outside the allowed city boundary.");
        //   return;
        // }
  
        this.map?.setCenter(selectedLocation);
        this.map?.setZoom(20);
  
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
          lat_val: selectedLocation.lat(),
          long_val: selectedLocation.lng(),
        };
     
        this.projectForm.patchValue({
  
          address_details: this.formData.address_details,
          city: this.formData.city,
          state_id:this.businessDetail.state_id,
          
          state: this.formData.state,
          country: this.formData.country,
          postal_code: this.formData.postal_code,
          lat_val: this.formData.lat_val,
          long_val: this.formData.long_val
        })
  console.log(this.formData ,"value")
        this.searchBox.nativeElement.value = place.formatted_address || '';
        
      });
      
    }
  
  
    currentLocation(){
      const defaultLocation = this.cityCoordinates; // Bhopal's default location
      // this.setMapLocation(defaultLocation);
      navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("position",position)
            const currentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
           
            this.setMapLocation(currentLocation);
          },
          (error) => {
            console.error("Geolocation error: ", error);
            this.setMapLocation(defaultLocation);
          })
    }
    addAddress() {
      
      if (this.addressType === 'drop') {
        localStorage.setItem('selectedDrop', JSON.stringify(this.projectForm.value));
      } else if (this.addressType === 'pickup') {
        localStorage.setItem('selectedPickup', JSON.stringify(this.projectForm.value));
      }
   
     
      this.projectForm.value.business_id=this.businessDetail.id
      this.apiService.add_address(this.projectForm.value).subscribe({
        next: (data: any) => {
          if (data?.data?.status) {
       this.router.navigate(['/orders/new-order']);
       this.toastService.showSuccess("Address Added Successfully")
            // this.commonService.goBack();
            // this.messageService.showSuccess(data.msg, 'Success');
          } else {
            // this.messageService.showError(data.msg, 'Error');
          }
        },
        error: (error: any) => {
          console.error('Error adding address:', error);
        },
      });
    }
  
    submitForm(key:any): void {
      // this.addresses.push(this.formData);
      // this.isFormVisible = true;
      this.projectForm.patchValue({
        address_name: this.formData.address_name,
        address_details: this.formData.address_details,
        city: this.formData.city,
        state_id:this.businessDetail.state_id,
         country_id:this.businessDetail.country_id,
        state: this.formData.state,
        country: this.formData.country,
        postal_code: this.formData.postal_code,
        lat_val: this.formData.lat_val,
        long_val: this.formData.long_val,
        person_phone_no: this.formData.person_phone_no,
        person_name: this.formData.person_name,
      })
      if(!this.formData.address_details){
      //   this.messageService.showError("Please select Address", 'Error');
        return;
      }
      switch (key) {
        case 'one-time':
          
          this.handleOneTime(this.projectForm.value);
          break;
  
        case 'save':
         //  this.drops = this.apiService.getLocalValueInJSON(localStorage.getItem('selectedDrop'));
          this.isFormVisible = true
          // this.addAddress();
          break;
  
        default:
          console.log('Invalid key provided');
      }
    }
    handleOneTime(payload: any) {
      if (this.addressType === 'drop') {
        localStorage.setItem('selectedDrop', JSON.stringify(payload));
      } else if (this.addressType === 'pickup') {
        localStorage.setItem('selectedPickup', JSON.stringify(payload));
      }
      this.router.navigate(['/orders/new-order']);
      // this.commonService.goBack();
    }
    // Initialize the map centered on the default location or user's location
    initializeMap(): void {
      const defaultLocation = this.cityCoordinates; // Bhopal's default location
      this.setMapLocation(defaultLocation);
      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(
      //     (position) => {
      //       const currentLocation = {
      //         lat: position.coords.latitude,
      //         lng: position.coords.longitude
      //       };
           
      //       this.setMapLocation(currentLocation);
      //     },
      //     (error) => {
      //       console.error("Geolocation error: ", error);
      //       this.setMapLocation(defaultLocation);
      //     }
      //   );
      // } else {
      //   this.setMapLocation(defaultLocation);
      
      // }
    }
  
    setMapLocation(location: { lat: number, lng: number }): void {
      
      this.map = new google.maps.Map(this.mapContainer.nativeElement, {
        center: location,
        zoom: 20,
        fullscreenControl: false,
          gestureHandling: 'greedy',
       
  
      });
  
  
  
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map,
      
      });
  
  
      
      this.geocoder.geocode({ location: location }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          console.log("lo",location)
          const address = results[0].formatted_address;
          const addressComponents = results[0].address_components;
        
          this.searchBox.nativeElement.value = address;
          const getAddressComponent = (type: string) => {
            const component = addressComponents.find(c => c.types.includes(type));
            return component ? component.long_name : null;
          };
  
        
          this.formData = {
            address_details: address,
            city: getAddressComponent('locality'),
            state: getAddressComponent('administrative_area_level_1'),
            country: getAddressComponent('country'),
            postal_code: getAddressComponent('postal_code'),
            lat_val: location.lat,
            long_val: location.lng,
          };
  
          this.searchBox.nativeElement.value = address;
        } else {
          console.error("Geocoder failed due to: " + status);
        }
      });
  
      this.map.addListener('position_changed', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const position = event.latLng;
  console.log("posit",event.latLng)
          if (this.marker) {
            this.marker.setMap(null);
          }
          this.marker = new google.maps.Marker({
            position,
            map: this.map
          });
  
  console.log(this.map,"map")
          // Check if the clicked address is within the geofence
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
                address_details: address,
                city: getAddressComponent('locality'),
                state: getAddressComponent('administrative_area_level_1'),
                country: getAddressComponent('country'),
                postal_code: getAddressComponent('postal_code'),
                lat_val: position.lat(),
                long_val: position.lng(),
              };
  
              this.searchBox.nativeElement.value = address;
            } else {
              console.error("Geocoder failed due to: " + status);
            }
          });
        
        }
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
  
  console.log(this.map,"map")
          // Check if the clicked address is within the geofence
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
                address_details: address,
                city: getAddressComponent('locality'),
                state: getAddressComponent('administrative_area_level_1'),
                country: getAddressComponent('country'),
                postal_code: getAddressComponent('postal_code'),
                lat_val: position.lat(),
                long_val: position.lng(),
              };
  
              this.searchBox.nativeElement.value = address;
            } else {
              console.error("Geocoder failed due to: " + status);
            }
          });
        
        }
      });
    }
  
    // Check if a given location is within the geofence
    isWithinGeofence(location: google.maps.LatLng): boolean {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        location,
        new google.maps.LatLng(this.cityCoordinates.lat, this.cityCoordinates.lng)
      );
  
      return distance <= this.geofenceRadius;
    }
  
  
    openForm(): void {
      this.isFormVisible = true;
    }
}
