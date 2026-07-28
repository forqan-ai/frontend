export interface IWishlistItem {
  courseID: string;
  title: string;
  thumbnailURL: string | null;
  teacherName: string;
  categoryName: string;
  price: number;
  rating: number;
  reviewsCount: number;
  addedAt: string;
}

export interface IToggleWishlistResponse {
  isInWishlist: boolean;
}
