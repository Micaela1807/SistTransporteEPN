pipeline {
    agent any

    stages {
        stage('1. Clonar Código') {
            steps {
                checkout scm
            }
        }

        stage('2. Levantar Entorno (Docker)') {
            steps {
                // Levantamos Base de Datos, Backend y Frontend
                sh 'docker-compose up -d --build'
                // Damos tiempo a MySQL para que procese el BDD.sql
                echo 'Esperando a que la Base de Datos esté lista...'
                sleep 20 
            }
        }

        stage('3. Pruebas de Certificación (Cypress)') {
            steps {
                // Ejecutamos Cypress contra nuestro Frontend recién levantado
                sh 'docker run --rm --network="host" -v ${WORKSPACE}:/e2e -w /e2e cypress/included:latest --config baseUrl=http://localhost:3000'
            }
        }
    }

    post {
        always {
            // Bajamos los contenedores para no consumir recursos de la VM
            sh 'docker-compose down'
            // Guardamos capturas si algo falló
            archiveArtifacts artifacts: 'cypress/screenshots/**', allowEmptyArchive: true
        }
    }
}