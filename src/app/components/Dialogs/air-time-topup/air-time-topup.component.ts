import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-air-time-topup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './air-time-topup.component.html',
  styleUrl: './air-time-topup.component.scss'
})
export class AirTimeTopupComponent {
constructor(
  @Inject(MAT_DIALOG_DATA) public data: any
){
  console.log(data);
  
}
}
