"use strict";
class AutoLoadContainer {
    constructor(data) {
        var _a, _b;
        this.container = document.querySelector(data.containerSelector);
        this.addButton = document.querySelector(data.addButtonSelector);
        this.removeButton = document.querySelector(data.removeButtonSelector);
        this.totalCountElement = document.querySelector(data.totalCountElementSelector);
        this.visibleCountElement = document.querySelector(data.visibleCountElementSelector);
        this.maxCountElement = document.querySelector(data.maxCountElementSelector);
        this.initialDivElements = (_a = data.initialElements) !== null && _a !== void 0 ? _a : [];
        this.maxVisibleBlocks = (_b = data.maxVisibleBlocks) !== null && _b !== void 0 ? _b : 5;
        this.blocks = [];
        this.secretElement = this.createNewElement('secretElement');
        this.initializeBlocks();
        this.initializeButtons();
    }
    initializeBlocks() {
        this.blocks = this.adjustBlocks(this.initialDivElements);
        this.updateContainerElements(this.blocks);
    }
    initializeButtons() {
        this.addButton.addEventListener('click', () => this.addBlock());
        this.removeButton.addEventListener('click', () => this.removeBlock());
    }
    adjustBlocks(elements) {
        if (this.checkMaxLengthBlocks(elements.length)) {
            return elements.map((item, index) => {
                if (index < (elements.length - this.maxVisibleBlocks)) {
                    return { element: item, isVisible: false };
                }
                else {
                    return { element: item, isVisible: true };
                }
            });
        }
        else if (this.checkMinLengthBlocks(elements.length)) {
            return [{ element: this.secretElement, isVisible: true }];
        }
        return elements.map((item) => {
            return { element: item, isVisible: true };
        });
    }
    checkMaxLengthBlocks(length) {
        if (length > this.maxVisibleBlocks) {
            return true;
        }
        return false;
    }
    checkMinLengthBlocks(length) {
        if (length === 0) {
            return true;
        }
        return false;
    }
    addBlock() {
        if (this.blocks.length === 1 && this.blocks[0].element === this.secretElement) {
            const newElement = this.createNewElement(this.blocks.length.toString());
            this.blocks[0].element = newElement;
            this.blocks[0].isVisible = true;
        }
        else {
            const newElement = this.createNewElement((this.blocks.length + 1).toString());
            const newBlock = { element: newElement, isVisible: true };
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
    removeBlock() {
        if (this.blocks.length === 1 && (this.blocks[0].element !== this.secretElement || this.blocks[0].element === this.secretElement)) {
            this.blocks[0].element = this.secretElement;
            this.blocks[0].isVisible = true;
        }
        else {
            if (this.blocks.length > this.maxVisibleBlocks) {
                this.blocks[this.blocks.length - this.maxVisibleBlocks - 1].isVisible = true;
            }
            this.blocks.pop();
        }
        this.updateContainerElements(this.blocks);
    }
    updateContainerElements(blocks) {
        this.container.innerHTML = '';
        blocks.forEach((block) => {
            if (block.isVisible) {
                this.container.appendChild(block.element);
            }
        });
        this.updateIndicators();
    }
    updateIndicators() {
        this.totalCountElement.textContent = this.blocks.length.toString();
        this.visibleCountElement.textContent = this.blocks.filter(block => block.isVisible).length.toString();
        this.maxCountElement.textContent = this.maxVisibleBlocks.toString();
    }
    createNewElement(value) {
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
