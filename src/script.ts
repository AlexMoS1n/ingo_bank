interface IBlock {
    element: HTMLDivElement;
    isVisible: boolean;
}

interface IData {
  containerSelector: string,
  addButtonSelector: string,
  removeButtonSelector: string,
  totalCountElementSelector: string;
  visibleCountElementSelector: string;
  maxCountElementSelector: string;
  initialElements?: HTMLDivElement[],
  maxVisibleBlocks?: number,
}

class AutoLoadContainer {
  private container: HTMLElement;
  private addButton: HTMLButtonElement;
  private removeButton: HTMLButtonElement;
  private blocks: IBlock[];
  private totalCountElement: HTMLElement;
  private visibleCountElement: HTMLElement;
  private maxCountElement: HTMLElement;
  private initialDivElements: HTMLDivElement[];
  private maxVisibleBlocks: number;
  private secretElement: HTMLDivElement;

  constructor( data: IData ) {
      this.container = document.querySelector(data.containerSelector) as HTMLElement;
      this.addButton = document.querySelector(data.addButtonSelector) as HTMLButtonElement;
      this.removeButton = document.querySelector(data.removeButtonSelector) as HTMLButtonElement;
      this.totalCountElement = document.querySelector(data.totalCountElementSelector) as HTMLElement;
      this.visibleCountElement = document.querySelector(data.visibleCountElementSelector) as HTMLElement;
      this.maxCountElement = document.querySelector(data.maxCountElementSelector) as HTMLElement;
      this.initialDivElements = data.initialElements ?? [];
      this.maxVisibleBlocks = data.maxVisibleBlocks ?? 5;

      this.blocks = [];
      this.secretElement = this.createNewElement('secretElement');
      this.initializeBlocks();
      this.initializeButtons();
  }

  private initializeBlocks(): void {
    this.blocks = this.adjustBlocks(this.initialDivElements);
    this.updateContainerElements(this.blocks)
  }

  private initializeButtons(): void {
    this.addButton.addEventListener('click', () => this.addBlock());
    this.removeButton.addEventListener('click', () => this.removeBlock());
  }

  private adjustBlocks(elements: HTMLDivElement[]): IBlock[] {
    if(this.checkMaxLengthBlocks(elements.length)) {
      return elements.map((item, index) => {
        if (index < (elements.length - this.maxVisibleBlocks)) {
          return {element: item, isVisible: false}
        }
        else { return {element: item, isVisible: true} }
      }) 
    }
    else if(this.checkMinLengthBlocks(elements.length)) {
      return [{ element: this.secretElement, isVisible: true }];
    }
    return elements.map((item) => {
      return { element: item, isVisible: true }
    })
  }
  
  private checkMaxLengthBlocks(length: number): Boolean {
    if(length > this.maxVisibleBlocks) { return true }
    return false
  }

  private checkMinLengthBlocks(length: number): Boolean {
    if(length === 0) { return true }
    return false
  }

  public addBlock(): void {    
    if (this.blocks.length === 1 && this.blocks[0].element === this.secretElement) {
        const newElement = this.createNewElement(this.blocks.length.toString());
        this.blocks[0].element = newElement;
        this.blocks[0].isVisible = true;
    } else {
        const newElement = this.createNewElement((this.blocks.length + 1).toString());
        const newBlock: IBlock = { element: newElement, isVisible: true };
        this.blocks.push(newBlock);
        const visibleBlocks = this.blocks.filter(block => block.isVisible);
        if (visibleBlocks.length > this.maxVisibleBlocks) {
            const firstVisibleBlock = this.blocks.find(block => block.isVisible);
            if (firstVisibleBlock) {
                firstVisibleBlock.isVisible = false;
            }
        }
    }
    this.updateContainerElements(this.blocks);
  }

  public removeBlock(): void {
    if (this.blocks.length === 1 && (this.blocks[0].element !== this.secretElement || this.blocks[0].element === this.secretElement)) {
        this.blocks[0].element = this.secretElement;
        this.blocks[0].isVisible = true;
    } else {
        if(this.blocks.length > this.maxVisibleBlocks) {
          this.blocks[this.blocks.length-this.maxVisibleBlocks-1].isVisible=true;
        }
        this.blocks.pop();
    }
    this.updateContainerElements(this.blocks);
  }


  private updateContainerElements(blocks: IBlock[]) {
    this.container.innerHTML = ''
    blocks.forEach((block) => {
      if (block.isVisible) {
            this.container.appendChild(block.element);
        }
    });
    this.updateIndicators();
  }

  private updateIndicators() {
    this.totalCountElement.textContent = this.blocks.length.toString();
    this.visibleCountElement.textContent = this.blocks.filter(block => block.isVisible).length.toString();
    this.maxCountElement.textContent = this.maxVisibleBlocks.toString();
  }

  private createNewElement(value: string): HTMLDivElement {
    const block = document.createElement('div');
    block.className = 'block';
    block.textContent = value;
    return block;
  }
}

document.addEventListener('DOMContentLoaded', () => {
    const container = new AutoLoadContainer({
      containerSelector: '#blocks-container',
      addButtonSelector: '#add-btn',
      removeButtonSelector: '#remove-btn',
      totalCountElementSelector: '#total-count',
      visibleCountElementSelector: '#visible-count',
      maxCountElementSelector: '#max-count',
      maxVisibleBlocks: 5,
    });
});