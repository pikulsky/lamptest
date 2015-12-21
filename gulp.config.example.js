module.exports = {
  hockeyApp: {
    platforms: {
      android: {
        id: '123123',
        file: 'android.apk'
      },
      ios: {
        id: '456456',
        file: 'ios.ipa'
      },
      wp: {
        id: '789789',
        file: 'wp8.xap'
      }
    },
    apiToken: 'secretapitoken',
    buildTeams: [1, 2, 3]
  }
};