pipeline {
    agent any
    stages {
        stage('1. Preparar') {
            steps { checkout scm }
        }
        stage('2. Levantar Entorno') {
            steps {
                sh 'docker-compose up -d --build'
                echo 'Esperando 30s a que MySQL procese el BDD.sql...'
                sleep 30 
            }
        }
        stage('3. Certificación Cypress') {
            steps {
                // Usamos --network=host para que Cypress vea a los contenedores como localhost
                sh 'docker run --rm --network=host -v ${WORKSPACE}:/e2e -w /e2e cypress/included:latest'
            }
        }
    }
    post {
        failure {
            echo '------ LOGS DEL BACKEND (DEPURACIÓN) ------'
            sh 'docker logs certificacion-transporte-epn-backend-1'
        }
        always {
            sh 'docker-compose down'
            archiveArtifacts artifacts: 'cypress/screenshots/**', allowEmptyArchive: true
        }
    }
}