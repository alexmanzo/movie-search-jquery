const STORE = {
	movieData: null,
	idData: null
}

function storeMovieData(data) {
	console.log(data)
	STORE.movieData = data
	console.log('store data ran')
	console.log(STORE.movieData)
}

function storeIdData(data) {
	STORE.idData = data
}

//Build URL to request API data from. Second and Third Cats MUST include / at beginning of parameter when function called. 
function buildURL(firstCat, secondCat, thirdCat) {
	return `https://api.themoviedb.org/3/${firstCat}${secondCat}${thirdCat}`
}

//Get movie data from search. Second and Third Cats MUST include / at beginning of parameter when function called.
function getAPIData(searchTerm, callback) {
	const movieSearchURL = buildURL('search', '/movie', '');
	const search = {
		api_key: '8541c092938098d21b11f58a14dd114e',
		query: `${searchTerm}`
	}
	$.getJSON(movieSearchURL, search, callback)
}


function getMovieIdData (searchTerm, callback) {
	const movieIdSearchURL = buildURL('movie/', '157336', '')
	const search = {
		api_key: '8541c092938098d21b11f58a14dd114e',
	}
	$.getJSON(movieIdSearchURL, search, callback)
}

function displayIdData (data){
	const results = `<p>Runtime: ${data.runtime}</p>`
	$('.js-search-results-id').html(results);
}

function displayMovieData(data) {
	const results = `
		<div class="result-container">
		<h2>${data.results[0].title}</h2>
		<p>Plot Summary: ${data.results[0].overview}</p>
		<p>Average rating: ${data.results[0].vote_average}/10</p>
		<img src="https://image.tmdb.org/t/p/w1280${data.results[0].poster_path}" alt="${data.results[0].title}">
	</div>
	`;
	$('.js-search-results').html(results);
}


function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const searchTarget = $(event.currentTarget).find('.js-search');
    const search = searchTarget.val();
    // clear out the input
    searchTarget.val("");
    getAPIData(search, storeMovieData);
    getMovieIdData(search, storeIdData);
  });

}

$(watchSubmit);