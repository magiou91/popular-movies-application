# popular-movies-application

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#Setup)


## General info
This project is simple an application page that onload has on the left side a list with all popular movies with preselected the first movie.
When the user clicks on a popular movie its details should be appear on the right side.

### Movie details includes:
* Title
* Year of release
* Avarage vote
* Date of release (d/m/y)
* Genres
* Duration in minutes
* Trailer button

When the user clicks on the "see trailer" button the movie trailer should be appear.

When the user types some search term on the search bar and clicks on the magnifier button:
* if there are relative to the search term movies a list of them should be displayed on the right side.
* if there are not any movie a message "NO RESULTS FOR: search term" should be appear.

Some example search terms that you can use to see the functionality: `sunday`, `superman`, `heroes`. But feel free to use your desirable search term.

## Technologies
Project is created with:
* HTML
* Bootstrap
* CSS
* JavaScript (jQuery)

	
## Setup
To run this project, install it locally using npm:

* Install Node js - https://nodejs.org/en/
* Open CMD and go to folder where index.html file is:

```
$ cd popular-movies-application/index.html
$ npm install http-server -g
$ http-server
```

* Go to your browser and type localhost:8080 and press enter.
