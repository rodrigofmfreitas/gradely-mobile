import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-university-selector',
  templateUrl: './university-selector.component.html',
  styleUrls: ['./university-selector.component.scss'],
  standalone: false,
})
export class UniversitySelectorComponent {
  @Input() universities: any[] = [];

  searchTerm = '';
  filteredUniversities: any[] = [];

  newUniversity = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.filteredUniversities = this.universities;
  }

  filterUniversities(event: any) {
    const val = event.target.value?.toLowerCase() || '';
    this.filteredUniversities = this.universities.filter(u =>
      u.name.toLowerCase().includes(val)
    );
  }

  selectUniversity(name: string) {
    this.modalCtrl.dismiss({ university: name }, 'confirm');
  }

  addUniversity() {
    if (this.newUniversity.trim()) {
      this.modalCtrl.dismiss({ university: this.newUniversity.trim() }, 'confirm');
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
