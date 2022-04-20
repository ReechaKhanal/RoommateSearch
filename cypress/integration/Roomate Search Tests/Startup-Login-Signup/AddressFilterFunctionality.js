// HomePageTest created with Cypress

describe('Test Home Page Functionality', () => {

	beforeEach(() => {

	    // Visit http://localhost:4200/ to start testing our application

      cy.viewport( 1270, 800)
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

  it("Home Page Functionality", () => {

    // Get the location bar and enter the location - University of Florida, Gainesville, Florida
    cy.get('*[class^="app-home-map"]').type('Tampa, Hillsborough County, Florida, USA')

    // wait for 500 milliseconds - give client enough time to load the locations
    cy.wait(500)
    cy.wait(500)

    cy.get('*[role^="listbox"]')
    cy.get('*[role^="option"]').first().click()

    // Check if the Home Page contains user-cards
    cy.get('.user-card');

    cy.get('*[class^="mat-focus-indicator submitButton"]').click()

    // Check if the user-cards contain a send a message button
    //cy.get('.user-card').contains('Send a message');
    //cy.get('.sendMessageButton').first().click();

    //cy.wait(500)
    // Check if clicking on the send message button from home page takes you to the chat page
    //cy.contains('Chat History');

    // Navigate Back to Home Page
    //cy.get('.nav-home')
    //cy.get('.nav-home').click()
  })
})
