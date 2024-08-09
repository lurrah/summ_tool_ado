const express = require('express');
const router = express.Router();

const { PageController } = require('../controllers/page_controller.js');
const { WorkItemController } = require('../controllers/workitem_controller.js');
const { DbController } = require('../controllers/db_controller.js');
const { SelectController } = require('../controllers/select_controller.js');
const { isAuthorized } = require('../middleware/authorization.js')

// Controllers
const pageController = new PageController();
const selectController = new SelectController();
const workItemController = new WorkItemController();
const dbController = new DbController();


// View pages
router.get('/', isAuthorized, pageController.getIndexPage)


// Internal Endpoints
router.get('/projects', isAuthorized, selectController.getProjectList.bind(selectController));

router.get('/teams', isAuthorized, selectController.getTeamList.bind(selectController));

router.get('/sprints', isAuthorized, selectController.getSprintList.bind(selectController));

router.get('/generate-summary', isAuthorized, async (req, res) => workItemController.generateSummary(req, res));

router.get('/regenerate-summary', isAuthorized, async (req, res) => workItemController.regenerateSummary(req, res));

// handles version selection from pagination
router.get('/version/count', isAuthorized, async (req, res) => dbController.getVersionCount(req, res));

router.get('/version/specific', isAuthorized, async (req, res) => dbController.getVersionSpecific(req, res));

 router.get('/prompt', isAuthorized, async (req, res) => dbController.getPrompt(req, res));

module.exports = router;
