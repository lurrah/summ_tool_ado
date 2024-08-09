const express = require('express');
const router = express.Router();

const { PageController } = require('../controllers/page_controller.js');
const { AzureAuthController } = require('../controllers/azure_auth_controller.js');
const { isAuthorized } = require('../middleware/authorization.js');

const pageController = new PageController();
const authController = new AzureAuthController();

router.get('/', isAuthorized, pageController.getPATPage);

router.post('/pat', isAuthorized, authController.savePAT);

module.exports = router;