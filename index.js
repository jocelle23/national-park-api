'use strict';

const apiKey = 'ZmM8Yr6rRJgJyrDew2ebdpXaBd5hbbj4KBghickY';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQuery(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function totalResults(responseJson) {
    let strResponse = responseJson.data.length;
    if (strResponse == 0) {
        $('#results').html(`<h2 class="resultTitle"><u>${strResponse} Related Results</u></h2>
        <p>Please try searching again!</p>
        `);
    }
    else if (strResponse == 1) {
        $('#results').html(`<h2 class="resultTitle"><u>${strResponse} Related Result</u></h2>`);
    }
    else {
        $('#results').html(`<h2 class="resultTitle"><u>${strResponse} Related Results</u></h2>`);
    }
}

function displayResults(responseJson) {
    // if there are previous results, remove them
    $('#park-results').removeClass('hidden');
    console.log(responseJson);
    $('#park-list').empty();
    totalResults(responseJson);
    //matchResults(responseJson);
    
    // iterate through the articles array, stopping at the max number of results
    for (let i = 0; i < responseJson.data.length; i++) {
        let parkName = responseJson.data[i].fullName;
        let parkURL = responseJson.data[i].url;
        let parkDescription = responseJson.data[i].description;
        let parkState = "Not Available";
        if (responseJson.data[i].addresses.length > 0) {
            parkState = responseJson.data[i].addresses[0].stateCode;
        }
        
        $('#park-list').append(`
        <section id="park-list">
            <h3>${i+1}. <a href="${parkURL}" target="_blank">${parkName}</a></h3>
            <p class="bigP">Location: ${parkState}</p>
            <p>${parkDescription}</p>
            <p class="bigP">Visit the ${parkName} <a href="${parkURL}" target="_blank"><u>here</u></a>!<p>
        </section>
        `
        )
    };
};

function findPark(searchedState, limit) {
    const params = {
        stateCode: searchedState,
        limit: limit,
        api_key: apiKey
    };
    const querySearch = formatQuery(params);
    const url = searchURL + "?" + querySearch;
    console.log(url);

    const options = {
        headers: new Headers({
          "X-Api-Key": apiKey,
        })
      };

    fetch(url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function watchForm() {
    $('#js-form').submit(event => {
        event.preventDefault();
        const searchedState = $("#js-search-term").val().split(", ");
        console.log("User is searching for the following state(s): " + searchedState);
        const limit = $('#js-max-results').val();
        findPark(searchedState, limit);
    });
}

$(watchForm);