import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AssessmentService } from '../assessment.service';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit {
  form: FormGroup;
  assessment: any;
  assessmentCode: string;
  showForm: boolean = true;
  showAssessment: boolean = false;
  assessmentNotAvailable: boolean = false;
  apiResponse:any;
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

  onSubmit() {
    if (this.form.valid) {
      this.showForm = false;
      this.showAssessment = true;
    }
  }


checkCode() {
  const postData = {
    personName: this.form.get('candidateName').value,
    code: this.assessment.outline,
    assessmentcode: this.assessmentCode
  };

  this.assessmentService.checkAssessment( postData).subscribe(
    response => {
      this.apiResponse = response;
    },
    error => {
      console.error('Error:', error);
    }
  );
}

finalSubmit() {
  // Placeholder for final submit functionality
  console.log('Final Submit');
}
}
