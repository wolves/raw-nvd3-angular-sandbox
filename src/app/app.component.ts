import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

declare const d3: any;
declare const nv: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('TestGraph') TestGraph: ElementRef;
  private chart: any;
  title = 'nvd3-charts-spike';

  ngAfterViewInit() {
    this.initChart();
  }

  initChart() {
    nv.addGraph(() => {
      this.chart = nv.models
        .scatterChart()
        .showDistX(true)
        .showDistY(true)
        .duration(300)
        .color(d3.scale.category10().range());

      this.chart.dispatch.on('renderEnd', () => {
        console.log('render complete');
      });

      this.chart.xAxis.tickFormat(d3.format('.02f'));
      this.chart.yAxis.tickFormat(d3.format('.02f'));

      d3.select('#TestGraph svg')
        .datum(nv.log(this.randomData(4, 40)))
        .call(this.chart);

      nv.utils.windowResize(this.chart.update);
      this.chart.dispatch.on('stateChange', (e) => {
        nv.log('New State:', JSON.stringify(e));
      });
      return this.chart;
    });
  }

  randomData(groups, points) {
    //# groups,# points per group
    var data = [],
      shapes = ['circle'],
      random = d3.random.normal();

    for (let i = 0; i < groups; i++) {
      data.push({
        key: 'Group ' + i,
        values: [],
        slope: Math.random() - 0.01,
        intercept: Math.random() - 0.5,
      });

      for (let j = 0; j < points; j++) {
        data[i].values.push({
          x: random(),
          y: random(),
          size: Math.random(),
          shape: shapes[j % shapes.length],
        });
      }
    }
    return data;
  }
}
