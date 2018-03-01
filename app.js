//Initialize the Typeahead Functionality
$(window).on('load', function() {
    // Instantiate the Bloodhound suggestion engine
    const movies = new Bloodhound({
        datumTokenizer: function(datum) {
            return Bloodhound.tokenizers.whitespace(datum.value);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: `https://api.themoviedb.org/3/search/movie?query=%QUERY&api_key=8541c092938098d21b11f58a14dd114e`,
            wildcard: '%QUERY',
            filter: function(movies) {
                return $.map(movies.results, function(movie) {
                    return {
                        value: movie.title
                    };
                });
            }
        }
    });

    // Initialize the Bloodhound suggestion engine
    movies.initialize();
    // Instantiate the Typeahead UI
    $('.typeahead').typeahead(null, {
        displayKey: 'value',
        source: movies.ttAdapter(),
        templates: {
            suggestion: Handlebars.compile("<p style='padding:8px'>{{value}}</p>"),
            footer: Handlebars.compile("<p style='padding:8px'>Searched for '{{query}}'</p>")
        }
    });
});

//Build URL to request API data from. Second and Third Cats MUST include / at beginning of parameter when function called. 
function buildURL(firstCat, secondCat, thirdCat) {
    return `https://api.themoviedb.org/3/${firstCat}${secondCat}${thirdCat}`
}

//Get movie data from search. Second and Third Cats MUST include / for URL.
function getAPIData(searchTerm, callback) {
    const settings = {
        url: buildURL('search', '/movie', ''),
        data: {
            api_key: '8541c092938098d21b11f58a14dd114e',
            query: `${searchTerm}`
        },
        dataType: 'json',
        type: 'GET',
        success: callback
    };

    $.ajax(settings);
}

//Get movie data from MovieID. The movieID is retrieved in displaySearchResults()
function getAPIDataByMovieID(movieID, callback) {
    const settings = {
        url: buildURL('movie/', movieID, ''),
        data: {
            api_key: '8541c092938098d21b11f58a14dd114e',
        },
        dataType: 'json',
        type: 'GET',
        success: callback
    };
    $.ajax(settings);
}

//Generate HTML structure for search results.
function renderSearchResults(result) {
    return `
        <div class="search-result-container transparent row col-12">
            <div class="poster-container search-poster col-3" id="${result.id}">
                <img src="https://image.tmdb.org/t/p/w1280${result.poster_path}" alt="${result.title}" class="poster">
            </div>
            <div class="search-text-info transparent col-6">
                <h5 class="search-title" id="${result.id}">${result.title.toUpperCase()}<span class="title">(${result.release_date.substring(0,4)})</span></h5>
                <p class="info text-heavy">${result.overview}</p>
            </div>
        </div>
    `
}

//Callback function for GetAPIData. Retrieves data and writes to page.
function displaySearchResults(data) {
    const results = data.results.map((item, index) => renderSearchResults(item))
    let totalResultsNum = `<p class="results-num col-12">Your search returned <span class="resultsNum">${data.total_results}</span> results.</p>`;
    if (data.total_results === 1) {
        totalResultsNum = `<p class="results-num col-12">Your search returned <span class="resultsNum">${data.total_results}</span> result.</p>`
    } else {
        totalResultsNum = `<p class="results-num col-12">Your search returned <span class="resultsNum">${data.total_results}</span> results.</p>`
    }
    $('.js-results-num').prop('hidden', false);
    $('.js-results-num').html(totalResultsNum);
    $('.js-search-results').html(results);
    //Listeners to retrieve MovieID and navigate to movie page.
    $('.js-search-results').on('click', '.search-title', function(event) {
        let movieID = $(this).attr('id')
        console.log(movieID)
        getAPIDataByMovieID(movieID, displayMovieData)
    })
    $('.js-search-results').on('click', '.search-poster', function(event) {
        let movieID = $(this).attr('id')
        console.log(movieID)
        getAPIDataByMovieID(movieID, displayMovieData)
    })
}

//Displays movie page
function displayMovieData(data) {
    let movie = `
            <div class="result-container col-12" aria-live="assertive" style="background:linear-gradient(rgba(0, 0, 0, 0.9),rgba(0, 0, 0, 0.9)),
      url(https://image.tmdb.org/t/p/w1280${data.backdrop_path})no-repeat center center">
                <div class="transparent title-container col-12">
                    <h2 class="transparent movie-title">${data.title.toUpperCase()}</h2>
                    <h3 class="transparent tagline">${data.tagline}</h3>
                </div>
                <div class="transparent col-4">
                    <img src="https://image.tmdb.org/t/p/w1280${data.poster_path}" alt="${data.title}" id="poster" class="poster">
                </div>
                <div class="left-info-container transparent col-4">
                    <h4 class="category transparent">YEAR RELEASED:<span class="transparent info">${data.release_date.substring(0,4)}</span></h4>
                    <h4 class="category transparent">RUNTIME:<span class="transparent info">${data.runtime} minutes</span></h4>
                    <h4 class="category transparent">PLOT:<span class="transparent info text-heavy">${data.overview}</span></h4>
                </div>
                <div class="right-info-container transparent col-4">
                    <h4 class="category transparent">GENRES:<span class="transparent info text-heavy">${data.genres.map(function(genre) {return ` ${genre.name}`})}</span></h4>
                    <h4 class="category transparent">BUDGET:<span class="transparent info">$${data.budget.toLocaleString()}</span></h4>
                    <h4 class="category transparent">REVENUE:<span class="transparent info">$${data.revenue.toLocaleString()}</span></h4>
                </div>
            </div>
  `;
    if (data.budget === 0) {
            movie = `
            <div class="result-container col-12" aria-live="assertive" style="background:linear-gradient(rgba(0, 0, 0, 0.9),rgba(0, 0, 0, 0.9)),
      url(https://image.tmdb.org/t/p/w1280${data.backdrop_path})no-repeat center center">
                <div class="transparent title-container col-12">
                    <h2 class="transparent movie-title">${data.title.toUpperCase()}</h2>
                    <h3 class="transparent tagline">${data.tagline}</h3>
                </div>
                <div class="transparent col-4">
                    <img src="https://image.tmdb.org/t/p/w1280${data.poster_path}" alt="${data.title}" id="poster" class="poster">
                </div>
                <div class="left-info-container transparent col-6">
                    <h4 class="category transparent">YEAR RELEASED:<span class="transparent info">${data.release_date.substring(0,4)}</span></h4>
                    <h4 class="category transparent">RUNTIME:<span class="transparent info">${data.runtime} minutes</span></h4>
                    <h4 class="category transparent">PLOT:<span class="transparent info text-heavy">${data.overview}</span></h4>
                    <h4 class="category transparent">GENRES:<span class="transparent info text-heavy">${data.genres.map(function(genre) {return ` ${genre.name}`})}</span></h4>
                </div>
            </div>
  `;
    } else {
        movie = `
            <div class="result-container col-12" aria-live="assertive" style="background:linear-gradient(rgba(0, 0, 0, 0.9),rgba(0, 0, 0, 0.9)),
      url(https://image.tmdb.org/t/p/w1280${data.backdrop_path})no-repeat center center">
                <div class="transparent title-container col-12">
                    <h2 class="transparent movie-title">${data.title.toUpperCase()}</h2>
                    <h3 class="transparent tagline">${data.tagline}</h3>
                </div>
                <div class="transparent col-4">
                    <img src="https://image.tmdb.org/t/p/w1280${data.poster_path}" alt="${data.title}" id="poster" class="poster">
                </div>
                <div class="left-info-container transparent col-4">
                    <h4 class="category transparent">YEAR RELEASED:<span class="transparent info">${data.release_date.substring(0,4)}</span></h4>
                    <h4 class="category transparent">RUNTIME:<span class="transparent info">${data.runtime} minutes</span></h4>
                    <h4 class="category transparent">PLOT:<span class="transparent info text-heavy">${data.overview}</span></h4>
                </div>
                <div class="right-info-container transparent col-4">
                    <h4 class="category transparent">GENRES:<span class="transparent info text-heavy">${data.genres.map(function(genre) {return ` ${genre.name}`})}</span></h4>
                    <h4 class="category transparent">BUDGET:<span class="transparent info">$${data.budget.toLocaleString()}</span></h4>
                    <h4 class="category transparent">REVENUE:<span class="transparent info">$${data.revenue.toLocaleString()}</span></h4>
                </div>
            </div>
  `;
    }

    $('.js-results-num').prop('hidden', true);
    $('.js-search-results').html(movie);
}


function watchSubmit() {
    $('.js-search-form').submit(event => {
        event.preventDefault();
        const searchTarget = $(event.currentTarget).find('#query');
        const search = searchTarget.val();
        searchTarget.val("");
        getAPIData(search, displaySearchResults);
    });

}

$(watchSubmit);