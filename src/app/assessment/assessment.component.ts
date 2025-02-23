import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AssessmentService } from '../assessment.service';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit, OnDestroy {
  form: FormGroup;
  assessment: any;
  assessmentCode: string;
  showForm: boolean = true;
  showAssessment: boolean = false;
  assessmentNotAvailable: boolean = false;
  apiResponse: any;
  loading: boolean = false;
  timer: any;
  countdown: number = 0;
  interval: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private assessmentService: AssessmentService
  ) {
    this.form = this.fb.group({
      candidateName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });

    this.assessmentCode = this.route.snapshot.params['assessmentCode'];
  }

  ngOnInit(): void {
    this.assessmentService.getAssessment(this.assessmentCode).subscribe(
      data => {
        this.assessment = data;
      },
      error => {
        this.assessmentNotAvailable = true;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.showForm = false;
      this.loading = true;

      // Simulate API request
      setTimeout(() => {
        this.loading = false;
        this.showAssessment = true;
      }, 2000); // Simulated loading time
    }
  }

  checkCode() {
    this.loading = true;

    const postData = {
      personName: this.form.get('candidateName').value,
      code: this.assessment.outline,
      assessmentcode: this.assessmentCode
    };

    this.assessmentService.checkAssessment(postData).subscribe(
      response => {
        this.apiResponse = response;
        this.loading = false;

        // Start countdown timer based on response duration
        this.countdown = this.apiResponse.duration * 60; // Convert minutes to seconds
        this.startCountdown();
      },
      error => {
        this.loading = false;
        console.error('Error:', error);
      }
    );
  }

  startCountdown() {
    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  finalSubmit() {
    // Placeholder for final submit functionality
    console.log('Final Submit');
  }
}
