const initStickyTableHeader = (tableEl: HTMLElement, height?: number) => {
    // READ

    const cellWidths = (
        Array.from(<NodeListOf<HTMLElement>>tableEl.querySelectorAll('tbody tr:first-child td'))
            .map(el => el.offsetWidth)
    );

    const tableElWidth = tableEl.offsetWidth;

    // WRITE

    const theadEl = <HTMLElement>tableEl.querySelector('thead');
    if (!theadEl) throw new Error('Could not find thead');

    const clonedTableEl = <HTMLElement>tableEl.cloneNode(true);
    const clonedTbodyEl = clonedTableEl.querySelector('tbody');
    const clonedTheadEl = clonedTableEl.querySelector('thead');
    const clonedTheadCellEls = Array.from(<NodeListOf<HTMLElement>>clonedTheadEl.querySelectorAll('th, td'));
    const wrapperEl = document.createElement('div');

    Object.assign(wrapperEl.style, {
        position: 'relative',
        overflow: 'auto',
        height: height !== undefined ? `${height}px` : undefined,
    });

    // We need to assert the width in case a scroll bar has been added.
    // This must be equal to the width of the cloned table element.
    tableEl.style.width = `${tableElWidth}px`;
    theadEl.style.visibility = 'hidden';

    Object.assign(clonedTableEl.style, {
        width: `${tableElWidth}px`,
        position: 'absolute',
        zIndex: '1',
    });
    clonedTableEl.removeChild(clonedTbodyEl)

    clonedTheadCellEls.forEach((cell, index) => {
        const width = cellWidths[index];
        if (width) {
            cell.style.width = `${width}px`;
        } else {
            throw new Error(`Width not found for index '${index}'`)
        }
    })

    const update = () => {
        requestAnimationFrame(() => {
            // READ
            const wrapperElScrollTop = wrapperEl.scrollTop;
            // WRITE
            clonedTableEl.style.top = `${wrapperElScrollTop}px`;
        });
    }
    update();

    tableEl.parentElement.appendChild(wrapperEl)
    wrapperEl.appendChild(clonedTableEl);
    wrapperEl.appendChild(tableEl);

    wrapperEl.addEventListener('scroll', update);

    const destroy = () => {
        wrapperEl.removeEventListener('scroll', update);
    };

    return destroy;
};

export default initStickyTableHeader;
