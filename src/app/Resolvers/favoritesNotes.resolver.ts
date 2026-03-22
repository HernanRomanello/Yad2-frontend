import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserNoteModel } from '../shared/models/UserNoteModel';
import { environment } from '../../environments/environment.development';

export const favoritesNotesResolver: ResolveFn<UserNoteModel[]> = (
  route,
  state,
) => {
  const httpClient = inject(HttpClient);
  const URL = environment.apiUrl;

  return httpClient.get<UserNoteModel[]>(`${URL}api/Users/user/GetNotes`);
};
