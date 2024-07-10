import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

//const GIPHY_API_KEY = 'FkphfO49UgUMBTBzDRKXY9632YQ40LYc';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifsList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = 'FkphfO49UgUMBTBzDRKXY9632YQ40LYc';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) { 
    this.loadLocalStorage();
    console.log('Gifs Service Ready');
  }

  get tagsHistory(){
    return [...this._tagsHistory];
  }

  searchTag(tag: string): void{
    //parametros para la url del servicio que se consulta
    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', tag);

    if(tag.length === 0) 
      return;

    this.orginizeHistory(tag);
    //este tipo de metodo es un Observable
    //Observable: es un objeto en el cual a lo largo del tiempo, puedes estar
    //emitiendo diferentes valores.
    //usualmente cuando hablan de "suscribimos a los observables", significa estar
    //escuchando las emisiones que ese objeto estara emitiendo a lo largo de su vida.
    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, {params})
    //para escuchar la respuesta me suscribo
    .subscribe( resp => {
      this.gifsList = resp.data;
      // console.log({ gifs: this.gifsList });
    });


    //el fetch regresa una promesa, se utiliza el async y retorna una Promise<tipo>
    //fetch('https://api.giphy.com/v1/gifs/search?api_key=FkphfO49UgUMBTBzDRKXY9632YQ40LYc&q=valorant&limit=5')
    //.then( resp => resp.json())
    //.then(data => console.log(data));

    //igual al apartado anterior
    //const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_key=FkphfO49UgUMBTBzDRKXY9632YQ40LYc&q=valorant&limit=5');
    //const data = await resp.json();
    //console.log(data);


    //this._tagsHistory.unshift(tag);
    //console.log(this._tagsHistory);
  }

  private orginizeHistory(tag: string){
    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory =this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void{
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void{
    if( !localStorage.getItem('history') )
      return;
    this._tagsHistory = JSON.parse( localStorage.getItem('history')! );

    if(this._tagsHistory.length === 0) return;

    this.searchTag(this._tagsHistory[0]);
  }
}
