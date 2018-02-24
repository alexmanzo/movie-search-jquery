const movieSearchURL = 'https://api.themoviedb.org/3/search/movie'

function getAPIData(searchTerm, callback) {
	const search = {
		api_key: '8541c092938098d21b11f58a14dd114e',
		query: `${searchTerm}`
	}

	$.getJSON(movieSearchURL, search, callback)
}

function displayTMDBSearchData(data) {
	const results = `
	<div class="result-container">
		<h2>${data.results[0].title}</h2>
		<p>Plot Summary: ${data.results[0].overview}</p>
		<p>Release date: ${data.results[0].release_date}</p>
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
    getAPIData(search, displayTMDBSearchData);
  });
}

$(watchSubmit);