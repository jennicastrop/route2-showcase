/// <reference types="cypress" />

beforeEach(() => {
  cy
    .request('POST', '/reset');

});
it('.route() (without stubbing)', () => {

  cy
    .server()
    .route({
      method: 'GET',
      url: '/todos'
    }).as('todoslist');

  cy
    .visit('/'); // open page

  cy
    .wait('@todoslist'); // items load from server via api
});

it('.route() (with stubbing)', () => {

  cy
    .server()
    .route({
      method: 'GET',
      url: '/todos',
      response: 'fx:todos'
    }).as('todoslist');

  cy
    .visit('/'); // open page

  cy
    .wait('@todoslist'); // items load from server via api

});

it('.route2() works with fetch', () => {

  cy
    .route2({
      method: 'POST',
      path: '/todos'
    })
    .as('createTodo');

  cy
    .visit('/');

  cy
    .addItem('new todo item'); // fetch request fired when adding item

  cy
    .wait('@createTodo');

});

it('.route2() waits for css and images', () => {

  cy
    .route2('/vendor/index.css')
    .as('css');

  cy
    .route2('/vendor/cypress-icon.png')
    .as('logo');

  cy
    .visit('/');

  cy
    .wait('@css')
    .wait('@logo');

});

it('.route2() changes request header', () => {

  cy
    .route2({
      method: 'POST',
      path: '/todos'
    }, (req) => {
      req.headers['Mr-Meeseeks'] = 'Look at me!!'; // add a new header
    })
    .as('createTodo');

  cy
    .visit('/');

  cy
    .addItem('new todo item');

});

it('.route2() changes request body', () => {

  cy
    .route2({
      method: 'POST',
      path: '/todos'
    }, (req) => {
      const requestBody = JSON.parse(req.body);

      req.body = JSON.stringify({
        ...requestBody,
        title: 'Wubba Lubba Dub Dub!'
      });
    })
    .as('createTodo');

  cy
    .visit('/');

  cy
    .addItem('new todo item'); // text of this todo is going to be changed

});
