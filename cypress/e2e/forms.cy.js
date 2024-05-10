describe('form test',()=>{
    beforeEach(()=>{
        cy.visit('/forms')
    })
    it('Test subscribe form',()=>{
        cy.contains(/testing forms/i)
        cy.getDataTest('subscribe-form').find('input').as('subscribe-input')
        cy.get('@subscribe-input').type('vinny@gmail.com')
        cy.contains(/Successfully subbed/i).should('not.exist')
        cy.getDataTest('subscribe-button').click()
        cy.contains(/Successfully subbed/i).should('exist')
        cy.wait(3000)
        cy.contains(/Successfully subbed/i).should('not.exist')

        cy.get('@subscribe-input').type('vinny@gmail.co.in')
        cy.getDataTest('subscribe-button').click()
        cy.contains(/invalid email/i).should('exist')
        cy.wait(3000)
        cy.contains(/invalid email/i).should('not.exist')
        cy.wait(3000)
        cy.getDataTest('subscribe-button').click()
        cy.contains(/Fail!/i).should('exist')
        cy.wait(3000)
        cy.contains(/fail!/i).should('not.exist')


    })
})