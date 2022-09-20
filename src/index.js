const app = require('./app');
const port = process.env.PORT || 3000;
const connect = require('./models');
const Setting = require('./models/setting');
const config = require('./services/config');

/** Start Admin Node Server */
const start = () => {
  /** Connect Database */
  connect().then(() => {
    /** Getting Setting From Database */
    Setting.findOne().then(setting => {
      if (!setting) {
        let setting = {
          membershipLids: [2, 3],
          membershipApiKey: 'acnHdSvZkL7t45GZgEf9muzE6Q',
          domainOverviewLimit: 5,
          keywordOverviewLimit: 5,
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
          cookie: ""
        }
        Setting.create(setting).then(result => {
          config.setConfig(setting);
        }).catch(err => console.log('Error ===> : ', err.toString()));
      } else {
        config.setConfig(setting);
      }
      app.listen(port, () => console.log(`Server listening ===> : https://${process.env.DOMAIN}`));
    });
  }, err => console.log('Error ===> : ', err.toString()));
}

start();
