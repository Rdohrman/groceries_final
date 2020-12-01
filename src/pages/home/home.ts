import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { GroceriesServiceProvider } from '../../providers/groceries-service/groceries-service';
import { InputDialogServiceProvider } from '../../providers/input-dialog-service/input-dialog-service';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  title = "Grocery";
  items = [];
  errorMessage: string;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public alertCtrl: AlertController, 
    public dataService: GroceriesServiceProvider, public inputDialogService: InputDialogServiceProvider, 
    public socialSharing: SocialSharing){
      dataService.dataChanged$.subscribe((dataChanged: boolean) => { this.loadItems(); 
    });
  }

  ionViewWillEnter() {
    this.loadItems();
}
  loadItems() {
     this.dataService.getItems()
     .subscribe(
       items => this.items = items,
       error => this.errorMessage = <any>error);

  }

  removeItem(item) {
    console.log("Removing Item - ", item.name);
    const toast = this.toastCtrl.create({
      message: 'Removing Item - ' + item.name + " ...",
      duration: 3000
    });
    toast.present();

    this.dataService.removeItem(item._id);  
  }

  shareItem(item) {
    console.log("Sharing Item - ", item.name);
    const toast = this.toastCtrl.create({
      message: 'Sharing Item - ' + item.name + " ...",
      duration: 3000
    });

    toast.present();

    let message = "Grocery Item - Name: " + item.name + " - Quantity: " + item.quantity;
    let subject = "Shared via Groceries app";

    this.socialSharing.share(message, subject).then(() => {
      // Sharing via email is possible
      console.log("Shared successfully!");
    }).catch((error) => {
      console.error("Error while sharing ", error);
    });    

  }

  editItem(item) {
    console.log("Edit Item - ", item.name);
    const toast = this.toastCtrl.create({
      message: 'Editing Item - ' + item.name + " ...",
      duration: 3000
    });
    toast.present();
    this.inputDialogService.showPrompt(item);
  }  

  addItem() {
    console.log("Adding Item");
    this.inputDialogService.showPrompt();
  }



}
