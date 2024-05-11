Cypress 
Fundamentals:
1)Describe block: Your tests will exist in a describe block. This block takes two arguments. The first is a description of what you are testing. The second is a callback function for your actually tests within that block.
Example: describe('template spec', () => {})
2)It Block: Within your describe block, you will also have it blocks. It blocks will be single tests within an overall test file. The API for it() is the same as describe. The first argument is the title of an individual test, and the second argument is a callback function containing your test code.
Example: describe('template spec', () => {
  it('passes', () => {})
})

3)Commands and Interacting with elements: Cypress gives you various commands to help you test. You can use these commands on the cy object. For example, cy.visit('/') will navigate the cypress runner to your home page. You have various other commands like cy.click(), cy.type(), cy.check(), etc. *docs NOTE: You must have your dev server running for Cypress to work. NOTE: Cypress has an async nature *docs.
4)Getting Elements: You're often going to want to get an element from the DOM and make some sort of assertion. For example, my h1 element contains certain text. You can get elements in Cypress by using the get function, and pass in a CSS query selector
Ex: cy.get('.list > li') // Yield the <li>'s in .list
5)Command chaining and Assertions: After you get an element, you probably want to do something with that element, like make an assertion. You can to this by chaining on an assertion after getting an element. For example: get(h1).contains('text'). Cypress has various ways of making an assertion *docs
6)Focusing on single test:
You can use it.only() to run a single test
7)beforeEach:
You can use a beforeEach function to perform certain actions prior to every test
Ex: beforeEach(()=>{
    cy.visit('/fundamentals')
  })

This is execute before each test cast (it) declared in the describe block
8)Custom commands
You aren't limited to just the cy.X commands, but you can create your own custom commands. You add your custom commands to cypress/support/commands.ts For example, you might add a custom command getData that gets an element by data-test
Ex: Cypress.Commands.add('getDataTest', (dataTestSelector)=>{
    return cy.get(`[data-test="${dataTestSelector}"]`)
})

TO use it:=>    cy.getDataTest('fundamentals-header').should('contain.text',"Testing Fundamentals")


Forms
1)	Get Form:
First, we need to get the form
        cy.visit('/forms')
2)	Type in form:
 cy.getDataTest('subscribe-form').find('input').as('subscribe-input')
        cy.get('@subscribe-input').type('vinny@gmail.com')
Here- as function call is to give an alias to every command chained before it
3)Subscribe:
        cy.getDataTest('subscribe-button').click()
P.S: getDataTest() is a custom command we created on 8th point in fundamentals
4)Test Success/Fail:
Execute /create flow for success,fail,wrong data.
Ex: success:
 cy.getDataTest('subscribe-button').click()
        cy.contains(/Successfully subbed/i).should('exist')

Read:-> waiting and retry-ability from docs : https://learn.cypress.io/cypress-fundamentals
5)Test validation:


Multi page Testing:
You can quite easily write tests across pages to better test entire user workflows. You can click on navigation buttons or use cy.visit(). You can also use cy.location("pathname").should("equal", "/some-path") to assert you're in the correct location.
Example:
it('multi page testing',()=>{
	  cy.visit("/examples")	
        cy.getDataTest('nav-overview').click()
        cy.location('pathname').should('equal','/overview')

        cy.getDataTest('nav-why-cypress').click()
        cy.location('pathname').should('equal','/')

        cy.getDataTest('nav-fundamentals').click()
        cy.location('pathname').should('equal','/fundamentals')

        cy.getDataTest('nav-forms').click()
        cy.location('pathname').should('equal','/forms')

        cy.getDataTest('nav-examples').click()
        cy.location('pathname').should('equal','/examples')


Intercepts:
Cypress provides different ways of working with network requests. One way is by using intercepts *docs & example
Example:
 it('intercept post button',()=>{
	  cy.visit("/examples")	
        cy.intercept('POST','http://localhost:3000/examples',{
            fixture:'example.json'
        })
        cy.getDataTest('post-button').click()
    })
What the above test block does is, when a post request is sent to the url specified in example, it mocks the data returned from the url as datat from example.json file.
Helpful Methods:
Cypress provides a ton of methods. It's not really feasible to try to learn every single one. A popular ones include cy.its(), cy.invoke(), cy.request(), cy.within() -- *docs
CRUD TESTING: Below code has example for creating and deleting note from ui.
it.only('grudge list tests',()=>{
        cy.contains(/add some grudges/i)
        cy.getDataTest('grudge-list').within(()=>{
            cy.get('li').should('have.length',0)
        })
        cy.getDataTest('grudge-heading').should('have.text','Add Some Grudges')
        cy.getDataTest('grudge-input').within(()=>{
            cy.get('input').type('First grudge')
        })
         cy.getDataTest('grudge-button').click()
         cy.getDataTest('grudge-heading').should('have.text','Grudges')

        cy.getDataTest('grudge-list').within(()=>{
            cy.get('li').should('have.length',1).should('exist')
        })
        cy.getDataTest('grudge-input').within(()=>{
            cy.get('input').type('Second grudge')
        })
         cy.getDataTest('grudge-button').click()
        cy.getDataTest('grudge-list').within(()=>{
            cy.get('li').should('have.length',2).should('exist')
            cy.get('li').its(0).should('contain.text', 'First grudge').should('exist')
        })
        cy.getDataTest('grudge-list').within(()=>{
            cy.get('li').should('exist').its(0).within(()=>{
                cy.get('button').click()
            })
        })
        cy.getDataTest('grudge-list').within(()=>{
            cy.get('li').should('have.length',1).should('exist')
        })
        cy.getDataTest('clear-button').click()
        cy.getDataTest('grudge-list').within(()=>{
            cy.get('li').should('have.length',0)
        })
    
    })


Component Testing
Overview:
Cypress also allows you to test individual components of your app via component tests
Component Vs E2E.

Component vs E2E:
Cypress Component Testing uses the same test runner, commands, and API to test components instead of pages. However, the main difference is that Cypress Component Testing builds your components using a development server instead of rendering within a complete website, which results in faster tests and fewer dependencies on infrastructure than end-to-end tests covering the same code paths.
Additional configuration:
You may need to add additional configuration to your project to support component tests. For example, In Next JS you'll need to add something like: const { defineConfig } = require('cypress') module.exports = defineConfig({ component: { devServer: { framework: 'next', bundler: 'webpack', }, }, })

Example:
You can mount a component using cy.mount(). Then, you can interact and make assertions just as you would in an E2E test. Let's go test our Accordion.

Best Practices
1)Test Unhappy paths:
Don't just test the 'happy path' of the user. Make sure to test users that might be maliciously using your app or actions that might not be common.
2)Use stable selectors:
Use data-* attributes to provide context to your selectors and isolate them from CSS or JS changes. Don't target elements based on CSS attributes such as: id, class, tag. Don't target elements that may change their textContent. Don't use too generic selector (e.g. cy.get(button)) Don't couple it to styles.
3)Do not assign return value:
Cypress does NOT run synchonously. See *docs
4)Do not test external sites:
Only test websites that you control. Try to avoid visiting or requiring a 3rd party server. If you choose, you may use cy.request() to talk to 3rd party servers via their APIs. If possible, cache results via cy.session() to avoid repeat visits
5)Keep tests independent
Don't make one test dependent on another. This becomes extremely difficult to manage. Trust me
6)Do not worry about writing tiny tests
Writing tiny tests, like unit tests, is non-performant and excessive. Cypress resets various state and tests between tests that takes a long time. So small tests hurt performance. Plus, you'll still know exactly what assertion fails in a longer e2e test
7)Clean up state before tests run
Don't clean up state with after or afterEach. One benefit of Cypress is incrementally writing tests and application code. And if the state isn't maintained after a test, it can make it more difficult to know what you should test next. If something fails in the middle of your test, the after cleanup functions won't get a chance to run. Cypress already cleans up state between tests, so this might not be something you need to worry about at all.
8)Using arbitrary cy.wait()
Use route aliases or assertions to guard Cypress from proceeding until an explicit condition is met. *docs
Ex: cy.wait(3000) will halt the execution for 3 sec











