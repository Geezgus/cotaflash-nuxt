export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  const LOGIN_ROUTE_PATH = '/login'

  const auth = authStore.getToken()
  const toLogin = to.fullPath === LOGIN_ROUTE_PATH

  // if either user is authenticated but not trying to login
  // OR not authenticated but trying to login, let them do so.
  if ((auth && !toLogin) || (!auth && toLogin)) return

  // else if user is authenticated but trying to login, redirect back
  if (auth) {
    return await navigateTo(from.fullPath)
  }

  // otherwise, the user is not authenticated and not trying to login
  // so redirect to login route
  return await navigateTo(LOGIN_ROUTE_PATH)
})
