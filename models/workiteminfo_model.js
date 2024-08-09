const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

const { WorkItem } = require('./workitem_model.js');

class WorkItemInfo {
    itemMap; // ensure no duplicate items
    areaSet;
    constructor(org, proj, id, team, options) {
        this.team = team;
        this.id = id;
        this.options = options;
        this.url = `https://dev.azure.com/${org}/${proj}/${team}/_apis/work/teamsettings/iterations/${id}/workitems?api-version=7.1-preview.1`;
    }

    async getItemList() {
        try {
            const response = await fetch(this.url, this.options);
            if (!response.ok) {
                throw new Error('Failed to fetch WorkItems');
            }
            const data = await response.json();
    
            return data;
        } catch (err) {
            console.error('Error:', err);
            throw err;
        }
    };

    // Gets specific work item information
    async getItemInfo(itemUrl) {
        try {
            const response = await fetch(itemUrl, this.options);
            if (!response.ok) {
                throw new Error('Failed to fetch Work Item Description');
            }
                
            const data = await response.json();
            return data;
        } catch(err) {
            throw new Error('Error getting workitem description');
        }
    };

    async mapItemInfo(itemList) {
        try {
            this.itemMap = new Map(); // ensure no duplicate items
            this.areaSet = new Set(); // unique area paths
    
            for (const workItemRel of itemList.workItemRelations) {
                // Get work item object
                let item = await this.getItemInfo(workItemRel.target.url);
    
                item = await this.createWorkItemObj(item);
                if (item !== null) {
                    this.itemMap.set( item.getId(), item);
                }
    
                if (!this.areaSet.has(item.getArea())) {
                    this.areaSet.add(item.getArea());
                }
    
                item = await this.setRank(item, workItemRel);
            } 
            let list = '';
            if (this.itemMap.size === 0) {
                return list;
            } else {
                list = await this.buildPromptList();
                this.itemMap.clear();
                this.areaSet.clear();
                return list;
            }
        } catch (err) {
            console.error('Error:', err);
            throw err;
        }
    }

    // Get information of specific work item
    async  createWorkItemObj(item) {
        try {
            if (!this.itemMap.has(item.id)) {
                // create new work item object with item
                item = new WorkItem(item);

                return item;
            }

            return null;

        } catch (err) {
            console.error('Error:', err);
            throw err; // Re-throw the error to be caught by the calling function
        }
    }

    async setRank(item, workItemRel) {
        if (workItemRel.rel === "System.LinkTypes.Hierarchy-Forward") {
            if (this.itemMap.has(workItemRel.source.id)) {
                let source = this.itemMap.get(workItemRel.source.id)

                item.setRank(source.getRank() + 1);
            } else {
                throw new Error('Error finding work item relation');
            }
        } else if (workItemRel.rel === null) {
            // If item has no relation, then it has a rank of 1.
            item.setRank(1);
        } else {
            throw new Error('Error detecting work item relation type')
        } 

        return item;
    }

    async buildPromptList() {
        let list = ''
        this.areaSet.forEach(area => {
            list += `${area}\n`;

            // identing based on rank

            this.itemMap.forEach((item) => {
                if (item.getArea() === area) {
                    for (let i = item.getRank(); i > 0; i--) {
                        list += '\t'
                    }
                    list += `${item.getTitle()}: ${item.getDescription()}\n `
                }
            })
        })

        return list;
    }

}

module.exports = { WorkItemInfo }