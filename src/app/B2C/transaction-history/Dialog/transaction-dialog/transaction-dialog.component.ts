import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  imports: [MatDialogModule,CommonModule,MatIconModule],
  templateUrl: './transaction-dialog.component.html',
  styleUrl: './transaction-dialog.component.scss',
})
export class TransactionDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef:MatDialogRef<TransactionDialogComponent>) {}
  ngOnInit(): void {
    console.log(this.data);
    
  }
  closeDialog(){
    this.dialogRef.close()
  }

}
