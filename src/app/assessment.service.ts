import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private apiUrl = 'http://13.90.102.109:5000'; // Update this with your actual backend URL


  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'x-api-key': "peiruoer#lfdjlf566034hi347904ljlfdjlsdf"
      })
    };
  }
  constructor(private http: HttpClient) {}
  
// Update this with your API endpoint


  getAssessment(assessmentCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/code-assessments/${assessmentCode}`,this.getHeaders());
  }

  checkAssessment(payload:any):Observable<any>{
    console.log(payload)
    return this.http.post(`${this.apiUrl}/code-assessments/check`,payload,this.getHeaders());
  }

  getAssessmentStatus(email: string,assessmentcode:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/code-assessments/status`, {
      ...this.getHeaders(),
      params: { assessmentcode, email }
    });
  }

  updateAssessmentStatus(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/code-assessments/status`, payload, this.getHeaders());
  }
}
