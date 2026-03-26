describe('Prueba de Error Forzado - Auditoría EPN', () => {
  it('Debe fallar al buscar un botón que no existe (Evidencia de Screenshot)', () => {
    // 1. Visitamos la app
    cy.visit('/')

    // 2. Intentamos hacer clic en un botón con un ID inventado
    // Esto va a fallar porque ese ID no existe en tu React
    cy.get('#boton-fantasma-epn', { timeout: 5000 }).click()
  })

  it('Debe fallar por un título incorrecto', () => {
    cy.visit('/')
    // Tu título real es "SISTEMA DE TRANSPORTE ESTUDIANTIL"
    // Vamos a pedirle que busque algo totalmente distinto
    cy.contains('BIENVENIDO AL ESPACIO EXTERIOR').should('be.visible')
  })
})