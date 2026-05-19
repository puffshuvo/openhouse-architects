document.addEventListener('DOMContentLoaded', function() {
    initJustifiedGallery();
    // initKeyboardNavigation();
});

function initJustifiedGallery() {
    const grid = document.querySelector('.projects-grid');
    const cards = Array.from(document.querySelectorAll('.project-card'));
    const gap = 32;

    if (!grid || cards.length === 0) return;

    grid.style.opacity = '0';
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(0)';
        card.style.animation = 'none';
    });

    function calculateLayout() {
        const imagesPerRow = getImagesPerRow();
        const containerWidth = grid.offsetWidth;
        for (let i = 0; i < cards.length; i += imagesPerRow) {
            justifyRow(cards.slice(i, i + imagesPerRow), containerWidth, gap);
        }
    }

    function justifyRow(rowCards, containerWidth, gap) {
        let totalAspectRatio = 0;
        const aspectRatios = [];
        rowCards.forEach(card => {
            const img = card.querySelector('img');
            let ar = 4 / 3;
            if (img.naturalWidth > 0 && img.naturalHeight > 0) ar = img.naturalWidth / img.naturalHeight;
            aspectRatios.push(ar);
            totalAspectRatio += ar;
        });
        const availableWidth = containerWidth - gap * (rowCards.length - 1);
        rowCards.forEach((card, i) => {
            card.style.width = `${(aspectRatios[i] / totalAspectRatio) * availableWidth}px`;
            card.style.flexGrow = '0';
            card.style.flexShrink = '0';
        });
    }

    function getImagesPerRow() {
        const w = window.innerWidth;
        if (w <= 600) return 1;
        if (w <= 900) return 2;
        if (w <= 1200) return 3;
        return 4;
    }

    calculateLayout();

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            grid.style.transition = 'opacity 0.4s ease';
            grid.style.opacity = '1';
            cards.forEach((card, i) => {
                // card.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
                card.style.transform = 'translateY(20px)';
                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            });
        });
    });

    cards.forEach(card => {
        const img = card.querySelector('img');
        card.style.transition = 'width 0.4s ease, opacity 0.5s ease, transform 0.5s ease';
        const refine = () => { if (img.naturalWidth > 0) calculateLayout(); };
        if (img.complete && img.naturalWidth > 0) refine();
        else img.addEventListener('load', refine);
    });

    // let resizeTimer;
    // window.addEventListener('resize', () => {
    //     clearTimeout(resizeTimer);
    //     resizeTimer = setTimeout(() => calculateLayout(), 250);
    // });
}

// function initKeyboardNavigation() {
//     const projectCards = document.querySelectorAll('.project-card');
//     projectCards.forEach((card, index) => {
//         card.setAttribute('tabindex', '0');
//         card.addEventListener('keydown', function(e) {
//             if (e.key === 'Enter' || e.key === ' ') {
//                 e.preventDefault();
//                 const link = this.querySelector('.project-link');
//                 if (link) link.click();
//             }
//             if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
//                 e.preventDefault();
//                 if (projectCards[index + 1]) projectCards[index + 1].focus();
//             }
//             if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
//                 e.preventDefault();
//                 if (projectCards[index - 1]) projectCards[index - 1].focus();
//             }
//         });
//     });
// } 

const style = document.createElement('style');
style.textContent = `
    .project-card { position: relative; overflow: hidden; will-change: width; }
    .project-card:focus { outline: 2px solid var(--color-primary); outline-offset: 4px; }
`;
document.head.appendChild(style); 