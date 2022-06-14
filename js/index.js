// variables to store Number of Employees & API URL
const numberOfEmployees = 12;
const apiUrl = `https://randomuser.me/api/?nat=us,ca&results=${numberOfEmployees}`;
//variable to store employees array
let employees;


// function to return the array of 12 employee objects (JSON) by fetching the API
function getEmployees(){
    return fetch(apiUrl)
        .then(res=> res.json())
        .catch(err=> console.error(err));
}

//async function to initialize the webpage - fetch 12 employees and display
async function init(){
    // wait until we fetch data from API sucessfully by calling getEmployees()
    let data = await getEmployees();
    // store the result from data (which should be an array of employees) in the variable employee
    employees = data.results;
    // log the employees array to see the result
    console.log(employees);
    // generate the gallery by calling generateGallery
    generateGallery();
    // generate search engine by calling generateSearch
    generateSearch();
}

// function to generate card for each employee and append it to div#gallery
function generateGallery(){   
    // variable to store HTML markup for gallery
    let galleryHTML = ``;
    // for each employee in the employees array, add the HTML markup div.card to galleryHTML
    employees.forEach(employee=>{
        galleryHTML += `<div class="card">
                            <div class="card-img-container">
                                <img class="card-img" src="${employee.picture.large}" alt="profile picture">
                            </div>
                            <div class="card-info-container">
                                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                                <p class="card-text">${employee.email}</p>
                                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                            </div>
                        </div>`;
    });
    //set the innerHTML of div#gallery as galleryHTML 
    document.querySelector('#gallery').innerHTML = galleryHTML;

    // for each of the card we inserted above, we add event listener to generate modal when they are clicked
    document.querySelectorAll('.card').forEach((card, index)=>{
        card.addEventListener('click', ()=>{
            generateModal(index);
        });
    });
}

//function to generate modal
function generateModal(index){

    // remove any modal if it exists
    const modal = document.querySelector('.modal-container');
    if(modal) modal.parentElement.removeChild(modal);

    // insert the modal HTML markup after div#gallery
    document.querySelector('#gallery').insertAdjacentHTML('afterend',
    `<div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${employees[index].picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${employees[index].name.first} ${employees[index].name.last}</h3>
                <p class="modal-text">${employees[index].email}</p>
                <p class="modal-text cap">${employees[index].location.city}</p>
                <hr>
                <p class="modal-text">${employees[index].phone}</p>
                <p class="modal-text">${employees[index].location.street.number} ${employees[index].location.street.name}, 
                                        ${employees[index].location.city}, ${employees[index].location.state} ${employees[index].location.postcode},
                                        ${employees[index].location.country}</p>
                <p class="modal-text">Birthday: ${new Date(employees[index].dob.date).toLocaleDateString()}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>`);

    // add event listener to remove modal when close button is clicked
    document.querySelector('.modal-close-btn').addEventListener('click', ()=>{
        const modal = document.querySelector('.modal-container');
        modal.parentElement.removeChild(modal);
    });

    // add event listener to re-generate modal with previous employee when modal-prev button is clicked
    document.querySelector('.modal-prev').addEventListener('click', ()=>{
        let prevIndex = index == 0? employees.length - 1 : index - 1;
        generateModal(prevIndex);
    });

    // add event listener to re-generate modal with next employee when modal-next button is clicked
    document.querySelector('.modal-next').addEventListener('click', ()=>{
        let nextIndex = index == employees.length - 1 ?  0 : index + 1;
        generateModal(nextIndex);
    });
}

// function to generate search engine
function generateSearch(){
    // append the form element for seach engine inside div.search-container
    document.querySelector('.search-container').innerHTML 
        = `<form action="#" method="get">
                <input type="search" id="search-input" class="search-input" placeholder="Search...">
                <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
            </form>`;

    //add event listener to display only the card for employee including the search input word(s) when submit button is clicked
    document.querySelector('#search-submit').addEventListener('click', (event)=>{
        event.preventDefault();
        let input = document.querySelector('#search-input').value;
        document.querySelectorAll('.card').forEach(card=>{
            if(card.textContent.includes(input)){
                card.style.display = 'flex';
            }
            else{
                card.style.display = 'none';
            }
        });
    });
}

// call init() function to initialize the webpage
init();