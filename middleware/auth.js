export default defineNuxtRouteMiddleware((to, from) => {
    const admin = JSON.parse(localStorage.getItem("admin"))

    // If NOT logged in and going to admin → redirect to login
    if (!admin && to.path === "/admin") {
        return navigateTo("/login")
    }
})
