cd ./package/design-front
npm install --unsafe-perm
npm run build --base-href=/design/

cd ../../
rm -rf ./nginx/design-front
mv ./package/design-front/dist/design-front ./nginx/design-front
