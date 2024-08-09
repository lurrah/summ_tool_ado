const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const { DbController } = require('../controllers/db_controller.js');

const key = process.env.AI_KEY;
const deploymentId = process.env.AI_MODEL;
const aiUrl = process.env.AI_ENDPOINT;

const dbController = new DbController();

const { prompt } = require('../configs/prompt.js');

class AiResponse {
    constructor(user, id, list, resp_version) {
        this.user = user;
        this.id = id;
        this.resp_version = resp_version;
        this.list = list;
        this.prompt = [{role: 'user', content: `${prompt}${list}`}]; 
    }

    async handleAiResp() {
        const summary = await this.getAiResp();

        let list_version = await dbController.getListVersion(this.user, this.id, this.list);
        if (list_version === null) {
            return null;
        }

        let result = await this.saveResp(summary.content, list_version.ListVersion);

        return result;
    }

    async getAiResp() {
        if (this.list === null || this.list === '') {
            return {content: "No workitems found."}
        } else {
            const client = new OpenAIClient(aiUrl, new AzureKeyCredential(key));
        
            try {
                const result = await client.getChatCompletions(deploymentId, this.prompt);
                for (const choice of result.choices) {
                    return choice.message;
               }
                // replace lines above with below to avoid calls to openAI  
                //return {content:"hello"}
            } catch(error) {
                throw new Error('Error fetching AI response');
            }
        }
    }

    async saveResp(summary, list_version) {
        try {
            // Save summary
            const result = await dbController.createRespEntry(this.user, this.id, summary, this.resp_version, list_version);
    
            return result;
        } catch {
            throw new Error('error saving AI summary.');
        }
    }
}

module.exports= { AiResponse };