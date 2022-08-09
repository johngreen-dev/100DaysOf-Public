import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { NewTopicComponent } from '../new-topic/new-topic.component';
import * as _ from 'lodash';
import { StorageService } from 'src/app/storage.service';

export interface TopicsIF {
  name: string;
  progress: number;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  topics: TopicsIF[] = [];
  selectedTopic: TopicsIF;
  tweetText = '';
  tweetTextArea = '';

  constructor(private modalCtrl: ModalController,
              private alertController: AlertController,
              private storage: StorageService,
              ) {}

  async ngOnInit(): Promise<void> {
      this.topics = await this.storage.get('TOPICS_LIST');
      if (this.topics === null) {
        this.topics = [];
      }
      this.selectedTopic = await this.storage.get('SELECTED_TOPIC');
      if (this.selectedTopic === null) {
        this.selectedTopic = undefined;
      }
      else {
        this.tweetText = `Day ${this.selectedTopic.progress +1} of #100DaysOf${this.selectedTopic.name}\n`;
        this.tweetTextArea = '';
      }
  }

  async addNewTopic() {
    const modal = await this.modalCtrl.create({
      component: NewTopicComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log('New Topic', data);
      const findTopic = _.find(this.topics, {name: data.name});
      console.log('find topic', findTopic);
      if(findTopic !== undefined){
        const alert = await this.alertController.create({
          header: 'Failed to create topic',
          message: 'Topic was not created - already exists',
          buttons: ['OK']
        });

        await alert.present();
      } else {
        this.topics.push({name: data.name, progress: data.progress -1});
        this.selectedTopic = {name: data.name, progress: data.progress -1};
        console.log('this.topics', this.topics);
        console.log('this.selectedTopic', this.selectedTopic);
        // Add storage logic
        this.storage.set('TOPICS_LIST', this.topics);
        this.storage.set('SELECTED_TOPIC', this.selectedTopic);
        this.tweetText = `Day ${this.selectedTopic.progress +1} of #100DaysOf${this.selectedTopic.name}\n`;
        this.tweetTextArea = '';
      }
    }
  }

  async removeTopic() {
    const role = await this.presentAlert(`Are you sure you want to remove #100DaysOf${this.selectedTopic.name}`);
    if (role === 'yes') {
      const findTopic = _.find(this.topics, {name: this.selectedTopic.name});
      this.topics.splice(this.topics.indexOf(findTopic));

      // Add storage logic
        // Add storage logic
        this.storage.set('TOPICS_LIST', this.topics);
        if(this.topics.length > 0){
          this.selectedTopic = this.topics[0];
          this.storage.set('SELECTED_TOPIC', this.selectedTopic);
          this.tweetText = `Day ${this.selectedTopic.progress +1} of #100DaysOf${this.selectedTopic.name}\n`;
          this.tweetTextArea = '';
      } else {
        this.selectedTopic = undefined;
        this.storage.remove('SELECTED_TOPIC');
      }
    }
  }


  async restartTopic() {
    const role = await this.presentAlert(`Are you sure you want to restart #100DaysOf${this.selectedTopic.name}`);
    if(role === 'yes') {
      // Add storage logic
      this.selectedTopic.progress = 0;
      const findTopic = _.find(this.topics, {name: this.selectedTopic.name});
      findTopic.progress = this.selectedTopic.progress;
      this.storage.set('SELECTED_TOPIC', this.selectedTopic);
      this.storage.set('TOPICS_LIST', this.topics);
      this.tweetText = `Day ${this.selectedTopic.progress +1} of #100DaysOf${this.selectedTopic.name}\n`;
      this.tweetTextArea = '';

    }
  }


  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: message,
      buttons: [
        {
          text: 'No',
          role: 'no',
        },
        {
          text: 'Yes',
          role: 'yes',
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    return role;
  }

  getMaxLength(){
    return 280 - this.tweetText.length;
  }

  selectChange(event){
    const findTopic = _.find(this.topics, {name: event.detail.value});
    if (findTopic !== undefined) {
      this.selectedTopic = findTopic;
      this.storage.set('SELECTED_TOPIC', this.selectedTopic);
      this.tweetText = `Day ${this.selectedTopic.progress +1} of #100DaysOf${this.selectedTopic.name} `;
      this.tweetTextArea = '';
    }
  }

  tweetTextChange(event){
    this.tweetTextArea = event.detail.value;
  }

  updateProgress() {
    const progressUpdate = this.tweetText + this.tweetTextArea;
    const encStr = encodeURIComponent(progressUpdate);
    console.log('encStr', encStr);
    const url = 'https://twitter.com/intent/tweet?text=' + encStr;
    window.open(url, '_system');


    console.log(progressUpdate);
    this.selectedTopic.progress++;
    const findTopic = _.find(this.topics, {name: this.selectedTopic.name});
    findTopic.progress = this.selectedTopic.progress;
    this.storage.set('SELECTED_TOPIC', this.selectedTopic);
    this.storage.set('TOPICS_LIST', this.topics);
    this.tweetText = `Day ${this.selectedTopic.progress +1} of #100DaysOf${this.selectedTopic.name}\n`;
    this.tweetTextArea = '';

 }

}
