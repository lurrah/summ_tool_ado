const { respModel, iteratModel } = require('../models/db_models');
const prompt = require('../configs/prompt.js').prompt;


class DbController {
  constructor(){};

  // route methods
  async getVersionCount(req, res) {
    try {
      const id = req.headers.id;
      const user = req.session.user.github_id
      let { count } = await this.getNumResponses(user, id);

      res.json(count);
    } catch (err) {
      console.error('Error getting version count: ', err);
    }
  }

   // get the version of specific response
  async getVersionSpecific(req, res) {
    try {
      const id = req.headers.id;
      const version = req.headers.version;
      const user = req.session.user.github_id;

      const response = await this.findResponse(user, id, version);

      res.json(response.Response);
      //return response;

    } catch (err) {
        console.error('Error getting specified response based on version: ', err);
        //throw new err;
    }
  }

  async getPrompt(req, res) {
    try {
      const id = req.headers.id;
      const version = req.headers.version;
      const user = req.session.user.github_id;

      // Ensures correct prompt is being found when retrieving ItemList
      const summary = await this.findResponse(user, id, version);
      const iteration = await this.findIteration(user, id, summary.PromptVersion);

      res.json(`${prompt} ${iteration.ItemList}`);
    } catch(err) {
      console.error('Error getting prompt: ', err);
    }
  }

  // actions
  async getNumResponses(user, id) {
    try {
      let { count, rows } = await respModel.findAndCountAll({
        where: {
          user_id: user,
          IteratId: id,

        },
      })
      return {count, rows}
      
    } catch (err) {
      console.error("Error finding and counting response entries in database: ", err);
    }
  }
    
  async findIteration(user, id, version) {
    let iteration = await iteratModel.findOne({
      where: {
        user_id: user,
        IteratId: id,
        ListVersion: version
      }
    });

    return iteration;
  }

  async findResponse(user, id, version) {
    try {
      let response = await respModel.findOne({
        where: {
          user_id: user,
          IteratId: id,
          Version: version
        },
      });
      return response;
    } catch (err) {
      console.error('Error getting response: ', err);
    }
    
  } 
    
  async createIteratEntry(user, id, list, version) {
    if (list === '') {
      return null;
    }
    try {
      const newEntry = await iteratModel.create({ IteratId: id, ItemList: list, ListVersion: version, user_id: user });
    
      return newEntry;
    } catch (error) {
      console.error("Error creating iteration entry", error);
    }
  }
    
  async createRespEntry(user, iteratId, data, resp_version, prompt_version) {
      try {
          const newEntry = await respModel.create({IteratId: iteratId, Response: data, Version: resp_version, PromptVersion: prompt_version, user_id: user });
    
          return newEntry;
      } catch (error) {
          console.error("Error creating response entry:", error);
      }
  }

  async getListVersion(user, id, list) {
    if (list === '') {
      return null;
    }
    // For the purpose of getting the correct list version
    let { count, rows } = await iteratModel.findAndCountAll({
      where: {
        user_id: user,
        IteratId: id,
      },
    })
      
    // If count is 0, go ahead and add new entry
    if (count === 0) {
      let entry = await this.createIteratEntry(user, id, list, 1);
    
      return entry;
    }
    else {
      // Check if current list matches any in the database
      for (let i = 0; i < count; i++) {
        if (rows[i].ItemList === list) {
          return rows[i];
        }
      }
    }
    
    // If row has not been returned, create new entry
    let entry = await this.createIteratEntry(user, id, list, count + 1);
    
    return entry;
  }
    
    // For test purposes
  async testConnectivity() {
    try {
      // Query the database using your Sequelize model
      const response = await iteratModel.findOne();
      
      if (response) {
        console.log('Successfully connected to the AiResponses table.');
      } else {
        console.log('No records found in the AiResponses table.');
      }
    } catch (error) {
      console.error('Error connecting to the AiResponses table:', error);
    }
  }
}


module.exports = { DbController };