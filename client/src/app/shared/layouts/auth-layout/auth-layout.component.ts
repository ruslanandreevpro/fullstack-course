import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialServie} from "../../classes/material.servie";

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit, AfterViewInit {

  @ViewChild('mobileMenu') mobileMenuRef: ElementRef

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    MaterialServie.initMobileMenu(this.mobileMenuRef)
  }

}
