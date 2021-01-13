console.log("Welcome to News Wale");

const apiKey = "0525a7a9888c484b8b5abe878203c534"; // Api Key 1
// const apiKey = "781fb59e340c421d849ee991769a1f9d"; // Api key 2

function showArticles(newsCountryVal, trendingInCountry = "India") {

    let newsCountry = newsCountryVal;
    let newsSource = "bbc-news"; // Particular news source can be added visit:https://newsapi.org/ for more info.

    // Creates an XHR object.
    const XHR = new XMLHttpRequest();

    // Makes a get request.
    XHR.open("GET", `http://newsapi.org/v2/top-headlines?country=${newsCountry}&apiKey=${apiKey}`, true);

    // onload makes the content display inside DOM
    XHR.onload = function () {

        if (this.status === 200) {
            let showErrorMsg = document.querySelector(".noNews");
            showErrorMsg.style.display = "none";
            document.querySelector(".homeBtn").style.display = "none";
            document.getElementById("trendingNews").innerText = `${trendingInCountry}`;

            let json = JSON.parse(this.responseText); // Response will be in string format, converting it into JSON.
            let articelArr = json.articles; // Getting the only information that is related to news articles, content, author, source etc. It is an array.

            let accordionFlushExample = document.getElementById("accordionFlushExample");
            let newsUI = "";

            // Iterating the JSON(articles) that we have got from the response.
            articelArr.forEach((element, index) => {

                if (element.content == null) {
                    newsUI += `
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-heading${index}">
                            
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${index}" aria-expanded="false" aria-controls="flush-collapse${index}">
                            <b class="badge bg-danger mx-2">Breaking News: </b> ${element.title}
                            </button>
                        </h2>
                        <div id="flush-collapse${index}" class="accordion-collapse collapse" aria-labelledby="flush-heading${index}" data-bs-parent="#accordionFlushExample">
                            <div class="accordion-body"> <img class="border border-3 border-warning img-fluid rounded mx-auto my-3 d-block" src="${element.urlToImage}" alt="Error in loading image" /> <P class="newsContent">${element.description} <a href="${element["url"]}" target="-blank">Read full article </a></p>  </div>
                        </div>
                    </div>`;
                }
                else {
                    newsUI += `
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-heading${index}">
                            
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${index}" aria-expanded="false" aria-controls="flush-collapse${index}">
                            <b class="badge bg-danger mx-2">Breaking News: </b> ${element.title}
                            </button>
                        </h2>
                        <div id="flush-collapse${index}" class="accordion-collapse collapse" aria-labelledby="flush-heading${index}" data-bs-parent="#accordionFlushExample">
                            <div class="accordion-body"> <img class="border border-3 border-warning img-fluid rounded mx-auto my-3 d-block" src="${element.urlToImage}" alt="Error in loading image" /> <P class="newsContent">${element.content} <a href="${element["url"]}" target="-blank">Read full article </a></p>  </div>
                        </div>
                    </div>`;
                }
            });

            accordionFlushExample.innerHTML = newsUI; // Inserting news inside DOM this will display news articles.
        }
        else {
            let showErrorMsg = document.querySelector(".noNews");
            showErrorMsg.getElementsByClassName.display = "flex"; // If there is any error then show a message to the user.
            console.error("Something went wrong!");
            console.log(this.responseText);
        }
    }

    XHR.send();
}

// Event handler for selecting a country
let showNewsFrom = document.getElementById("showNewsFrom");
showNewsFrom.addEventListener("click", (e) => {
    let countryVal = document.getElementById("selectCountry").value; // Getting the country code/value which is required for the api. 
    let selectCountry = document.getElementById("selectCountry");
    let countryName = selectCountry.options[selectCountry.selectedIndex].text; // Getting the country name from drop down options.
    showArticles(countryVal, countryName);
    e.preventDefault();
});

// Event handler for search bar (Highlighting news articles).
let searchBar = document.getElementById("searchBar");
searchBar.addEventListener("input", highlightArticles);

function highlightArticles() {
    let searchBar = document.getElementById("searchBar");
    let searchTerm = searchBar.value.toLowerCase().trim();
    let newsArticlesArr = document.getElementsByClassName("accordion-item");

    Array.from(newsArticlesArr).forEach((element) => {
        let articleTitle = element.querySelector(".accordion-button").innerText.toLowerCase();
        let articleContent = element.querySelector(".newsContent").innerText.toLowerCase();

        if (searchTerm == "") {
            element.style.border = "1px solid white";
        }
        else if (articleTitle.includes(searchTerm) || articleContent.includes(searchTerm)) {
            element.style.border = "2px solid red";
        }
        else {
            element.style.border = "1px solid white";
        }
    });
}

// Event handler for search button
let searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", searchNewsHandler);

function searchNewsHandler(e) {
    let searchBar = document.getElementById("searchBar");
    let searchTerm = searchBar.value.toLowerCase().trim();
    searchBar.value = "";

    if (searchTerm == "") { // If someone searches empty search term then the country will remain the selected one not other (India).
        let countryVal = document.getElementById("selectCountry").value; // Getting the country code/value which is required for the api. 
        let selectCountry = document.getElementById("selectCountry");
        let countryName = selectCountry.options[selectCountry.selectedIndex].text; // Getting the country name from drop down options.
        document.getElementById("searchResMsg").style.display = "none"; // Hiding the result message if blank search takes place.
        showArticles(countryVal, countryName);
    }
    else {
        document.querySelector(".homeBtn").style.display = "inline";
        let searchResMsg = document.getElementById("searchResMsg");
        searchResMsg.style.display = "block";
        searchResMsg.innerHTML = `Showing search results for "<em>${searchTerm}</em>"`;

        let newsArticlesArr = document.getElementsByClassName("accordion-item");
        let noSearchMatch = true;

        Array.from(newsArticlesArr).forEach((element) => {
            let articleTitle = element.querySelector(".accordion-button").innerText.toLowerCase();
            let articleContent = element.querySelector(".newsContent").innerText.toLowerCase();

            if (articleTitle.includes(searchTerm) || articleContent.includes(searchTerm)) {
                noSearchMatch = false;
                element.style.border = "2px solid red";
                element.className += " my-3";
                element.style.display = "block";
            }
            else {
                element.style.display = "none";
            }
        });

        if (noSearchMatch) {
            searchResMsg.innerHTML = `Sorry no news article found for "<em>${searchTerm}</em>"`;
        }
    }

    e.preventDefault();
}

// Go back to home button event handler
let homeBtn = document.querySelector(".homeBtn");
homeBtn.addEventListener("click", () => {
    let countryVal = document.getElementById("selectCountry").value; // Getting the country code/value which is required for the api. 
    let selectCountry = document.getElementById("selectCountry");
    let countryName = selectCountry.options[selectCountry.selectedIndex].text; // Getting the country name from drop down options.
    document.getElementById("searchResMsg").style.display = "none"; // Hiding the result message if blank search takes place or results dont match.
    showArticles(countryVal, countryName);
})

showArticles("in"); // By default indian news will show.