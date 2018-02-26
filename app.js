const STORE = {
	movieData: null,
	idData: null
}

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

function renderResult(result) {
	return `
		<div class="result-container">
		<h2>${result.title}</h2>
		<p>Plot Summary: ${result.overview}</p>
		<p>Average rating: ${result.vote_average}/10</p>
		<img src="https://image.tmdb.org/t/p/w1280${result.poster_path}" alt="${result.title}">
	</div>
	`;
}

function displayMovieData(data) {
	const results = data.results.map((item, index) => renderResult(item));
	$('.js-search-results').html(results);
}


function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const searchTarget = $(event.currentTarget).find('.js-search');
    const search = searchTarget.val();
    searchTarget.val("");
    getAPIData(search, displayMovieData);
  });

}

$(watchSubmit);