theServer=df-prod
theFolder=/var/www/html/app-test/
buildEnv=dev

case "$1" in
    "prod")
        theFolder=/var/www/html/mobile/
        buildEnv='prod'
    ;;
    *)
        # echo 'do nothing'
    ;;
esac

echo "will deploy to folder"$theFolder

echo "start building"
npm run build-$buildEnv

echo "start rsync file"
# rsync -azPv --delete --progress ./build/ $theServer:$theFolder

echo "deploy to ${theFolder} finished"
