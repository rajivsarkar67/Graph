import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  data : {date: any, weight: any}[] = [];
  distanceArr: number[] = [];
  myChart : any;

  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('content') || '[]');
    if(this.data.length){
      this.generateGraph();
    }
  }

  addData(date: any, weight: any){
    if(date === '' || weight === ''){ alert('Please fill values first'); return;};
    this.data.push({date: date, weight: weight});
    localStorage.setItem('content', JSON.stringify(this.data));
    this.generateGraph();
  }

  deleteData(index: number){
    this.data.splice(index,1);
    this.generateGraph();
    localStorage.setItem('content', JSON.stringify(this.data));
  }

  generateGraph(){
    this.distanceArr = [];
    this.myChart?.destroy();

    // Calculating the day difference
    for(let i=0; i<this.data.length; i++){
      this.distanceArr.push((new Date(this.data[i].date).getTime() - new Date(this.data[0].date).getTime()) / (1000*60*60*24));
    }

    // making the x-axis
    const days : number[] = [];
    for(let i=0; i<=this.distanceArr[this.distanceArr.length-1]; i++){
      days.push(i);
    }

    // making the y-axis
    const weights: any[] = [];
    for(let i=0; i<days.length; i++){
      weights.push(null);
    }
    for(let i=0; i<this.distanceArr.length; i++){
      weights[this.distanceArr[i]] = this.data[i].weight;
    }

    this.myChart = new Chart("myChart", {
      type: "line",
      data: {
        labels: days,
        datasets: [{
          backgroundColor:"rgba(0,0,255,1.0)",
          borderColor: "rgba(0,0,255,0.1)",
          data: weights,
          label: 'Weight',
        }],
      },
      options: {spanGaps: true}
    });
  }
}
