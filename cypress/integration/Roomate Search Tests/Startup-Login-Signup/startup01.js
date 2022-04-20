// startup01.js created with Cypress

describe('Startup Roommate Search', () => {

	beforeEach(() => {

      cy.viewport( 1270, 900)
	    // Visit http://localhost:4200/ to start testing our application
	    cy.visit('http://localhost:4200/');

      // Check if the login page loads correctly
      cy.contains('Username');
      cy.contains('Password');

      // Enter Test User Name
      cy.get("input[name=uname]").type('test@test.com', { log: false });
      // Enter Password
      cy.get("input[name=psw]").type('test123', { log: false });
      // Press Login Button
      cy.get("button[type='submit']").click();

	})

  it("Navigation Bar Functionality", () => {

    // Check if Home page contains user cards
    cy.get('.user-card');

    cy.wait(500);
    cy.wait(500);
		// Click on the Chat button in Nav Bar and see if it takes us to the Chat Page
    cy.get('.nav-chat').click();
    cy.contains('Chat History');

    cy.wait(500);
    cy.wait(500);
		// Reaching here would mean everything work correctly
		// Click on the Home button to see if the button is functioning correctly.
    cy.get('.nav-home').click()
    cy.get('.user-card');
  })
})
