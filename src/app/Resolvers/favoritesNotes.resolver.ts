import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { UserNoteModel } from '../shared/models/UserNoteModel';

export const favoritesNotesResolver: ResolveFn<UserNoteModel[]> = (
  route,
  state
) => {
  const httpClient = inject(HttpClient);
  const url = environment.URl;

  return httpClient.get<UserNoteModel[]>(`${url}api/Users/user/GetNotes`);
};
