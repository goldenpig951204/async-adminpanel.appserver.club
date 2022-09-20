const { updateOne } = require('../../models/setting');
const Site = require('../../models/sites');

module.exports = {
    /**
     * Get all the list of sites that use this nodeapp
     * @param {*} req 
     * @param { sites } res 
     */
    getSites: (req, res) => {
        Site.find().then(sites => res.json(sites))
            .catch(err => res.status(500).send(err.toString()));
    },
    /**
     * Get a site by id
     * @param { id } req 
     * @param { site } res 
     */
    getSite: (req, res) => {
        let { id } = req.params;
        Site.findById(id).then(site => res.json(site))
            .catch(err => res.status(500).send(err.toString()));
    },
    /**
     * Create a new site that use this nodeapp
     * @param { url, membershipApiKey } req 
     * @param { site } res 
     */
    createSite: (req, res) => {
        Site.create(req.body).then(site => res.json(site))
            .catch(err => res.status(500).send(err.toString()));
    },
    /**
     * Update an existing site by id
     * @param { id, url, membershipApiKey } req 
     * @param { site } res 
     */
    updateSite: (req, res) => {
        let { id } = req.params;
        Site.findByIdAndUpdate(id, req.body).then(updatedRow => res.json(updatedRow))
            .catch(err => res.status(500).send(err.toString()));      
    },
    /**
     * Delete an existing site that doesn't use anymore by id
     * @param { id } req 
     * @param { result } res 
     */
    deleteSite: (req, res) => {
        let { id } = req.params;
        Site.findByIdAndDelete(id).then(deletedRow => res.send(`Delete ${id} successfully.`))
            .catch(err => res.status(500).send(err.toString()));
    }
}