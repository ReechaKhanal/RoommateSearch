// ChatPageTest created with Cypress

describe('Test Chat Page Functionality', () => {

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

  it("Chat Page Functionality", () => {

    // Check if the socket has been connected

    // Try sending a message,

    // Check if the message sent is displayed in the chat window.

    // Check if clicking on the send message button from home page takes you to the chat page

  })
})
