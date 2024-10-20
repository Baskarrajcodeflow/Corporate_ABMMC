import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DatasharingService } from '../../services/datasharing.service';
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule,MatProgressSpinnerModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent implements OnInit{
  constructor(private loadingService: DatasharingService) {}

  public isLoading: boolean = false;
  ngOnInit() {
    this.loadingService.loading$.subscribe((loading) => {
      console.log(loading);
      this.isLoading = loading;
    });
  }
}
