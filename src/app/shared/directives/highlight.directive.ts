import { Directive, ElementRef, Input, Renderer2, OnChanges } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone:false
  
})
export class HighlightDirective implements OnChanges {
  @Input() appHighlight: string = '';
  @Input() searchText: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    const element = this.el.nativeElement;
    const text = this.appHighlight || '';
    const search = this.searchText || '';

    // Resalta las coincidencias
    if (search && text.toLowerCase().includes(search.toLowerCase())) {
      this.renderer.setProperty(
        element,
        'innerHTML',
        text.replace(
          new RegExp(search, 'gi'),
          match => `<span style="background-color: yellow;">${match}</span>`
        )
      );
    } else {
      this.renderer.setProperty(element, 'innerText', text);
    }
  }
}