import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "../../B2C/home/home.component";
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-body',
    standalone: true,
    templateUrl: './body.component.html',
    styleUrl: './body.component.scss',
    imports: [RouterOutlet, HomeComponent,CommonModule]
})
export class BodyComponent {
 constructor(public authService : AuthService){}
}
