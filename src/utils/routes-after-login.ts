



export function redirectToBase(role: string) {

  if(role === 'ADMIN') {
    return '/app/dashboard'
  }

  return `/app/my-sales`
}