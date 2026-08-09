import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../Services/wishlist.service';
import { IWishlistItem } from '../../Models/wishlist-item.interface';
import { ICourseCardDto } from '../../../Course/Models/course-card-dto.interface';
import { CourseCardComponent } from "../../../Course/Components/course-card/course-card.component";

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, RouterLink, CourseCardComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  private wishlistService = inject(WishlistService);

  wishlistItems = signal<ICourseCardDto[]>([]);

  isLoading = signal(true);

  ngOnInit() {
    this.loadWishlist();
  }


  loadWishlist() {
    this.isLoading.set(true);
    this.wishlistService.getWishlist().subscribe({
      next: (items) => {
        this.wishlistItems.set(items);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  removeFromWishlist(courseId: string) {
    this.wishlistItems.update(items => items.filter(i => i.courseID !== courseId));
  }

  formatPrice(price: number): string {
    return price === 0 ? 'مجاني' : `${price} $`;
  }
}
