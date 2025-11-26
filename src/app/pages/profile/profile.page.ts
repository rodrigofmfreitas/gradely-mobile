// profile.page.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth';
import {
  DocumentData,
  DocumentReference,
  Firestore, // Modular Firestore service type
  doc,
  docData // Modular function
} from '@angular/fire/firestore';
import { Subscription, Observable } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { User } from '@angular/fire/auth';

// Interface for user data to ensure type safety
interface UserProfile {
  fullName: string;
  college: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  graduation: string; // Added graduation field
  [key: string]: any;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false, // Confirmed non-standalone
})
export class ProfilePage implements OnInit, OnDestroy {

  profileImage: string | null = null;

  // Data holder - explicitly typed
  userData: UserProfile | null = null;

  private userSub: Subscription | null = null;

  // 1. Reverted to Constructor Injection (for non-standalone component)
  constructor(
    private auth: AuthService,
    private firestore: Firestore // Use the modular Firestore type
  ) { }

  ngOnInit() {
    this.fetchUserProfile();
  }

  ngOnDestroy(): void {
      this.userSub?.unsubscribe();
  }

  fetchUserProfile() {
    this.userSub = this.auth.authState.pipe(
      filter((user: User | null): user is User => !!user),

      switchMap((user: User) => {
        const userDocRef = doc(this.firestore, 'users', user.uid) as DocumentReference<UserProfile, DocumentData>;
        return docData<UserProfile>(userDocRef);
      })
    ).subscribe({
      next: (profileData: UserProfile | undefined) => {
        this.userData = profileData ?? null;
        console.log('Profile data loaded:', this.userData);
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
        this.userData = null;
      }
    });
  }

  changePhoto() {
    console.log('Changing photo...');
  }

  get fullAddress(): string {
    if (!this.userData) return 'N/A';

    const { street, number, complement, neighborhood, city, state } = this.userData;

    let addressParts = [];
    if (street) addressParts.push(street + (number ? `, ${number}` : ''));
    if (complement) addressParts.push(complement);
    if (neighborhood) addressParts.push(neighborhood);
    if (city || state) addressParts.push(city + (state ? `/${state}` : ''));

    return addressParts.filter(Boolean).join(' - ') || 'Endereço não preenchido';
  }
}
