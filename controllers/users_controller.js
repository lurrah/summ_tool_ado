const { User } = require('../models/user_model.js');

class UsersController {
  constructor(){
    this.user = new User();
  };

  async getUser(req, res) {
    try {
      const code = req.query.code;
      //const user = new User();

      // get access token based on code

      const access_token = await this.user.getUserTok(code);

      //const access_token = process.env.GIT_TOK;
      //if (access_token !== null) {
        
      //}

       //get github id
      const gitId = await this.user.getGitHubId(access_token);
       //store the access_token in database

      const newUser = await this.user.getUser(gitId);
        // if it does, replace access_token

        if (newUser !== null) {
          req.session.user = {
            user_id: newUser.id,
            github_id: newUser.github_id
          }
        }
      const newTok = await this.user.createTok(gitId, access_token);

        // will user ever exist at this point?
        // will user creation happen at a different point in time than capturing access token

        
      return newUser
    } catch(err) {
      console.error("Error retrieving access token", err);
    }
  }

  async getUserPAT(req, res) {
    const user = req.session.user;
    if (user.github_id) {

        const pat = await this.user.getPAT(user.github_id);
        if (pat === null) {
          return res.redirect('/azure_auth');
        } else {
          const myHeaders = new Headers();

          const base64token = Buffer.from(`:${pat}`).toString('base64');
          myHeaders.append("Authorization", `Basic ${base64token}`);
        
          const options = {
            method: 'GET',
            headers: myHeaders
          }
          return options;
        }
        
    }
    else {
        return res.redirect('/users');
    }
  }
    
}

module.exports = { UsersController }