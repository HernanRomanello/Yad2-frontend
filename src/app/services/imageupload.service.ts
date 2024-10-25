import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageuploadService {
  constructor(private httpClient: HttpClient) {}
  Url = environment.URl;

  uploadImage(image: File) {
    const formData = new FormData();
    formData.append('photo', image);
    return firstValueFrom(
      this.httpClient.post<{ fileUrl: string }>(
        `${this.Url}api/ImageUpload/UploadImage`,
        formData
      )
    );
  }
}
