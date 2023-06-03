# Chat

# How to initialize the project
`npx create-expo-app --template bare-minimum`

# How to build and run locally
Install expo  
`npm install -g expo-cli`  
`expo install`

## Clear cache and build
`expo r -c`

## For iOS (only Mac)  
Download the simulator from Xcode. (good luck)  
`npm run ios`

# For Android
Download the simulator with Android Studio
https://developer.android.com/studio  
`npm run android`

## Instruction for setting up React Native App on your machine  
https://reactnative.dev/docs/0.68/environment-setup

## Build and release development version
`eas build --platform all --profile development --non-interactive`

## Build and release production version
`expo prebuild`  
`eas build --platform all --profile production --non-interactive`  
`eas submit -p ios`
