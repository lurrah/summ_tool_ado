const { User } = require('../models/user_model.js'); 

class AzureAuthController {
    constructor () {
    }

    async savePAT(req, res) {
        try {
            const pat = req.body.pat;

            // get user information
            const userModel = new User();
            let user = req.session.user;
            const github_id = user.github_id;

            user = await userModel.postPAT(github_id, pat);
            
            if (user.ado_pat === pat) {
                return res.json({pat: pat});
            }
            else {
                return res.json({pat: 'invalid'});
            }
        } catch (err) {
            console.error("Error saving ADO PAT", err);
        }
    }
}

module.exports = { AzureAuthController }