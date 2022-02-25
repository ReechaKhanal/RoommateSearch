// startup01.js created with Cypress

describe('Startup Roommate Search', () => {

	beforeEach(() => {
	    // Visit http://localhost:4200/ to start testing our application
	    cy.visit('http://localhost:4200/');

      // Check if the login page loads correctly
      cy.contains('Username');
      cy.contains('Password');

      // Enter Test User Name
      cy.get("input[name=uname]").type('Test User', { log: false });
      // Enter Password
      cy.get("input[name=psw]").type('Password', { log: false });

      // Press Login Button
      cy.get("button[type='submit']").click();

      // Login Successful
      cy.contains('About');
	})

  it("Navigation Bar Functionality", () => {

    // Check if Home page contains user cards
    cy.get('.user-card');

		// Click on the profile button and see if it takes us to the profile page
		cy.get('.nav-profile').click()
    cy.contains('Update preferences');
    cy.get('.nav-profile').click()

		// Click on the Chat button in Nav Bar and see if it takes us to the Chat Page
    cy.get('.nav-chat').click();
    cy.contains('Chat History');

    //Click on the About button in Navigation Bar
    cy.get('.about').click();

		// Reaching here would mean everything work correctly
		// Click on the Home button to see if the button is functioning correctly.
    cy.get('.nav-home').click()
    cy.get('.user-card');
  })

})
