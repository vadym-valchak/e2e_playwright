pipeline {
   // agent { docker { image 'mcr.microsoft.com/playwright:v1.47.0-noble' } }
   agent any
   stages {
      stage('e2e-tests') {
         steps {
            sh 'li'
            // sh 'npm ci'
            // sh 'npx playwright test'
         }
      }
   }
}