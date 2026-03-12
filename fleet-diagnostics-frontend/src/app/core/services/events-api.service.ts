import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  DiagnosticEvent,
  EventFilters,
  PaginatedResult,
  ApiResponse,
} from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventsApiService {
  private readonly base = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  getEvents(
    filters: EventFilters,
  ): Observable<PaginatedResult<DiagnosticEvent>> {
    let params = new HttpParams();

    if (filters.vehicleId) params = params.set('vehicleId', filters.vehicleId);
    if (filters.code) params = params.set('code', filters.code);
    if (filters.level) params = params.set('level', filters.level);
    if (filters.from) params = params.set('from', filters.from);
    if (filters.to) params = params.set('to', filters.to);
    if (filters.page) params = params.set('page', filters.page);
    if (filters.limit) params = params.set('limit', filters.limit ?? 20);

    return this.http
      .get<ApiResponse<PaginatedResult<DiagnosticEvent>>>(this.base, { params })
      .pipe(map((res) => res.data!));
  }

  getEventById(id: number): Observable<DiagnosticEvent> {
    return this.http
      .get<ApiResponse<DiagnosticEvent>>(`${this.base}/${id}`)
      .pipe(map((res) => res.data!));
  }
}
