const sanitizeHtml = require('sanitize-html');

class WorkItem {
    constructor(data) {
        this._id = data.id;
        this._title = data.fields['System.Title'];
        this._description = this.processData(data.fields['System.Description']);
        this._areaPath = data.fields['System.AreaPath'];
        this._rank = null;
    }

    getId() {
        return this._id;
    }

    getTitle() {
        return this._title;
    }
    
    getDescription() {
        return this._description;
    }

    getArea() {
        return this._areaPath;
    }

    getRank() {
        return this._rank;
    }

    setRank(rank) {
        this._rank = rank;
    }

    processData(data) {
        if (data) {
            // remove html
            let new_data = sanitizeHtml(data, { allowedTags: [], allowedAttributed: {} });
             
            // remove links
            new_data = new_data.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
        
            // remove Stopwords only deals with arrays
            //new_data = removeStopwords(new_data.split(' '));
        
            // put back into string
            return new_data//.join(' ');
        
        }
        else {
            return "No description.";
        }
    }
}

module.exports = { WorkItem  }