describe('Certificación de Acceso - Sistema de Transporte EPN', () => {
  it('Debe permitir el ingreso al Administrador con credenciales válidas', () => {
    // 1. Visitar la aplicación (Cypress usará la baseUrl de Jenkins)
    cy.visit('/')

    // 2. Llenar el formulario usando los IDs de tu componente React
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('123456')

    // 3. Hacer clic en el botón de ingresar
    cy.get('.inicio-sesion-boton').click()

    // 4. VERIFICACIÓN DE FLUJO:
    // Según tu código, el admin es redirigido a /administrador/inicio
    cy.url({ timeout: 10000 }).should('include', '/administrador/inicio')

    // 5. VERIFICACIÓN DE SEGURIDAD (Caja Negra):
    // Verificamos que el token exista en el localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.not.be.null
      const usuario = JSON.parse(win.localStorage.getItem('usuario'))
      expect(usuario.role).to.equal('admin')
    })
  })

  it('Debe mostrar alerta en caso de credenciales incorrectas', () => {
    cy.visit('/')
    cy.get('#email').type('error@epn.edu.ec')
    cy.get('#password').type('clave_falsa')
    cy.get('.inicio-sesion-boton').click()

    // Cypress captura automáticamente las alertas de ventana
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Correo o contraseña incorrectos')
    })
  })
})