export NODE_ENV='production'
npm run build
scp -i ~/Documents/test-new.pem -r  ./build/* ubuntu@ec2-13-125-43-43.ap-northeast-2.compute.amazonaws.com:/var/www/html/mobile
#ssh -i ~/Documents/test-new.pem ubuntu@ec2-13-125-43-43.ap-northeast-2.compute.amazonaws.com "cp -rf ~/derify-app-mobile/build/* /var/www/html/app-test/"
