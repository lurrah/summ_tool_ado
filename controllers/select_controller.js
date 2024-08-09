const { org } = require('../configs/config.js');
const { Select } = require('../models/select_model.js');
const { UsersController } = require('../controllers/users_controller.js');

class SelectController {
    constructor(){
        this.org = org;
        this.user = new UsersController();
    };

    async getProjectList(req, res) {
        try {
            // Project list will always be called first
            const options = await this.user.getUserPAT(req, res);
            
            if (!options || res.headersSent) {
                return null;
            }
            this.select = new Select(this.org, options);
            const projList = await this.select.fetchProjects();
            
            if (projList.status === 401) {
                return res.status(401).json({message: 'Unauthorized to view projects'});
            } else if (projList.status === 404 ) {
                return res.status(404).json({message: 'Your current ADO PAT is invalid. Please enter a new one.'});
            }
            res.json(projList);
        } catch (err) {
            console.error('Error getting projects: ', err);
            throw err;
        }    
    }

    async getTeamList(req, res) {
        try {
            const proj = req.headers.proj;

            const teamList = await this.select.fetchTeams(proj);

            if (teamList === 401) {
                return res.status(401).json({error: 'Unauthorized to view teams'});
            }

            res.json(teamList);
        } catch (err) {
            console.error('Error getting teams: ', err);
            throw err;
        }
    }

    async getSprintList(req, res) {
        try {
            const proj = req.headers.proj;
            const team = req.headers.team;

            const sprintList = await this.select.fetchSprints(proj, team);
            
            res.json(sprintList);
        } catch (err) {
            console.error('Error getting sprints: ', err);
            throw err;
        }
    }
}

module.exports = { SelectController } 