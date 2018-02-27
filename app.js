$(window).on('load', function(){
// Instantiate the Bloodhound suggestion engine
const movies = new Bloodhound({
    datumTokenizer: function (datum) {
        return Bloodhound.tokenizers.whitespace(datum.value);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        url: `https://api.themoviedb.org/3/search/movie?query=%QUERY&api_key=8541c092938098d21b11f58a14dd114e`,
        wildcard: '%QUERY',
        filter: function (movies) {
            return $.map(movies.results, function (movie) {
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
    success: function(data){
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



function displayMovieData(data) {
	const results = `
    <div class="result-container" style="background:linear-gradient(rgba(0, 0, 0, 0.9),rgba(0, 0, 0, 0.9)),
      url(https://image.tmdb.org/t/p/w1280${data.backdrop_path})no-repeat center center">
      <img src="https://image.tmdb.org/t/p/w1280${data.poster_path}" alt="${data.title}" id="poster">
      <h2 class="transparent">${data.title}</h2>
      <h3 class="transparent">${data.tagline}</h3>
      <h4 class="category">Year Released:</h4>
      <p class="transparent">${data.release_date.substring(0,4)}</p>
      <h4 class="category">Genres:</h4>
      <p class="transparent">${data.genres.map(function(genre) {return ` ${genre.name}`})}</p>
      <h4 class="category">Plot Summary:</h4>
      <p class="transparent">${data.overview}</p>
      <h4 class="category">Runtime:</h4>
      <p class="transparent">${data.runtime} minutes</p>
      <h4 class="category">Budget:</h4>
      <p class="transparent">$${data.budget.toLocaleString()}</p>
      <h4 class="category">Revenue:</h4>
      <p class="transparent">$${data.revenue.toLocaleString()}</p>
  </div>
  `;
	$('.js-search-results').html(results);
  console.log(data)
}


function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const searchTarget = $(event.currentTarget).find('#query');
    const search = searchTarget.val();
    searchTarget.val("");
    getAPIData(search, displayMovieData);
  });

}

$(watchSubmit);