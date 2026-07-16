import { NgClass } from '@angular/common';
import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  constructor(private router: Router) { }
  @Input() type: 'button' | 'submit' = 'button';

  @Input() pageLink: string | null = null;

  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary';

  @Input() disabled: boolean = false;

  @Input() customClass: string = '';

  @Output() btnClick = new EventEmitter<void>();

  onBtnPress() {

    if (this.pageLink) {

      this.router.navigate([this.pageLink]);

    }
    else {
      this.btnClick.emit();
    }
    //write the remaining logic of the button press here

  }
}
