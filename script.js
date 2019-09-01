// The user must be able to search for parks in one or more states.
// The user must be able to set the max number of results, with a default of 10.
// The search must trigger a call to NPS's API.
// The parks in the given state must be displayed on the page. Include at least:
// Full name
// Description
// Website URL
// The user must be able to make multiple searches and see only the results for the current search.
// As a stretch goal, try adding the park's address to the results.

function watchForm() {
    $('.request_parks').submit(event => {
      event.preventDefault();
      const stateName = $('.state_name').val();
      const numberResults = $('.park_count').val();
      urlGenerator(stateName, numberResults);
    });
  }

//takes user input and creates url necessary to properly make GET request
function urlGenerator(stateName, numberResults) {
    const apiKey = 'F0bglnG1ApNQSy6Sbp1kDQyPrxoIbXwbffHH1XWk';
    const params = {
        api_key: apiKey,
        stateCode: stateName,
        limit: numberResults
    };
    
    const baseUrl = "https://developer.nps.gov/api/v1/parks?";
    
    
    // create array of params' keys.  for each item in that array, create a new object of encoded key=value pairs.  Then join these items with the & symbol beforethem.
    const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
    const finalUrl = baseUrl + queryString;
    getResults(finalUrl);
}

function getResults(url) {
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }       
            throw new Error(response.statusText);
        }) 
        .then(responseJson => parkDisplayer(responseJson))
        .catch(err => {
            $('.park_list').text(`Something went wrong: ${err.message}`);
        })
    }
    
// iterates through each finding: for each, appends 'name' and 'archive_url' to .park_list
function parkDisplayer(parkData) {
    console.log(parkData)
    $('.park_list').empty();
    $('.results').removeClass("hidden");
    for (let i = 0; i < parkData.data.length; i++) {
        let parkName = parkData.data[i].fullName;
        let parkDescription = parkData.data[i].description;
        let parkUrl = parkData.data[i].url;
        let parkAddress = parkData.data[i].addresses;
        // the returned object never has an 'address' key in .data!  how mean!
        // .map(keys => `parkData.data[i].addresses`)
        // console.log(parkAddress)

        $('.park_list').append(
            `<h3>${parkName}</h3>
            <a href="${parkUrl}">${parkUrl}</a></p>
            <p>${parkDescription}</p>
            `
        )
    }
        
        
}

$(watchForm);