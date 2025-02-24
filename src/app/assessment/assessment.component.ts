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
  countdown: number = 0;
  interval: any;
  interval2:any;
  displayTime: string = '';
  timerStart: number = 0;
  remainingTime: number = 0;
  started: boolean = false;
  completed: boolean = false;
  finalsubmit:boolean=false;
  
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
        this.countdown = Number(this.assessment.duration) * 60; // Convert minutes to seconds
        console.log(this.countdown, "is the countdown");
     
       this.interval2 = setInterval(() => {
          if (this.started) {
            this.postStatus();
          }
        }, 60000); // 60000 ms = 1 minute
      },
      error => {
        this.assessmentNotAvailable = true;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.interval) {
      cancelAnimationFrame(this.interval);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.showForm = false;
      this.loading = true;
      this.showAssessment = false;
      this.apiResponse = null;
      this.getAssessmentStatus(this.form.get('email').value, this.assessmentCode);
      // Simulate API request
      setTimeout(() => {
        this.loading = false;
        this.showAssessment = true;
        this.timerStart = Date.now();
        this.remainingTime = this.countdown;
        this.startCountdown();
        this.started = true;
      }, 2000); // Simulated loading time
    }
  }

  checkCode() {
    this.loading = true;
    this.showAssessment = false;

    const postData = {
      personName: this.form.get('candidateName').value,
      code: this.assessment.outline,
      assessmentcode: this.assessmentCode
    };

    this.assessmentService.checkAssessment(postData).subscribe(
      response => {
        this.apiResponse = response;
        this.loading = false;
        this.showAssessment = true;
        if(this.finalsubmit){
        
        if(this.apiResponse.resultType == 'compile error'
           || this.apiResponse.result == 'exception') {
          this.finalStatus(this.apiResponse.resultType);
        }
        else {
          this.finalStatus(this.apiResponse.value+"/10");
        }
      }
        // Start countdown timer based on response duration
      
      },
      error => {
        this.loading = false;
        this.showAssessment = true;
        console.error('Error:', error);
      }
    );
  } 



  startCountdown() {
    //this.updateDisplayTime();
    const update = () => {
      const elapsed = Math.floor((Date.now() - this.timerStart) / 1000);
      this.countdown = this.remainingTime - elapsed;
      this.updateDisplayTime();

      if (this.countdown > 0) {
        this.interval = requestAnimationFrame(update);
      } else {
        this.completed = true;
        this.finalsubmit=true;
        this.checkCode();
        cancelAnimationFrame(this.interval);
      }
    };
  /*  this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
        this.updateDisplayTime();
      } else {
        this.completed = true;
        this.checkCode();
        clearInterval(this.interval);
      }
    }, 1000);*/
    update();
  }

  updateDisplayTime() {
    const minutes: number = Math.floor(this.countdown / 60);
    const seconds: number = this.countdown % 60;
    this.displayTime = `${minutes}m ${seconds < 10 ? '0' + seconds : seconds}s`;
  }

  finalSubmit() {
    // Placeholder for final submit functionality
    this.finalsubmit=true;
    this.checkCode();
    console.log('Final Submit');
  }

  getAssessmentStatus(email: string, assessmentCode: string) {
    this.assessmentService.getAssessmentStatus(email, assessmentCode).subscribe(
      status => {
        if (status && status.duration) {
          if(status.status == 'completed') {
            this.completed = true;
            this.finalsubmit=true;
          }
          else{
          this.countdown = Number(status.duration) * 60; // Convert minutes to seconds
          console.log(this.countdown, "is the updated countdown from status");
          }
        }
      },
      error => {
        console.error('Error fetching assessment status:', error);
      }
    );
  }

  postStatus() {
  if(!this.finalsubmit){
    const postData = {
      email: this.form.get('email').value,
      assessmentcode: this.assessmentCode,
      candidateName: this.form.get('candidateName').value,
      phoneNumber: this.form.get('phoneNumber').value,
      status: 'active',
      duration: Math.floor(this.countdown / 60), // Convert seconds to minutes
      result: 'Not Evaluated',
      code: this.assessment.outline
    };

    this.assessmentService.updateAssessmentStatus(postData).subscribe(
      response => {
        console.log('Status posted successfully:', response);
      },
      error => {
        console.error('Error posting status:', error);
      }
    );
  }
  }

  finalStatus(result: string) {
    const postData = {
      email: this.form.get('email').value,
      assessmentcode: this.assessmentCode,
      candidateName: this.form.get('candidateName').value,
      phoneNumber: this.form.get('phoneNumber').value,
      status: 'completed',
      duration: Math.floor(this.countdown / 60), // Convert seconds to minutes
      result: result,
      code: this.assessment.outline
    };

    this.assessmentService.updateAssessmentStatus(postData).subscribe(
      response => {
        console.log('Final status posted successfully:', response);
        this.completed = true;
      },
      error => {
        console.error('Error posting final status:', error);
      }
    );
  }
/*
  ngOnInit(): void {
    this.assessmentService.getAssessment(this.assessmentCode).subscribe(
      data => {
        this.assessment = data;
        this.countdown = Number(this.assessment.duration) * 60; // Convert minutes to seconds
        console.log(this.countdown, "is the countdown");
        this.getAssessmentStatus(this.form.get('email').value, this.assessmentCode);

        // Post status every 1 minute
        setInterval(() => {
          if (this.started) {
            this.postStatus();
          }
        }, 60000); // 60000 ms = 1 minute
      },
      error => {
        this.assessmentNotAvailable = true;
      }
    );
  }*/
}

