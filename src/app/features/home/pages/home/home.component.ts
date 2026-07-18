import { Carousel } from 'bootstrap';
import { AfterViewInit, Component } from '@angular/core';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit {
  courses = [
    { imagePath: 'images/card3.jfif', title: 'الدورة الأولى', level: 'مبتدئ', rating: '★★★★★' },
    { imagePath: 'images/card3.jfif', title: 'الدورة الثانية', level: 'متوسط', rating: '★★★★' },
    { imagePath: 'images/card3.jfif', title: 'الدورة الثالثة', level: 'متقدم', rating: '★★★★★' },
    { imagePath: 'images/card3.jfif', title: 'الدورة الرابعة', level: 'مبتدئ', rating: '★★★★' },
    { imagePath: 'images/card3.jfif', title: 'الدورة الخامسة', level: 'متوسط', rating: '★★★★★' },
    { imagePath: 'images/card3.jfif', title: 'الدورة السادسة', level: 'متقدم', rating: '★★★★' }
  ];

  ngAfterViewInit(): void {
    const carouselElement = document.querySelector('#heroCarousel');

    if (carouselElement) {
      const carousel = new Carousel(carouselElement, {
        interval: 2500,
        pause: false,
        wrap: true
      });

      setTimeout(() => {
        carousel.cycle();
      }, 0);
    }
  }
}