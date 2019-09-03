pipeline {
  agent any

  stages {
    stage('Initialize') {
      steps {
        sh 'chmod a+x PTTWeb2/removeMock.sh'
        sh 'PTTWeb2/removeMock.sh'
      }
    }
    stage('Deploy Mock Backend Server') {
      steps {
        sh 'chmod a+x PTTWeb2/deploy_test_backend.sh'
        sh 'PTTWeb2/deploy_test_backend.sh'
      }
    }
    stage('Build New Image') {
      steps {
        sh 'chmod a+x PTTWeb2/build_test_frontend.sh'
        sh 'PTTWeb2/build_test_frontend.sh'
      }
    }
    stage('Deploy Mock Frontend Server') {
      steps {
        sh 'chmod a+x PTTWeb2/deploy_test_frontend.sh'
        sh 'PTTWeb2/deploy_test_frontend.sh'
      }
    }
    stage('Run Frontend Test') {
       steps {
         sh 'chmod a+x PTTWeb2/PTTFrontEndTest/deploy.sh'
         sh 'PTTWeb2/PTTFrontEndTest/deploy.sh'
       }
    }
    stage('Remove Mock Servers') {
      steps {
        sh 'chmod a+x PTTWeb2/removeMock.sh'
        sh 'PTTWeb2/removeMock.sh'
      }
    }
    stage('Deploy Frontend Server') {
      steps {
        sh 'chmod a+x PTTWeb2/deployServer.sh'
        sh 'PTTWeb2/deployServer.sh'
      }
    }
  }
}

