// src/app/main/main.component.ts
import { Component, OnInit } from '@angular/core';
import { LoteriaService } from 'src/app/service/loteria.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  cartas: any[] = [];

  constructor(private loteriaService: LoteriaService) {}

  ngOnInit(): void {
    this.loteriaService.getCards().subscribe(data => {
      this.cartas = data;
    });
  }
}