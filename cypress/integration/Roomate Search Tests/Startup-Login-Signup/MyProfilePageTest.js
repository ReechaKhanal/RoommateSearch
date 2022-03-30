
// My-Profile Page Test created with Cypress

describe('Test My-Profile Page Functionality', () => {

	beforeEach(() => {

	    // Visit http://localhost:4200/ to start testing our application
	    cy.visit('http://localhost:4200/');

      // Check if the login page loads correctly
      cy.contains('Username');
      cy.contains('Password');

      // Enter Test User Name and Password
      cy.get("input[name=uname]").type('test@test.com', { log: false });
      cy.get("input[name=psw]").type('test123', { log: false });

      // Press Login Button
      cy.get("button[type='submit']").click();
	})

  it("My-Profile Page Functionality", () => {

    // Check the userID API

    // Check if the Profile Page contains user name and information

    // Check if the Profile Page contains the update preferences button

    // Check if clicking on the update preferences button from profile page takes you to the edit-profile page

  })
})
