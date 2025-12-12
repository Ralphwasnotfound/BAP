export function usePageTitle(title) {
    return useHead({
        title: `${title} | BAP Federation`
    });
}
