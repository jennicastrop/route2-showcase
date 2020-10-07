/// <reference types="cypress" />


beforeEach(() => {
  cy.request('POST', '/reset')

})
it('.route() (without stubbing)', () => {

  cy
    .server()
    .route({
      method: 'GET',
      url: '/todos'
    }).as('todoslist')

  cy.visit('/') // open page
  cy.wait('@todoslist') // items load from server via api
})

it('.route() (with stubbing)', () => {

  cy.server()
    .route({
      method: 'GET',
      url: '/todos',
      response: 'fx:todos'
    }).as('todoslist')

  cy.visit('/') // open page
  cy.wait('@todoslist') // items load from server via api
})

it('.route2() works with fetch', () => {

  cy.route2({
      method: 'POST',
      path: '/todos'
    })
    .as('createTodo')

  cy.visit('/')
  cy.addItem('new todo item') // fetch request fired when adding item
  cy.wait('@createTodo').then( request => {
    cy.log(request.response.body)
  })
})

it('.route2() changes request header', () => {

  cy
    .route2({
      method: 'POST',
      path: '/todos'
    }, (req) => {
      //Intercepting a request and modifying an outgoing request
      req.headers['Mr-Meeseeks'] = 'Look at me!!' // add a new header
    })
    .as('createTodo')

  cy.visit('/')
  cy.addItem('new todo Jen')
  cy.wait('@createTodo').its('response.body').should('include', 'title')
})

it('.route2() changes request body', () => {

  cy
    .route2({
      method: 'POST',
      path: '/todos'
    }, (req) => {
      const requestBody = JSON.parse(req.body)
      debugger
      req.body = JSON.stringify({
        ...requestBody,
        title: 'Wubba Lubba Dub Dub!'
      })
    })
    .as('createTodo')

  cy.visit('/')
  cy.addItem('new todo item') // text of this todo is going to be changed
})
