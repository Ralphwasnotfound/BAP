export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return;

    const isAdminRoute = to.path.startsWith("/admin");
    const isLoggedIn = sessionStorage.getItem("admin") === "true";

    if (isAdminRoute && !isLoggedIn) {
        return navigateTo("/login", { replace: true });
    }
});
