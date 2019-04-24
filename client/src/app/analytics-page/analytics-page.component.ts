import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {AnalyticsPage} from "../shared/interfaces";
import {Subscription} from "rxjs";
import {Chart} from "chart.js"

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef
  @ViewChild('order') orderRef: ElementRef

  average: number
  pending = true
  aSub: Subscription

  constructor(private service: AnalyticsService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255,99,132)'
    }
    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54,162,235)'
    }
    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average

      gainConfig.labels = data.chart.map(item => item.label)
      gainConfig.data = data.chart.map(item => item.gain)

      // Temporary Example Data

      // gainConfig.labels.push('24.04.2019')
      // gainConfig.data.push(800)
      // gainConfig.labels.push('25.04.2019')
      // gainConfig.data.push(1200)
      // gainConfig.labels.push('26.04.2019')
      // gainConfig.data.push(400)

      // Temporary Example Data

      orderConfig.labels = data.chart.map(item => item.label)
      orderConfig.data = data.chart.map(item => item.order)

      // Temporary Example Data

      // orderConfig.labels.push('24.04.2019')
      // orderConfig.data.push(8)
      // orderConfig.labels.push('25.04.2019')
      // orderConfig.data.push(12)
      // orderConfig.labels.push('26.04.2019')
      // orderConfig.data.push(4)

      // Temporary Example Data

      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'

      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      orderCtx.canvas.height = '300px'

      new Chart(gainCtx, createChartConfig(gainConfig))

      new Chart(orderCtx, createChartConfig(orderConfig))

      this.pending = false
    })
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }
}

function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
