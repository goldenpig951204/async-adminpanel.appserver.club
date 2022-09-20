const crypto = require('node:crypto');
const { get } = require('lodash');
const { serverLog } = require('../../services/logger');
const DvAxios = require('devergroup-request').default;

const axios = new DvAxios({
    axiosOpt: {
        timeout: 30 * 1000
    }
});
const Setting = require('../../models/setting');
const Site = require('../../models/sites');
const config = require('../../services/config');

module.exports = {
    /**
     * Login to www.semrush.com using proxy and set cookie based on the cookie of the semrush.com
     * @param { email, password } req 
     * @param { result } res 
     */
    login: (req, res) => { 
        let { email, password } = req.body;
        try {
            let body = {
                email,
                password,
                'locale': 'en',
                'source': 'semrush',
                'g-recaptcha-response': '',
                'user-agent-hash': crypto.createHash('sha1').update(email).digest('hex').substring(0, 32)
            }
            axios.instance.post(
                'https://www.semrush.com/sso/authorize',
                JSON.stringify(body),
                {
                    headers: {
                        'user-agent': '',
                        'accept': 'application/json, text/plain, */*',
                        'content-type': 'application/json;charset=UTF-8',
                        'content-length': Buffer.from(JSON.stringify(body), 'utf-8')
                    }
                }
            ).then(({data}) => {
                console.log(data);
                if (data.user_id) {
                    axios.cookieJar.getCookieString('https://www.semrush.com').then(cookie => {
                        Setting.updateOne(null, { cookie }).then(updatedRow => {
                            Setting.findOne().then(setting => {
                                config.setConfig(setting);
                                serverLog.info(`Start session with ${email} successfully.`);
                                res.send('Login successfully.');
                            });
                        });
                    });
                } else {
                    res.status(500).send('Credential is incorrect.');
                }
            }).catch(err => {
                res.status(500).send(get(err, 'response.data.message') || err.toString());
            });
        } catch (err) {
            serverLog.error(`Start session with ${email} failed: ${get(err, "response.data.message") || err.toString()}`);
            res.status(500).send(get(err, 'response.data.message') || err.toString());
        }
    },
    /**
     * Get all the settings to access to www.semrush.com
     * @param {*} req 
     * @param { setting } res 
     */
    getSetting: (req, res) => {
        Setting.findOne()
            .then(setting => res.json(setting))
            .catch(err => res.status(500).send(err.toString()));
    },
    /**
     * Set all the settings to access to www.semrush.com
     * @param { keywordOverview, domainOverviewLimit, membershipLids, membershipApiKey, userAgent, cookie } req 
     * @param { setting } res 
     */
    setSetting: (req, res) => {
        try {
            let setting = {
                ...req.body,
                keywordOverviewLimit: Number(req.body.keywordOverviewLimit),
                domainOverviewLimit: Number(req.body.domainOverviewLimit),
                membershipLids: req.body.membershipLids.split(",").map((t) => Number(t))
            }
            Setting.updateOne(null, setting).then(updatedRow => {
                Setting.findOne().then(setting => {
                    config.setConfig(setting);
                    res.json(setting);
                });
            });
        } catch (err) {
            res.status(500).send(err.toString());
        }
    },
    /**
     * Get all the list of sites that use this nodeapp
     * @param {*} req 
     * @param { sites } res 
     */
    getSites: (req, res) => {
        Site.find().then(sites => res.json(sites))
            .catch(err => res.status(500).send(err.toString()));
    }
}