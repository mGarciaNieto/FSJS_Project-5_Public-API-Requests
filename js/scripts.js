/* Treehouse FSJS Techdegree
 * Project 5 - Public API Requests
 * scripts.js */

/* @author Manuel Garcia-Nieto */

'use strict'

/* DOM References
--------------------------------------------------------- */
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture, email, location, phone, dob &noinfo &nat=US`
const search = document.querySelector('.search-container')
const gallery = document.getElementById('gallery')
const body = document.querySelector('body')
const h1 = document.querySelector('h1')

/* Dinamic DOM References
--------------------------------------------------------- */
let searchInput
let cardIndex

/* Variables and Constants
--------------------------------------------------------- */
let employees = []
const firstCard = 0
const lastCard = 11

/* Styles added
--------------------------------------------------------- */
const mediaQuery = window.matchMedia('(min-width: 1024px)')
body.style.backgroundColor = '#212529'
h1.style.color = '#f6fcf9'

// Adjusts h1 font-size depending on screen size, wider than 1024 2rem, 1.25em otherwise
mediaQuery.matches ? (h1.style.fontSize = '2.2rem') : (h1.style.fontSize = '1.25em')

// listens for changes on screen size
mediaQuery.addListener(() => {
  if (mediaQuery.matches) {
    h1.style.fontSize = '2.2rem'
  } else {
    h1.style.fontSize = '1.25em'
  }
})

/* Fetch from the API
--------------------------------------------------------- */
fetch(urlAPI)
  .then((res) => res.json())
  .then((res) => res.results)
  .then(displayEmployees)
  .catch((err) => {
    document.body.insertAdjacentHTML('afterbegin', '<h4>Failed to load employees</h4>')
    console.log(`API request failed: ${err}`)
  })

/**
 * Displays employee cards
 * @param  {object} employeeData
 */
function displayEmployees(employeeData) {
  employees = employeeData
  let employeeHTML = ''

  employees.forEach((employee, index) => {
    let name = employee.name
    let email = employee.email
    let city = employee.location.city
    let state = employee.location.state
    let picture = employee.picture

    employeeHTML += `<div class="card" data-index="${index}">
                        <div class="card-img-container">
                          <img class="card-img" src="${picture.large}" alt="profile picture">
                        </div>
                        <div class="card-info-container">
                          <h3 id="name" class="card-name cap">${name.first} ${name.last}</h3>
                          <p class="card-text">${email}</p>
                          <p class="card-text cap">${city}, ${state}</p>
                        </div>
                      </div>`
  })
  gallery.insertAdjacentHTML('beforeend', employeeHTML)

  // Adds suttle animation to cards when page loads
  const employeeCards = document.querySelectorAll('div.card')
  const cards = [...employeeCards]
  for (const card of cards) {
    let randomAniDelay = Math.floor(Math.random() * 500)
    card.style.animation = `fadeIn 1s .${randomAniDelay}s ease forwards`
  }
}

/**
 * Adds a search feature to filter employee by name
 */
const addSearch = function () {
  const searchHTML = `<form action="#" method="get">
                        <input type="search" id="search-input" class="search-input" placeholder="Filter employee...">
                        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                      </form>`

  search.insertAdjacentHTML('beforeend', searchHTML)
  searchInput = document.getElementById('search-input')
}

// calls function
addSearch()

/**
 * Selects and display modal card
 * @param  {event} 'click'
 * @param  {listener} (e)
 */
gallery.addEventListener('click', (e) => {
  if (e.target !== gallery) {
    const card = e.target.closest('.card')
    cardIndex = card.getAttribute('data-index')
    displayModal(cardIndex)
  }
})

/**
 * Displays card modal
 * @param  {int} index
 */
const displayModal = (index) => {
  // Dissables 'PREV' button on first card and 'NEXT' button on last card
  let disabledPrev = ''
  let disabledNext = ''
  if (index == firstCard) {
    disabledPrev = 'disabled'
  } else if (index == lastCard) {
    disabledNext = 'disabled'
  }

  let {
    name,
    dob,
    phone,
    email,
    location: { city, street, state, postcode },
    picture
  } = employees[index]
  let date = new Date(dob.date)
  const modalHTML = `
                      <div class="modal-container">
                      <div class="modal">
                          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                          <div class="modal-info-container">
                              <img class="modal-img" src="${picture.large}" alt="profile picture of: ${name.first} ${name.last} ">
                              <h3 id="name" class="modal-name cap">${name.first} ${name.last}</h3>
                              <p class="modal-text">${email}</p>
                              <p class="modal-text cap">${city}</p>
                              <hr>
                              <p class="modal-text">${phone}</p>
                              <p class="modal-text">${street.number} ${street.name}, ${state} ${postcode}</p>
                              <p class="modal-text">Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
                          </div>
                      </div>

                      // IMPORTANT: Below is only for exceeds tasks 
                      <div class="modal-btn-container">
                          <button type="button" ${disabledPrev} id="modal-prev" class="modal-prev btn">Prev</button>
                          <button type="button" ${disabledNext} id="modal-next" class="modal-next btn">Next</button>
                      </div>
                    </div>
    `
  gallery.insertAdjacentHTML('afterend', modalHTML)

  const modalContainer = document.querySelector('.modal-container')
  // Closes modal card
  document.getElementById('modal-close-btn').addEventListener('click', (e) => {
    modalContainer.remove()
  })

  // Selects and shows previous employee card
  document.getElementById('modal-prev').addEventListener('click', (e) => {
    modalContainer.remove()
    if (cardIndex > firstCard) {
      cardIndex--
      displayModal(cardIndex)
    } else if (cardIndex === firstCard) {
      displayModal(firstCard)
    }
  })

  // Selects and shows next employee card
  document.getElementById('modal-next').addEventListener('click', (e) => {
    modalContainer.remove()
    if (cardIndex < lastCard) {
      cardIndex++
      displayModal(cardIndex)
    } else if (cardIndex === lastCard) {
      displayModal(lastCard)
    }
  })
}

/**
 * Searches and selects matching employee card's by name
 * @param  {event} 'input'
 * @param  {listener} (e)
 */
searchInput.addEventListener('input', (e) => {
  const names = document.querySelectorAll('h3.card-name')
  const currentValue = searchInput.value.toUpperCase()
  const employees = [...names]

  for (const employee of employees) {
    if (employee.innerHTML.toUpperCase().includes(currentValue)) {
      employee.closest('.card').style.display = 'flex'
    } else {
      employee.closest('.card').style.display = 'none'
    }
  }
})
