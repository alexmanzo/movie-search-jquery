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

//Get movie data from search. Second and Third Cats MUST include / at beginning of parameter when function called.
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

function getAPIDataByMovieID(searchTerm, callback) {
    const settings = {
        url: buildURL('search', '/movie', ''),
        data: {
            api_key: '8541c092938098d21b11f58a14dd114e',
            query: `${searchTerm}`
        },
        dataType: 'json',
        type: 'GET',
        success: function(data) {
            const idSettings = {
                url: buildURL('movie/', `${data.results[0].id}`, ''),
                data: {
                    api_key: '8541c092938098d21b11f58a14dd114e'
                },
                dataType: 'json',
                type: 'GET',
                success: callback
            };
            $.ajax(idSettings)
        }
    };

    $.ajax(settings);
}

function renderSearchResults(result) {
    return `
        <div class="search-result-container row">
            <h5 class="search-title">${result.title.toUpperCase()}</h5>
            <h5 class="search-id">${result.id}</h5>
        </div>
    `
}

function displaySearchResults(data) {
    const results = data.results.map((item, index) => renderSearchResults(item))
    const totalResultsNum = `<p>Your search returned <span class="resultsNum">${data.total_results}</span> results.</p>`;
    $('.js-results-num').html(totalResultsNum);
    $('.js-search-results').html(results);
    $('.js-search-results').on('click', '.search-id', function(){
        let movieID = $(this)
        console.log(movieID)
        getAPIDataByMovieID(movieID, displayMovieData)
    })
}


function displayMovieData(data) {
    const movie = `
            <div class="result-container col-12" style="background:linear-gradient(rgba(0, 0, 0, 0.9),rgba(0, 0, 0, 0.9)),
      url(https://image.tmdb.org/t/p/w1280${data.backdrop_path})no-repeat center center">
                <div class="transparent title-container col-12">
                    <h2 class="transparent movie-title">${data.title.toUpperCase()}</h2>
                    <h3 class="transparent tagline">${data.tagline}</h3>
                </div>
                <div class="poster-container transparent col-4">
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