class PageController {
  constructor(){};
  getIndexPage (req, res) {
    try {
      res.render('index', { title: 'Summarization Tool'});
    } catch (error) {
      res.status(500).send('Error fetching data');
    }
  }  
    
  getUserPage(req, res) {
    try {
        res.render('user', { title: 'Login'});
      } catch (error) {
        res.status(500).send('Error fetching login page');
      }
  }

  getPATPage(req, res) {
    try {
      res.render('azure_auth', {title: "ADO PAT"});
    } catch (error) {
      res.status(500).send('Error fetching PAT page');
    }
  }
}

module.exports = { PageController }