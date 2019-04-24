import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Order} from "../../shared/interfaces";
import {MaterialInstance, MaterialServie} from "../../shared/classes/material.servie";

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() orders: Order[]
  @ViewChild('modal') modalRef: ElementRef

  modal: MaterialInstance

  selectedOrder: Order

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.modal.destroy()
  }

  ngAfterViewInit(): void {
    this.modal = MaterialServie.initModal(this.modalRef)
  }

  computePrice(order): number {
    return order.list.reduce((total, item) => {
       return total += item.quantity * item.cost
    }, 0)
  }

  selectOrder(order: Order) {
    this.selectedOrder = order
    this.modal.open()
  }

  closeModal() {
    this.modal.close()
  }
}
