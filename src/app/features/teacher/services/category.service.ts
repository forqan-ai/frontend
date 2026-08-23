import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Category } from "../models/category.model";
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);

  getCategories() {
    return this.http.get<Category[]>(
      `${environment.apiUrl}/api/categories`
    );
  }

}