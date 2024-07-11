import { Component, Input, OnInit } from '@angular/core';
import { Gif } from '../../interfaces/gifs.interfaces';

@Component({
  selector: 'gifs-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit{ //OnInit => es un método especial de Angular
    //del ciclo de vida, que se ejecuta cuando el componente se esta inicializando, 
    //cuando se ha inicializado mejor dicho
    @Input()
    gif!: Gif;
    

    ngOnInit(): void {
        if(!this.gif)
          throw new Error('Gif property is required.');
    }
}
