export const environment = {
  production: true,
  wso2: {
    authorizeUri: '',
    clientId: '',
    redirectUri: encodeURIComponent('http://localhost:4200/#/login'),
    storageName: 'Wso2AuthenticationToken',
    clientSecret: '',
    tokenUri: ''
  }
};
