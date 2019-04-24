import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {Observable} from "rxjs";
import {OverviewPage} from "../shared/interfaces";
import {MaterialInstance, MaterialServie} from "../shared/classes/material.servie";

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss']
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tapTarget') tapTargetRef: ElementRef
  data$: Observable<OverviewPage>
  tapTarget: MaterialInstance
  yesterday: Date = new Date()

  constructor(private service: AnalyticsService) { }

  ngOnInit() {
    this.data$ = this.service.getOverview()
    this.yesterday.setDate(this.yesterday.getDate() - 1)
  }

  ngOnDestroy(): void {
    this.tapTarget.destroy()
  }

  ngAfterViewInit(): void {
    this.tapTarget = MaterialServie.initTapTarget(this.tapTargetRef)
  }

  openInfo() {
    this.tapTarget.open()
  }
}
