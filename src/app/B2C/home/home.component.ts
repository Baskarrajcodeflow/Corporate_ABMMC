import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OurServicesComponent } from '../Our-Services/our-services.component';
import { HeaderComponent } from '../../header/header.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,OurServicesComponent,HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  images: string[] = [
    'https://via.placeholder.com/1200x500',
    'https://via.placeholder.com/1200x500',
    'https://via.placeholder.com/1200x500'
  ];

  carouselConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true
  };

}
