


pipeline {
   agent any
   agent { docker { image 'mcr.microsoft.com/playwright:v1.47.0-noble' } }
   stages {
      stage('e2e-tests') {
         steps {
            sh 'npm ci'
            sh 'npx playwright test'
         }
      }
   }
}

pipeline {
    agent any

    stages {
        stage('E2E') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
                    reuseNode true
                }
            }

            steps {
                sh '''
                    npx playwright test
                '''
            }
        }
    }

   //  post {
   //      always {
   //          junit 'jest-results/junit.xml'
   //      }
   //  }
}
