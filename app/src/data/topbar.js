export const navigation = [
  { name: 'Home', href: '/', current: true }
]

export const navigationConnected = [
    ...navigation,
  { name: 'Profile', href: '/profile', current: false },
  { name: 'New', href: '/article/new', current: false },
]