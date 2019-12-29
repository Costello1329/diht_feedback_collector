const isMobile = (window: any, width: number) => {
    return window.matchMedia(`screen and (max-width: ${width}px)`).matches
};

export {
    isMobile
}