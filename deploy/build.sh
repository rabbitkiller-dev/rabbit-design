### update
git pull

### build front
cd ./package/design-front
npm install --unsafe-perm
npm run build --base-href=/design/

cd ../../
rm -rf ./nginx/design-front
mv ./package/design-front/dist/design-front ./nginx/design-front

### start server
cd ./package/design-server
npm install --unsafe-perm
npm run stop
npm run tsc
npm run start
cd ../../
