import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private storageReady: Promise<Storage>;
  private API = 'http://172.16.64.120:8080/api_activos_v2/public';

  private isLoggingOut = false; // 👈 evita múltiples ejecuciones

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router
  ) {
    this.storageReady = this.storage.create();
  }

  login(data: { email: string, password: string }) {
    return this.http.post<any>(`${this.API}/auth`, data);
  }

  async setToken(token: string) {
    const storage = await this.storageReady;
    await storage.set('token', token);
  }

  async getToken(): Promise<string | null> {
    const storage = await this.storageReady;
    return storage.get('token');
  }

  // 🔥 logout GLOBAL (ya redirige)
  async logout() {
    if (this.isLoggingOut) return; // 👈 evita loops
    this.isLoggingOut = true;

    const storage = await this.storageReady;
    await storage.remove('token');

    this.router.navigateByUrl('/login', { replaceUrl: true });

    setTimeout(() => this.isLoggingOut = false, 1000);
  }

  // ✅ validar si hay sesión
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  // ⏱️ validar expiración JWT
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch (e) {
      return true;
    }
  }
}