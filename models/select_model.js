const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));



class Select {
    constructor(org, options) {
        this.org = org;
        this.options = options;
    }
    
    async fetchProjects() {
        try {
            const url = `https://dev.azure.com/${this.org}/_apis/projects?api-version=7.2-preview.4`
            const response = await fetch(url, this.options);


            if (response.status !== 200) {
                if (response.status === 401) {
                    return { status: 401, message: 'Unauthorized' };
                } else {
                    return { status: 404, message: 'Not found'};
                }
            }
            return await response.json();
        } catch (err) {
            console.error('Error fetching projects: ', err)
        }
    }

    async fetchTeams(proj) {
        try {
            const url = `https://dev.azure.com/${this.org}/_apis/projects/${proj}/teams?api-version=7.2-preview.3`

            const response = await fetch(url, this.options);
            if (!response.ok) {
                if (response.status === 401) {
                    return 401;
                } else {
                    throw new Error('Failed to fetch teams')
                }
            }
            return await response.json();
        } catch (err) {
            console.error('Error fetching teams: ', err)
        }
    }

    async fetchSprints(proj, team) {
        try {
            const url = `https://dev.azure.com/${this.org}/${proj}/${team}/_apis/work/teamsettings/iterations?api-version=7.1-preview.1`

            const response = await fetch(url, this.options);
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized to get sprints')
                } else {
                    throw new Error('Failed to fetch sprints')
                }
            }
            return await response.json();
        } catch (err) {
            console.error('Error', err);
            throw err;
        }
    }
}

module.exports = { Select };