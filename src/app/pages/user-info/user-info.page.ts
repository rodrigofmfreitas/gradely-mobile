import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth';
import { ModalController } from '@ionic/angular';
import { UniversitySelectorComponent } from 'src/app/components/university-selector/university-selector.component';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  collectionData,
  docData,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss'],
  standalone: false,
})
export class UserInfoPage implements OnInit {
  userInfoForm!: FormGroup;
  universities: any[] = [];
  selectedUniversity = '';

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private firestore: Firestore = inject(Firestore);
  private auth = inject(AuthService);
  private modalCtrl = inject(ModalController);
  private router = inject(Router);

  ngOnInit() {
    this.userInfoForm = this.fb.group({
      fullName: [''],
      birthDate: [''],
      cep: [''],
      street: [''],
      number: [''],
      complement: [''],
      neighborhood: [''],
      city: [''],
      state: [''],
      graduation: [''],
      college: [''],
    });

    this.loadUniversities();
    this.subscribeToUser(); // ✅ uses observable instead of await
  }

  // Load universities
  loadUniversities() {
    this.http
      .get<any[]>('assets/data/brazilian-universities.json')
      .subscribe({
        next: (data) => (this.universities = data),
        error: (err) => console.error('Error loading universities:', err),
      });
  }

  // ✅ Fix: Listen to auth state and only query Firestore when the user is known
  subscribeToUser() {
    this.auth.authState
      .pipe(
        // Map the user observable to the Firestore data observable
        switchMap((user: any) => {
          if (!user) {
            return EMPTY; // Return an empty observable if no user
          }

          // ✅ Modular Firestore Syntax for fetching a single document
          const userDocRef = doc(this.firestore, 'users', user.uid);
          return docData(userDocRef); // docData returns an Observable<any>
        })
      )
      .subscribe((data: any) => {
        if (data) {
          this.userInfoForm.patchValue(data);
          if (data.college) {
            this.selectedUniversity = data.college;
          }
        }
      });
  }

  // Open modal to select or add university
  async openUniversitySelector() {
    const modal = await this.modalCtrl.create({
      component: UniversitySelectorComponent,
      componentProps: {
        universities: this.universities,
        selected: this.selectedUniversity,
      },
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data?.university) {
      this.selectedUniversity = data.university;
      this.userInfoForm.patchValue({ college: data.university });
    }
  }

  // CEP auto-fill
  onCepBlur() {
    const cep = this.userInfoForm.value.cep?.replace(/\D/g, '');
    if (cep?.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
        next: (data: any) => {
          if (!data.erro) {
            this.userInfoForm.patchValue({
              street: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf,
            });
          }
        },
        error: (err) => console.error('Error fetching CEP:', err),
      });
    }
  }

  // Save to Firestore
  async onSubmit() {
    const user = await this.auth.currentUser;
    if (!user) return;

    const userData = this.userInfoForm.value;
    const userDocRef = doc(this.firestore, 'users', user.uid);

    setDoc(userDocRef, userData, { merge: true })
      .then(() => {
        console.log('✅ User data saved successfully');
        this.router.navigate(['/profile'])
      })
      .catch((err) => console.error('❌ Error saving user data:', err));
  }
}
