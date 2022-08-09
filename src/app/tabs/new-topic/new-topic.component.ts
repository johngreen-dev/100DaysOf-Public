import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-topic',
  templateUrl: './new-topic.component.html',
  styleUrls: ['./new-topic.component.scss'],
})
export class NewTopicComponent implements OnInit {
  topicName = '';
  topicStartDay = 1;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  textChanged(){
    this.topicName = this.topicName.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1)).replace(/\s/g, '');
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    console.log('confirm ', this.topicName);
    return this.modalCtrl.dismiss({name: this.topicName, progress: this.topicStartDay}, 'confirm');
  }


}
