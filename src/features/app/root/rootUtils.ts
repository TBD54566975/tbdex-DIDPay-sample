function getPrettyRouteName(route: string) {
  switch (route) {
    case '/':
      return 'Index';
    case '/verifiablecredentials':
      return 'Verifiable Credentials';
    case '/offerings':
      return 'Offerings';
    case '/quotes':
      return 'Quotes';
    case '/orders':
      return 'Orders';
    case '/profile':
      return 'Profile';
    default:
      return 'Unknown';
  }
}

function getDrawerLinkURL(route: string) {
  return route.toLowerCase().replace(/\s/g, '');
}

export const RootUtils = { getDrawerLinkURL, getPrettyRouteName };
