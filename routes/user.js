const express = require('express');
const router = express.Router();
const crypto = require('crypto');
//const session = require('express-session')


const client_id = process.env.OAUTH_CLIENT;
const client_secret = process.env.OAUTH_SECRET;

//const session_secret = process.env.SESSION;

const redirect = `https://summ-tool.azurewebsites.net/users/github`

const { PageController } = require('../controllers/page_controller.js');
const { UsersController } = require('../controllers/users_controller.js');

const pageController = new PageController();
const userController = new UsersController();


router.get('/', pageController.getUserPage);

router.get('/github', async (req, res) => {
    try {
        const state = crypto.randomBytes(16).toString('hex');
        req.session.oauthState = state;

        const link = `https://github.com/login/oauth/authorize?client_id=${client_id}&response_type=code&scope=user&redirect_uri=${redirect}/callback&state=${state}`;
        res.redirect(link)
    } catch (err) {
        console.error("Error logging into github", err);
    }
})

router.get('/github/callback', async (req, res) => {
    try {
        const receivedState = req.query.state;

        const storedState = req.session.oauthState;

        if (receivedState !== storedState) {
            return res.status(400).send('Invalid state parameter.');
        }
        const user = await userController.getUser(req, res);
        if (user !== null) {
          res.redirect('/')
        } else {
          res.status(401).send('Unauthorized');
        }
      } catch (error) {
        console.error('Error: ', error)
        res.status(500).send('Error with GitHub OAuth');
      }
})

router.get('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Could not log out.');
    }

    //res.clearCookie('connect.sid');
    res.redirect('/users');
  })
})
//router.get('/oauth', loginController.authUser)
module.exports = router;
