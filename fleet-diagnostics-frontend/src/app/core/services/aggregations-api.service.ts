import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  EventsByVehicle,
  EventsByCode,
  CriticalVehicle,
} from '../models/aggregation.model';
import { ApiResponse } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class AggregationsApiService {
  private readonly base = `${environment.apiUrl}/aggregations`;

  constructor(private http: HttpClient) {}

  getByVehicle(from?: string, to?: string): Observable<EventsByVehicle[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http
      .get<
        ApiResponse<EventsByVehicle[]>
      >(`${this.base}/by-vehicle`, { params })
      .pipe(map((res) => res.data!));
  }

  getByCode(from?: string, to?: string): Observable<EventsByCode[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http
      .get<ApiResponse<EventsByCode[]>>(`${this.base}/by-code`, { params })
      .pipe(map((res) => res.data!));
  }

  getCriticalVehicles(): Observable<CriticalVehicle[]> {
    return this.http
      .get<ApiResponse<CriticalVehicle[]>>(`${this.base}/critical`)
      .pipe(map((res) => res.data!));
  }
}
