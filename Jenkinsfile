pipeline {
    agent any

    stages {
        stage('E2E') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.47.0-noble'
                    reuseNode true
                }
            }

            steps {
               sh 'npm ci'
               sh 'npx playwright test'
            }
        }
    }
}
