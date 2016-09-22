const initStickyTableHeader = (tableEl: HTMLTableElement, height?: number): { destroy: () => void, applyColumnWidths: () => void } => {
    // WRITE

    const theadEl = tableEl.querySelector('thead');
    if (!theadEl) throw new Error('Could not find thead');
    const tbodyEl = tableEl.querySelector('tbody');
    if (!tbodyEl) throw new Error('Could not find tbody');

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

    theadEl.style.visibility = 'hidden';

    Object.assign(clonedTableEl.style, {
        position: 'absolute',
        zIndex: '1',
    });
    clonedTableEl.removeChild(clonedTbodyEl)

    tableEl.parentElement.appendChild(wrapperEl)
    wrapperEl.appendChild(clonedTableEl);
    wrapperEl.appendChild(tableEl);

    const applyOffset = () => {
        // READ
        const wrapperElScrollTop = wrapperEl.scrollTop;
        // WRITE
        clonedTableEl.style.top = `${wrapperElScrollTop}px`;
    }

    const applyColumnWidths = () => {
        const firstRowEl = tbodyEl.querySelector('tr');

        if (firstRowEl) {
            // READ
            const cellWidths = (
                Array.from(firstRowEl.querySelectorAll('td'))
                    .map(el => el.offsetWidth)
            );
            const tableElWidth = tableEl.offsetWidth;

            // WRITE
            clonedTableEl.style.width = `${tableElWidth}px`;
            clonedTheadCellEls.forEach((cell, index) => {
                const width = cellWidths[index];
                if (width) {
                    cell.style.width = `${width}px`;
                } else {
                    throw new Error(`Width not found for index '${index}'`)
                }
            })
        }
    }

    applyOffset();
    applyColumnWidths();

    const scrollHandler = () => requestAnimationFrame(applyOffset);
    wrapperEl.addEventListener('scroll', scrollHandler);

    const destroy = () => {
        wrapperEl.removeEventListener('scroll', scrollHandler);
    };

    return { destroy, applyColumnWidths };
};

export default initStickyTableHeader;
