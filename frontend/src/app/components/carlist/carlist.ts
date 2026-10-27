import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CarService } from '../../services/car-service';
import { Car } from '../../../core/models/car.model';

@Component({
  selector: 'app-carlist',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './carlist.html',
  styleUrls: ['./carlist.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarlistComponent implements OnInit {
  cars: Car[] = [];
  searchTerm: string = '';
  loading: boolean = false;

  constructor(private carService: CarService, private cd: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.loadCars();
  }

  loadCars() {
    this.loading = true;
    this.carService.getCars().subscribe({
      next: (data) => {
        // Add extra UI properties like hover, discount, rating
        this.cars = data.map(car => ({
          ...car,
          hover: false,                // for hover animation
          discount: car.discount || 0, // if no discount
          rating: car.rating || 0,     // default 0 stars
          description: car.description || 'No description available',
          imageUrl: car.imageUrl && car.imageUrl.trim() !== '' ? car.imageUrl : 'assets/no-image.jpg'
        }));
        this.loading = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('API ERROR:', err);
        this.loading = false;
        this.cd.markForCheck();

        if (err.status === 401) {
          alert('You are not authorized. Please login again.');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  viewDetails(carId: number | undefined) {
    if (!carId) return;
    this.router.navigate(['/car', carId]);
  }

  getStars(rating: number = 0) {
  const value = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return [...Array(value).fill(true), ...Array(5 - value).fill(false)];
}
}