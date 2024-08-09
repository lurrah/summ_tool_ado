const client_id = process.env.OAUTH_CLIENT;
const client_secret = process.env.OAUTH_SECRET;

const redirect = `https://summ-tool.azurewebsites.net/users/github`

const { userModel, tokenModel } = require('./db_models.js')

class User {
  constructor() {
  }

  async authUser(req, res) {
    try {
      const state = await crypto.randomBytes(16).toString('hex');
      localStorage.setItem("latestCSRFToken", state);

      // go to link
      const link = `https://github.com/login/oauth/authorize?client_id=${client_id}&response_type=code&scope=repo&redirect_uri=${redirect}/callback`;
      window.location.assign(link);
    } catch (error) {
      res.status(500).send('Error logging into GitHub');
    }
  }

  async getUserTok(code) {
    try {
        //const code = req.query.code;
        
        const response = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: client_id,
            client_secret: client_secret,
            code: code,
            redirect_uri: `${redirect}/callback`
          }),
        });

        const data = await response.json();
        console.log(data);
        return data.access_token;
      } catch (err) {
        console.error('Error with GitHub OAuth', err)
      }
  }

  async getUser(id) {
    try {
      let user = await userModel.findOrCreate({
        where: { github_id: id }
      });

      return user[0];
    } catch(err) {
      console.error("Error creating new user: ", err);
    }
  }

  async getGitHubId(access_token) {
    try {
      const response = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`
        } 
      })

      if (!response.ok) {
        throw new Error("Could not get GitHub information");
      }
      else {
        const data = await response.json();
        return data.id;
      }

    } catch(err) {
      console.error("Error getting github information", err);
    }
  }

  async createTok(id, access_token) {
    try {
      let token = await tokenModel.findOne({
        where: { 
          user_id: id,
        }
      });
      
      if (token === null) {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 10800000 ) // 3 hours in milliseconds

        token = await tokenModel.create({ user_id: id, access_token: access_token, expires_at: expiresAt})
        await token.save();
      } 
    } catch(err) {
      console.error("Error creating access token:", err);
    }
  }

  async postPAT(github_id, pat) {
    try {
      let user = await userModel.findOne({
        where: {
          github_id: github_id,
        }
      })

      if (user === null) {
        throw new Error('User does not exist');
      }
      if (user !== null && user.ado_pat === pat) {
        return user;
      } else {
        user.ado_pat = pat;
        user = await user.save();     
        return user; 
      } 
    } catch (err) {
      console.error('Error with PAT:', err);
    }
  }

  async getPAT(github_id) {
    try {

      let user = await userModel.findOne({
        where: {
          github_id: github_id,
        }
      })

      if (user === null) {
        throw new Error('User does not exist');
      } else if (user.ado_pat === null) {
        return null;
      } else {
        return user.ado_pat;
      }

    } catch(err) {
      console.error('Error getting PAT: ', err);
    }
  }
}

module.exports = { User }
