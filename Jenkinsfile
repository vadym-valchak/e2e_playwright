pipeline {
   agent { docker {
      image 'mcr.microsoft.com/playwright:v1.47.0-noble'
      args '-v /c/ProgramData/Jenkins/.jenkins/workspace/e2e:/workspace'
   } }
   stages {
      stage('e2e-tests') {
         steps {
            // sh 'npm ci'
            // sh 'npx playwright test'
            sh 'npx playwright --version';
            sh 'ls -al'
         }
      }
   }
}