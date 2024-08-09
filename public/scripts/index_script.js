document.addEventListener('DOMContentLoaded', function () {
  populateProjects();
  document.getElementById('proj-select').addEventListener('change', populateTeams);
  document.getElementById('team-select').addEventListener('change', populateSprints);
  document.getElementById('generate').addEventListener('click', generate);
  document.getElementById('regenerate').addEventListener('click', regenerate);
  document.getElementById("show-prompt").addEventListener('click', showPrompt);

  // Get the modal
  var modal = document.getElementById("modal");

  // Close Modal
  document.getElementsByClassName("close")[0].addEventListener('click', function() {
    modal.style.display = "none";
  });

  window.onclick = function(event) {
      if (event.target == modal) {
      modal.style.display = "none";
      }
  }
});

let paginationFlag = 0;

function populateProjects() {
  const sprintInfoDiv = document.getElementById('sprintInfo');

  fetch(`/projects`, {
    method: 'GET',
    headers: {}
  })
  .then(response=> {
    if (response.redirected) {
      window.location.href = response.url;
      return;
    }
    
    if (response.ok) {
      return response.json();
    } else if (response.status === 401) {
      sprintInfoDiv.innerHTML = 'Not authorized to view projects.'
      throw new Error('Authorization Error');
    } else {
      sprintInfoDiv.innerHTML = 'Please enter a new ADO personal access token. Your current one is invalid.';
      throw new Error('Invalid ADO PAT');
    }
  })
  .then(data=> {
    const projList = document.getElementById('proj-select');
    
    data.value.forEach(proj => {
      const option = document.createElement('option');
      option.value = proj.id;
      option.text = proj.name;
      projList.appendChild(option);
    })
  })
  .catch(error => {
    console.error('error calling project router function', error);
  })
}

function populateTeams() {
  const proj = document.getElementById('proj-select').value;

  fetch(`/teams`, {
    method: 'GET',
    headers: {
      proj: proj,
    }
  })
  .then(response=> response.json())
  .then(data=> {
    const teamList = document.getElementById('team-select');
    const sprintList = document.getElementById('sprint-select');

    // clear previous list
    teamList.innerHTML = '';
    sprintList.innerHTML = '';


    // Default value, unselectable value
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Select a team';
    defaultOption.value = ''; // Set value to an empty string or appropriate value
    defaultOption.selected = true; // Initially selected
    teamList.appendChild(defaultOption);
    defaultOption.disabled = true;

    data.value.forEach(team=> {
      const option = document.createElement('option');
      option.value = team.name;
      option.text = team.name;
      teamList.appendChild(option);
    })
  })
  .catch(error => {
    console.error('error calling team router ', error);
  })
}

// Sprint Functions
function populateSprints() {

  // if project is empty, tell user to select project first
    const team = document.getElementById('team-select').value;
    const proj = document.getElementById('proj-select').value;

    fetch(`/sprints`, {
      method: 'GET',
      headers: {
        team: team,
        proj: proj,
      }
    })
    .then(response=> response.json())
    .then(data=> {
      const sprintList = document.getElementById('sprint-select');

      // remove previous items
      sprintList.innerHTML = '';

      // Default value, unselectable value
      const defaultOption = document.createElement('option');
      defaultOption.text = 'Select a sprint';
      defaultOption.value = ''; // Set value to an empty string or appropriate value
      defaultOption.selected = true; // Initially selected
      sprintList.appendChild(defaultOption);
      defaultOption.disabled = true;

      // Populate select list
      data.value.forEach(sprint => {
        const option = document.createElement('option');
        option.value = sprint.id;
        option.text = sprint.name;
        sprintList.appendChild(option);
      });
    })
    .catch(error => {
      console.error('error calling sprint router function', error);
    })
  }

  // Gets AI summary for the sprint selected
  function generate() {
    // Iteration id
    const currentSelect = document.getElementById('sprint-select').value;
    const team = document.getElementById('team-select').value;
    const proj = document.getElementById('proj-select').value;

    // Text space for summary
    var sprintInfoDiv = document.getElementById('sprintInfo');
    if (!currentSelect) {
      sprintInfoDiv.innerHTML = 'Please select a sprint';
      return;
    }
    sprintInfoDiv.innerHTML = 'Loading...'

    
    // Get workitems and summary
      fetch(`/generate-summary`, {
        method: 'GET',
        headers: {
          id: currentSelect,
          team: team,
          proj: proj,
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          sprintInfoDiv.innerHTML = 'Workitems not found';
          throw new Error('Workitems not found');
        } else {
          sprintInfoDiv.innerHTML = 'An error occurred.'
          throw new Error('Error in router function');
        }
      })
      .then(data => {
        addPage();

        // Hide/show proper buttons
        document.getElementById('generate').setAttribute('hidden', 'true');
        document.getElementById('regenerate').removeAttribute('hidden');
        document.getElementById('show-prompt').removeAttribute('hidden');

        // If either is changed, no summary should be shown
        document.getElementById('sprint-select').addEventListener('change', clearSprintDiv);
        document.getElementById('team-select').addEventListener('change', clearSprintDiv);
      })      
        .catch(error => {
        console.error('error calling workitem router', error);
      })
  }

  function regenerate() {
    const currentSelect = document.getElementById('sprint-select').value;
    const teamSelect = document.getElementById('team-select').value;
    const projSelect = document.getElementById('proj-select').value;

    // Text space for summary
    var sprintInfoDiv = document.getElementById('sprintInfo');
    sprintInfoDiv.innerHTML = 'Loading...';

    // Prompt will be reset when regenerating
    const promptDiv = document.getElementById('promptDiv');
    document.getElementById('show-prompt').setAttribute('hidden', 'true');
    promptDiv.innerText = '';

    fetch(`/regenerate-summary`, {
      method: 'GET',
      headers: {
        id: currentSelect,
        team: teamSelect,
        proj: projSelect
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        sprintInfoDiv.innerHTML = 'Failed to regenerate summary'
        throw new Error('Error in regenerate function');
      }
    })
    .then(data => {
      addPage();
    })
    .catch(error => {
      console.error('error calling regenerate router', error);
    })
  }

// Version Functions

function getVersionCount() {
  const currentSprint = document.getElementById('sprint-select').value
  const sprintInfoDiv = document.getElementById('sprintInfo');
  
  return fetch('/version/count', {
    method: 'GET',
      headers: {
        id: currentSprint,
      }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } 
    else {
      sprintInfoDiv.innerHTML = 'Error occured while trying to find number of versions';
      throw new Error('No previous summary available');
    }
  })
  .catch(error => {
    console.error('error calling version count router', error);
  })
}

function getVersionSpecific(version) {
  const currentSprint = document.getElementById('sprint-select').value
  const sprintInfoDiv = document.getElementById('sprintInfo');
  
  return fetch('/version/specific', {
    method: 'GET',
      headers: {
        id: currentSprint,
        version: version
      }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } 
    else {
      sprintInfoDiv.innerHTML = 'Error finding specified version'
      throw new Error('Error finding specified version');
    }
  })
  .catch(error => {
    console.error('error calling specific version router', error);
  })
}

// Pagination Functions
function initPagination() {
    getVersionCount()
    .then(version => {  
      // Pagination from 1 to maxVersion.
      const maxVersion = version;
      $('#pagination-container').pagination({
          dataSource: function (done){
            const pages = [];
            for (let i = 1; i <= maxVersion; i++) {
              pages.push(i);
            }
            done(pages);
          },
          pageSize: 1,
          pageNumber: maxVersion,
          callback: function(data, pagination) {
            return data;
        }
        })

        // Pagination hooks (arrows & numbers)
        $('#pagination-container').addHook('afterPageOnClick', showSummary);
        $('#pagination-container').addHook('afterPreviousOnClick', showSummary);
        $('#pagination-container').addHook('afterNextOnClick', showSummary);

        paginationFlag = 1;
        showSummary();
    })
    .catch(error => {
      console.error('Error initializing pagination', error);
    });
}

function addPage() {
  destroyPage();
  initPagination();
}

function destroyPage() {
  if (paginationFlag === 1) {
    const pagContainer = $('#pagination-container');

    pagContainer.pagination('destroy');
  }
}

// Display Functions

function showSummary() {
  const sprintInfoDiv = document.getElementById('sprintInfo');
  const pagContainer = $('#pagination-container');
  const currentPage = pagContainer.pagination('getCurrentPageData');
  const promptDiv = document.getElementById('promptDiv');

  // When new summary is shown, promptDiv should always be reset and hidden
  if (promptDiv.textContent !== null) {
    promptDiv.textContent = '';
    document.getElementById('show-prompt').removeAttribute('hidden');
  }

  getVersionSpecific(currentPage)
  .then( summary => {
    return summary;
  })
  .then (summary => {
    sprintInfoDiv.innerHTML = summary;
  })
  .catch(error => {
    console.error("Error displaying summary");
  })
}

async function showPrompt() {
  const currentSprint = document.getElementById('sprint-select').value;
  const promptDiv = document.getElementById('promptDiv');
  const modal = document.getElementById('modal');


  // Version of summary is shown by pagination
  const pagContainer = $('#pagination-container');
  const currentPage = pagContainer.pagination('getCurrentPageData');

  // Checks if button has been clicked before
  if (promptDiv.innerText.trim() !== '') {
    modal.style.display = "block";
    promptDiv.style.display = 'block';
  }
  else {
    modal.style.display = "block";
    promptDiv.style.display = 'block';
    return fetch('/prompt', {
      method: 'GET',
        headers: {
          id: currentSprint,
          version: currentPage[0]
        }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } 
      else {
        sprintInfoDiv.innerHTML = 'Error finding prompt'
        throw new Error('Error finding prompt');
      }
    })
    .then(response => {
      promptDiv.innerHTML = `<pre> ${response} </pre>`;
    })
    .catch(error => {
      console.error('error calling prompt router', error);
    })
  }
}

// Clear sprint div when user selects new sprint
function clearSprintDiv() {
  const sprintInfoDiv = document.getElementById('sprintInfo');
  const promptDiv = document.getElementById('promptDiv');
  sprintInfoDiv.innerHTML = '';
  promptDiv.innerText = '';
  destroyPage();

  // If nothing is in Sprint Div, no prompt can be viewed and no regeneration can occur
  document.getElementById('regenerate').setAttribute('hidden', 'true');
  document.getElementById('generate').removeAttribute('hidden');

  document.getElementById('show-prompt').setAttribute('hidden', 'true');
}