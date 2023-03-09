import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environment';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css']
})
export class AddDocumentComponent {
  @ViewChild('file')
  file!: ElementRef

  constructor(private fb: FormBuilder) {}

  public contracts = [{
    value: 'BILL_OF_LADING',
    label: 'Bill of Lading'
  }]

  public types = [{
    value: 'HANSA_TANKER',
    label: 'Hansa Tanker'
  }]

  public submitting = false;

  // public analysis: any = {"SHIPPER":"AAA OILS AND FATS PTE LTD, 80 RAFFLES PLACE, HEX 50-01 UOB PLAZA 1, SINGAPORE 048624","RECEIVER_ADDRESS":"HOUSE NO. 103, DEFENCE HOUSING OFFICER SOC\nHYDERABAD, PAKISTAN","BILL_NUMBER":"PDG/PQ-213","ICB_NOS":"9911DB434","EORI_NOS":"FINO1101031450123","UK_EORI":"GB 079218193000","SCAC_CODE":"HAKE AAA YYAA CCZZ","TANK_NAME":"MT SONGA CHALLENGE VOY 2205","DELIVERY_PORT":"PORT QASIM, PAKISTAN","TANK_CAPTAIN":"CAPT. ALEXIS CALIXTO L. BRAGAIS","COMMODITY_NAME":"RBD PALM OLEIN IN BULK","COMMODITY_QUANTITY":"250 M.TONS","LOADING_PORT":"PORT KLANG, MALAYSIAAS AT PADANG, INDONESIA"};

  public analysis: any = null;
  public selectedFile = null;
  public fileTouched = false

  public form = this.fb.group({
    contract: this.fb.control('', Validators.required),
    type: this.fb.control('', Validators.required),
  })

  get values() {
    return Object.keys(this.analysis as any).map(item => {
      const label = item.split('_').join(' ')
      return {label, value: (this.analysis as any)[item]}
    })
  }

  cancel() {
    this.analysis = null
    this.selectedFile = null
    this.fileTouched = false
    this.form.reset()
    this.form.get('contract')?.patchValue('')
    this.form.get('type')?.patchValue('')
  }

  openFileHandler() {
    this.file.nativeElement.click()
  }

  fileSelected(event: any) {
    this.fileTouched = true
    const [file] = event.target.files
    if(!file) {
      return;
    }
    this.selectedFile = file;
  }

  fileDropped(event: any) {
    const [file] = event
    if(file.name.split('.').pop() !== 'pdf') {
      return
    }
    this.selectedFile = file;
  }

  async onSubmit() {
    this.fileTouched = true;
    if(this.form.invalid) {
      return;
    }

    if(!this.selectedFile) {
      return
    }

    const extension = (this.selectedFile['name'] as string).split('.').pop()
    if(!extension) {
      return
    }

    this.submitting = true

    const file = await this.uploadToS3().catch(e => {
      this.submitting = false
    })

    const response = await fetch(environment.API_URL + 'textract/analyze', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        "Accept": 'application/json'
      },
      body: JSON.stringify({
        contract: this.form.get('contract')?.value,
        type: this.form.get('type')?.value,
        file: file
      })
    }).then(res => res.json()).catch(e => {
      this.submitting = false
    })
    this.submitting = false

    this.analysis = response.payload
    return;
  }

  getFileName() {
    if(!this.selectedFile) {
      return null
    }
    return this.selectedFile['name']
  }

  async uploadToS3() {
    const signedUrl = await fetch(environment.API_URL + 'prepare-signed-url', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        "Accept": 'application/json'
      },
      body: JSON.stringify({
        for: 'textract',
        file: {
          extension: '.pdf'
        }
      })
    }).then(res => res.json())

    await fetch(signedUrl.payload.signedUrl, {
      method: 'PUT',
      body: this.selectedFile,
      headers: {
        'Content-Type': 'application/pdf',
        'Accept': 'application/json'
      },
    })

    return signedUrl.payload.key;
  }
}
