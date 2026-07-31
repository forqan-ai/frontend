import { Component } from '@angular/core';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from "../../../shared/components/toast/toast.component";

@Component({
  selector: 'app-public-layout',
  imports: [NavbarComponent, FooterComponent, RouterOutlet, ToastComponent],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css',
})
export class PublicLayoutComponent {

}