const wrap = (el: Element, wrapperEl: Element) => {
    el.parentElement.appendChild(wrapperEl)
    wrapperEl.appendChild(el);
};

const initStickyTableHeader = (tableEl: HTMLTableElement, height?: number): { destroy: () => void, applyColumnWidths: () => void } => {
    // WRITE

    const theadEl = tableEl.querySelector('thead');
    if (!theadEl) throw new Error('Could not find thead');
    const tbodyEl = tableEl.querySelector('tbody');
    if (!tbodyEl) throw new Error('Could not find tbody');

    const clonedTheadEl = <HTMLElement>theadEl.cloneNode(true);
    const theadCellEls = Array.from(<NodeListOf<HTMLElement>>theadEl.querySelectorAll('th, td'));
    const wrapperEl = document.createElement('div');

    Object.assign(wrapperEl.style, {
        position: 'relative',
        overflow: 'auto',
        height: height !== undefined ? `${height}px` : undefined,
    });

    clonedTheadEl.style.visibility = 'hidden';

    Object.assign(theadEl.style, {
        position: 'absolute',
        zIndex: '1',
    });

    wrap(tableEl, wrapperEl);

    tableEl.insertBefore(clonedTheadEl, tbodyEl);

    const applyOffset = () => {
        // READ
        const wrapperElScrollTop = wrapperEl.scrollTop;
        // WRITE
        theadEl.style.top = `${wrapperElScrollTop}px`;
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
            theadEl.style.width = `${tableElWidth}px`;
            theadCellEls.forEach((cell, index) => {
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
