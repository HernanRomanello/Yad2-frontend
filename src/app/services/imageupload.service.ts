import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageuploadService {
  constructor(private httpClient: HttpClient) {}
  Url = environment.apiUrl;

  uploadImage(image: File) {
    const formData = new FormData();
    formData.append('file', image);
    return firstValueFrom(
      this.httpClient.post<{ fileUrl: string }>(
        `${this.Url}api/ImageUpload/UploadImage`,
        formData,
      ),
    );
  }

  async uploadImageAndGetUrl(image: File): Promise<string> {
    const response = await this.uploadImage(image);
    return response.fileUrl;
  }
}
