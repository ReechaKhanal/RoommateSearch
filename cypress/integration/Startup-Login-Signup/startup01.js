// startup01.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
/// <reference types="cypress" />

describe('Startup Roommate Search', () => {

	beforeEach(() => {
	    // Visit http://localhost:4200/ to start testing our application
	    cy.visit('http://localhost:4200/')
 	})

	it('Load login page correctly', () => {
		// Check if the login page loads correctly
		cy.contains('Username');
		cy.contains('Password');
	})

	it('Check Login Functionality', () => {
		// Enter Test User Name
		cy.get("input[name=uname]").type('Test User', { log: false });
		// Enter Password
		cy.get("input[name=psw]").type('Password', { log: false });

		// Press Login Button
		cy.get("button[type='submit']").click()

	})


})
