cd ./package/design-front
npm install
npm run build

cd ../../
rm -rf ./nginx/design-front
mv ./package/design-front/dist/design-front ./nginx/design-front