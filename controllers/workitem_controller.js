/*  
 *  Controllers for the models that interact with ADO APIs
 */

const { WorkItemInfo } = require('../models/workiteminfo_model.js')
const { AiResponse } = require('../models/ai_model.js');
const { DbController } = require('../controllers/db_controller.js');
const { UsersController } = require('../controllers/users_controller.js');
const { org } = require('../configs/config.js')

const dbController = new DbController();

class WorkItemController {
    constructor() {
        this.user = new UsersController();
    };

    // Generates summary or pulls from database if previous summary exists
    async generateSummary(req, res) {
        try {
            const options = await this.user.getUserPAT(req, res);

            const id = req.headers.id;
            const team = req.headers.team;
            const proj = req.headers.proj;
            const user = req.session.user.github_id;

            let { count, rows } = await dbController.getNumResponses(user, id);

            // Check if entry already exists
            if ( count !== 0 ) {
                return res.json(rows[count - 1]);
            } else {
                const response = await this.getWorkItems(user, id, team, proj, options);
                if (response === 'No workitems found.') {
                    return res.status(404).json({ message: 'No workitems found.'});
                }

                res.json(response);
            }
        } catch (err) {
            console.error('Error generating summary: ', err);
        }
    }
    
    async regenerateSummary(req, res) {
        try {
            const id = req.headers.id;
            const team = req.headers.team;
            const proj = req.headers.proj;
            const user = req.session.user.github_id;
            const options = await this.user.getUserPAT(req, res);

            const response = await this.getWorkItems(user, id, team, proj, options);
            if (response === 'No workitems found.') {
                return res.status(404).json({ message: 'No workitems found.'});
            }

            res.json(response);
        } catch (err) {
            console.error('Error regenerating summary: ', err);
        }
    }


    // actions
    async getWorkItems(user, id, team, proj, options) {
        try {
            let { count } = await dbController.getNumResponses(user, id);

            const itemsInstance = new WorkItemInfo(org, proj, id, team, options);

            // Get work items and their information. Also puts them into database
            let itemList = await itemsInstance.getItemList();
            itemList = await itemsInstance.mapItemInfo(itemList);

            if (itemList === null || itemList === '') {
                return 'No workitems found.';
            }
                     
            // AI
            let ai_response = new AiResponse(user, id, itemList, count + 1);
            const summary = await ai_response.handleAiResp();

            return summary;
        } catch (err) {
            console.error('Error getting workitems: ', err);
            throw err;
        }
    }
}

module.exports = { WorkItemController }