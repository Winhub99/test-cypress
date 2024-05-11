describe('various examples',()=>{

    beforeEach(()=>{
        cy.visit("/examples")
    })
    it('multi page testing',()=>{
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

        cy.getDataTest('nav-component').click()
        cy.location('pathname').should('equal','/component')

        cy.getDataTest('nav-best-practices').click()
        cy.location('pathname').should('equal','/best-practices')
    })
    it('intercept post button',()=>{
        cy.intercept('POST','http://localhost:3000/examples',{
            fixture:'example.json'
        })
        cy.getDataTest('post-button').click()
    })
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
        

})