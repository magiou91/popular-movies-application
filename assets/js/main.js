const API_KEY = '9198fa6d9a9713bc6b03ee9582525917';
const API_MOVIES_ENDPOINT = 'https://api.themoviedb.org/3';
const API_IMAGE_ENDPOINT = 'https://image.tmdb.org/t/p/w500';
const API_VIDEO_ENDPOINT = 'https://www.youtube.com/embed/';
const NO_IMAGE = 'assets/images/no-image.png'

//construct the final url path for fetching
function generateURL(path) {
	const url = `${API_MOVIES_ENDPOINT}${path}?api_key=${API_KEY}`	
	return url;
}

//request popular movies 
function getPopularMovies() {
	const path = `/movie/popular`;
	const url = generateURL(path);
	const firstMovie = '#popularMovies .list-group-item:first-child';

	fetch(url)
	.then((res) => res.json())
	.then((data) => {
			createPopularMoviesSection(data);
			$(firstMovie).addClass('active');
				
			const firstMoviePath = `/movie/${$(firstMovie).attr("data-movie-id")}`;	
			const firstMovieUrl = generateURL(firstMoviePath);

			requestMoviesDetails(firstMovieUrl);
			onClickAddActiveClass();
			burgerMenu();
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
}

//create and return the list of popular movies
function createPopularMoviesSection(data) {
	const movies = data.results;
	const movieListSection = document.querySelector('#popularMovies');	
	let movieListContent ="";
	let PopularMovies ="";
	let PopularMoviesUl = document.createElement('ul');
	PopularMoviesUl.setAttribute('class', 'list-group list-group-flush');	
	
	
	for (let i = 0; i < movies.length; i++) {			
		let movieID = movies[i].id;
		let movieTitle = movies[i].title;
		
		movieListContent =`
		<li class="list-group-item" data-movie-id=${movieID}>${movieTitle}</li>
		`;
		PopularMoviesUl.innerHTML += movieListContent;
		PopularMovies = movieListSection.appendChild(PopularMoviesUl);
		
	}	
	return PopularMovies;

}

//change the display format of movie's release date 
function createMovieDetailsItem(data) {
	const movieTitle = data.title;
	const overview = data.overview;
	const moviePoster = `${API_IMAGE_ENDPOINT}` + data.poster_path;
	const movieduration = data.runtime;
	const voteAverage = data.vote_average;
	const userScorePercent = Math.round(data.popularity);
	const releaseDate = changeReleaseDateFormat(data); 
	const yearRelease = getYearOfRelease(data);
	const movieDetailsIdSection = document.querySelector('#movies');	
	
	const movieDetailItem = document.createElement('div');		
	movieDetailItem.setAttribute('class', 'row content');
	
	const genres = getGenresName(data.genres);
	
	const movieDetailsContent = `
		<div class="col-md-3">
			<div class="d-flex py-4" id="movieImage">
			  <img src=${moviePoster} alt="${movieTitle}">
			</div>
		</div>
		<div class="col-md-9">
			<div class="menu-text flex-grow-1 py-4 px-xl-5">
			  <h2 class="main-title" id="movieTitle">${movieTitle} <span class="yearRelease">(${yearRelease})</span>
			 </h2>
			<span class="voteAverage py-2"><i class="fa fa-star"></i>${voteAverage}<sup>/10</sup></span></span>			 
			  <div class="additional-info">				 
				<i class="fa fa-calendar"></i><span class="releaseFullDate">${releaseDate}</span>
				<span class="genres">${genres}</span>
				<span class="duration">${movieduration} min</span>
			  </div>
			  <hr class="hr-style-left" />
				<p id="movieOverview">${overview}</p>
				<button type="button" onClick="requestVideos(${data.id})" class="btn btn-secondary btn-sm"><span>See trailer</span></button>	
			</div>
		</div>
		`	
	movieDetailItem.innerHTML = movieDetailsContent;
	
	return movieDetailItem;	
}

//if the movies' details section is empty create it
function createMovieDetailsSection(data) {
	const movieDetailsIdSection = document.querySelector('#movies');	
	const movieDetails = movieDetailsIdSection.appendChild(createMovieDetailsItem(data));
		
	return movieDetails;	
}

//if the movies' details is already filled by another popular movie overwrites with the new chosen one
function changeMovieDetailsSection(data) {
	const newMovieDetails = createMovieDetailsItem(data);
	const existingMovieDetails = document.querySelector('#movies');
	let movieDetails = '';
	
	existingMovieDetails.innerHTML = '';
	movieDetails = existingMovieDetails.appendChild(newMovieDetails);

	return movieDetails;	
}

//request the details of a choosen popular movie
function requestMoviesDetails(url) {		
	fetch(url)
		.then((res) => res.json())
		.then((data) => {
			if ($('#movies').is(':parent')) {
				changeMovieDetailsSection(data);
			}else {
				createMovieDetailsSection(data);
			}				
		})
		.catch((error) => {
			console.log('Error: ', error);
		});
}

//create video iframe
function createVideoIframe(key){
	const movieDetailsIdSection = document.querySelector('#movies .menu-text');	

	const video = document.createElement('div');
	video.setAttribute('class', 'video-frame');
	const iframe = document.createElement('iframe');		
	iframe.src = `${API_VIDEO_ENDPOINT}${key}`;
	iframe.width = 560;
	iframe.height = 315;
	iframe.allowFullScreen = true;
	video.appendChild(iframe);
	movieDetailsIdSection.appendChild(video);
	$('.menu-text .btn').hide(500);	
}

//get the video key and call createVideoIframe function to make the iframe
function requestVideos(id){
	const path = `/movie/${id}/videos`;
	const url = generateURL(path);	
	fetch(url)
	.then((res) => res.json())
	.then((data) => {
		if (data.results[0].key != null) {
			createVideoIframe(data.results[0].key);	
		}else {
			alert('No trailer for this movie!');
		}
	})
	.catch((error) => {
		console.log('Error: ', error);
	});	
}

//get the search term from the search input search bar
function getSearchTerm() {
	const searchButton = document.querySelector('.btn-search');
	const inputSearch = document.querySelector('#searchText'); 
	const value = inputSearch.value;
		return value;
}

//request the search term, search and shows a list of relative movies
function searchMovies() {
	const PopularMenuListItem = '#popularMovies .list-group-item';
	const moviesSection = document.querySelector('#movies'); 
	const searchTerm = getSearchTerm();
	const path = `/search/movie`;
	const url = generateURL(path) + '&query=' + searchTerm;
	let movieList = document.createElement('ul');		
	movieList.setAttribute('class', 'search-results');
	
	let movies = '';		
	
	fetch(url)
	.then((res) => res.json())
	.then((data) => {
		
		const moviesResults = data.results;
		
		if (moviesResults != null && moviesResults.length > 0){
			
			for (let i = 0; i < moviesResults.length; i++) {
				let id = moviesResults[i].id;
				let title = moviesResults[i].title;
				let date = changeReleaseDateFormat(moviesResults[i]);
				let overview = moviesResults[i].overview;
				let poster = '';
				
				if(moviesResults[i].poster_path != null) {
					poster =`${API_IMAGE_ENDPOINT}` + moviesResults[i].poster_path;	
				} else {
					poster = `${NO_IMAGE}`;
				}
				movieListItem =`
					<li data-movie-id=${id}>
						<img src=${poster} alt="${title}">
						<div class="txt">
							<h2 class="movieTitle">${title}</h2>
							<p class="release-date">${date}</p>
							<p class="overview">${overview}</p>
						</div>
					</li>
				`;
				
				moviesSection.innerHTML = '';
				movieList.innerHTML += movieListItem;
				movies = moviesSection.appendChild(movieList);		
			}
		} else {			
			moviesSection.innerHTML = '';
			movieListItem = `<h2 class="no-found-title py-4">NO RESULT FOR: <span class="no-found-term">${searchTerm}</span></h2>`
			movieList.innerHTML = movieListItem;
			movies = moviesSection.appendChild(movieList);
		}
		
		$(PopularMenuListItem).removeClass("active");
		return movies;
})
	.catch((error) => {
		console.log('Error: ', error);
	});	
}

//if a popular movie be chosen by click on it its details requested
document.onclick = function(event) {
	const target = event.target;
	
	if (target.classList.contains('list-group-item')) {
		const movieId = target.dataset.movieId;
		const choosenMovie = target;
		const sidenavSection = target.parentElement.parentElement.parentElement;
		const moviesDetailsSection = sidenavSection.nextElementSibling;
		const path = `/movie/${movieId}`;		
		const url = generateURL(path);
		requestMoviesDetails(url);
		
	}	
}

//get the list of genre's name of a movie
function getGenresName(genres) {
	let genresList = "";
	const comma = `<span class="comma">, </span>`;
	
	for (let i = 0; i < genres.length; i++) {				
		if (genres.length > 1){
			genresList += genres[i].name + comma;		
		} else {
			genresList += genres[i].name
		}
	}
	
	return genresList;
		
}

//get the year of release of a movie
function getYearOfRelease(data) {
	const year = new Date(data.release_date).getUTCFullYear();
	return year;
}

//change the display format of movie's release date 
function changeReleaseDateFormat (data) {
	const ReleaseDateNewFormat = new Date(data.release_date).getUTCDate() + 
	"/" + (new Date(data.release_date).getUTCMonth() + 1) + 
	"/" + new Date(data.release_date).getUTCFullYear();	
	return ReleaseDateNewFormat;
}

//mobile burger menu functionality - open/close on click
function burgerMenu() {
	const burgerMenuButton = document.querySelector('button.navbar-toggler');
	const PopularMenuList = document.querySelector('#popularMovies');
	burgerMenuButton.onclick = function() {
		$(PopularMenuList).toggle("slow");
		$(window).resize(function() {
			if($(window).width() > 576) {
				$(PopularMenuList).show(500);
			} else {
				$(PopularMenuList).hide(500);
			}
		});
	}
}
//add/remove active class on selecting a popular movie
function onClickAddActiveClass() {
	const PopularMenuListItem = '#popularMovies .list-group-item';
	$(PopularMenuListItem).click(function() {
		if($(PopularMenuListItem).hasClass("active")) {
			$(PopularMenuListItem).removeClass("active");
			$(this).addClass("active");
		} else {
			$(this).addClass("active");
		}
	});
}