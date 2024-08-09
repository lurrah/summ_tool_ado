document.getElementById("submit").addEventListener('click', function(event) {
    event.preventDefault();
    const pat = document.getElementById('pat').value;
    const errorDiv = document.getElementById('Error');
    
    if (pat === '') {
      errorDiv.innerHTML = 'Please enter your Azure DevOps Personal Access Token.';
    } else {
      errorDiv.innerHTML = 'Loading...';
      // check if access token is valid and save accordingly
        fetch(`/azure_auth/pat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ pat: pat })
        })
        .then(response => response.json())
        .then(data=>{
          if (data.pat === 'invalid') {
            errorDiv.innerHTML = 'The PAT you entered is invalid.'
          } else {
            window.location.href = '../';
          }
        })
        .catch(err => {
          console.error('error calling azure authorization router function', err);
        })
    }
  });