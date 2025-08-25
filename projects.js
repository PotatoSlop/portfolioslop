addEventListener("DOMContentLoaded", () => {
    const hash = window.location.hash;

    if (hash) {
        const detailElement = document.querySelector(hash);
        if (detailElement && detailElement.tagName === 'DETAILS') {
            detailElement.open = true;
        }
    }
});