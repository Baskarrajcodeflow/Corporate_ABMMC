import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  constructor(private sharedService : SharedService){

  }

  @Input() title: string = '';
  @Input() color: string = 'bg-white';
  showCard : boolean = true;

  ngOnInit(){

  }

  close() {
    this.showCard = false;
  }

  ngOnDestroy(){
    this.showCard = true;
  }

}
