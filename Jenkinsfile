pipeline {
    agent any
    
    environment {
        AWS_DEFAULT_REGION = 'us-east-1'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                          branches: [[name: 'master']],
                          userRemoteConfigs: [[credentialsId: 'BuildAngularDeployS3_Pipeline_GitHub_ID',
                                               url: 'https://github.com/pradeeprakshe/angulars3website.git']]])
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                sh 'export NG_CLI_ANALYTICS=ci'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run'
            }
        }
        
        stage('Deploy to S3') {
            steps {
                withAWS(credentials: 'BuildAngularDeployS3_AWS_Credentials', region: 'us-east-1') {
                    s3Upload(bucket: 'angulars3webistetest01', path: '/', file: 'dist/*')
                }
            }
        }
    }
}
