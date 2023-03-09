import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragDropFile]'
})
export class DragDropFileDirective {

  @Output() fileDropped = new EventEmitter<any>();
  @HostBinding('style.background-color') private background = '#f1f8ff';
  @HostBinding('style.border-width') private borderWidth = '2px';
  // Dragover Event
  @HostListener('dragover', ['$event']) dragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.background = 'rgb(226 232 240)';
    this.borderWidth = '3px'
  }
  // Dragleave Event
  @HostListener('dragleave', ['$event']) public dragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#f1f8ff';
    this.borderWidth = '2px'
  }
  // Drop Event
  @HostListener('drop', ['$event']) public drop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#f1f8ff';
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
    this.borderWidth = '2px'
  }
}
