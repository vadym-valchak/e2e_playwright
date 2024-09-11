pipeline {
   agent {
      docker {
         image 'mcr.microsoft.com/playwright:v1.47.0-noble'
      }
   }

    stages {
        stage('E2E') {
            steps {
               sh 'npm ci'
               sh 'npx playwright test'
            }
        }
    }
}
