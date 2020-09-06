import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../services/notification.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  notificationList: any[];
  modalTitle = '';
  editorData = '';
  currentMsg;
  isLoading;
  submitted;
  config: any = {
    allowedContent: true,
    toolbar: [['Bold', 'Italic', 'Underline', '-', 'NumberedList', 'BulletedList', 'Link', '-', 'CreatePlaceholder']],
    removePlugins: 'elementspath',
    resize_enabled: true,
    extraPlugins: 'font,divarea,placeholder',
    contentsCss: [`body {font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;}`],
    autoParagraph: false,
    enterMode: 2
  };
  myForm: FormGroup;
  constructor(public notifcationService: NotificationService, private modalService: NgbModal) {
    this.subscription = new Subscription();
    this.myForm = new FormGroup({
      heading: new FormControl('', Validators.required),
      subHeading: new FormControl('', Validators.required),
      isActive: new FormControl(false)
    });
  }

  ngOnInit(): void {
    this.getNotifcations();
  }
  getNotifcations() {
    this.isLoading = true;
    this.notifcationService.getNotifications().subscribe((response: any) => {
      this.isLoading = false;
      this.notificationList = response.message;
    });
  }
  getData(str) {
    return str.replace(/(<([^>]+)>)/ig, '');
  }

  openPopup(content, isEdit, messgeObj?) {
    this.submitted = false;
    this.myForm.reset();
    this.editorData = '';
    this.currentMsg = isEdit ? JSON.parse(JSON.stringify(messgeObj)) : {};
    if (isEdit) {
      this.setFormValue();
    }
    this.modalTitle = isEdit ? 'Edit message' : 'Add message';
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  setFormValue() {
    this.myForm.get('heading').setValue(this.currentMsg.Heading);
    this.myForm.get('subHeading').setValue(this.currentMsg.SubHeading);
    this.myForm.get('isActive').setValue(this.currentMsg.IsActive);
    this.editorData = this.currentMsg.Body;
  }

  addUpdateMessage(modalInstance) {
    if (this.myForm.valid && this.editorData.trim().length) {
      this.updateList();
      modalInstance.close();
    } else {
    }
  }
  updateList() {
    const updatedMessgeObj = {
      Date: this.currentMsg.id ? this.currentMsg.Date : new Date(),
      id: this.currentMsg.id ? this.currentMsg.id : this.notificationList.length,
      Heading: this.myForm.get('heading').value,
      SubHeading: this.myForm.get('subHeading').value,
      Body: this.editorData,
      IsActive: this.myForm.get('isActive').value
    };
    if (this.currentMsg.id) {
      const index = this.notificationList.findIndex((item) => {
        return item.id === this.currentMsg.id;
      });
      this.notificationList[index] = updatedMessgeObj;
    } else {
      this.notificationList.push(updatedMessgeObj);
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
