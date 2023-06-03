all-preview: prebuild build-all-preview submit-all
	@echo "make prebuild"
	@echo "make build"
	@echo "make submit"

all-prod: prebuild build-all-prod submit-all
	@echo "make prebuild"
	@echo "make build"
	@echo "make submit"

ios: prebuild build-ios-preview submit-ios
	@echo "make prebuild"
	@echo "make build"
	@echo "make submit"

android: prebuild build-android-preview submit-android
	@echo "make prebuild"
	@echo "make build"
	@echo "make submit"

prebuild:
	expo prebuild

build-android-preview:
	eas build --platform android --profile preview --non-interactive

build-ios-preview:
	eas build --platform ios --profile production --non-interactive

build-all-preview:
	eas build --platform all --profile preview --non-interactive

build-android-prod:
	eas build --platform android --profile production --non-interactive

build-ios-prod:
	eas build --platform ios --profile production --non-interactive

build-all-prod:
	eas build --platform all --profile production --non-interactive

submit-android:
	eas submit -p android --latest --non-interactive

submit-ios:
	eas submit --platform ios --latest --non-interactive

submit-all:
	eas submit --platform all --latest --non-interactive

preview:
	# Generate Preview Video
	# iphone
	ffmpeg -i ./assets/demo_iphone.mp4 -vf  "setpts=0.5*PTS" ./assets/demo_fast_iphone.mp4
	ffmpeg -i ./assets/demo_fast_iphone.mp4 -vf scale=886x1920,fps=25 -aspect:v 886:1920 ./assets/demo_fast_6_7.mp4
	ffmpeg -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -i ./assets/demo_fast_6_7.mp4 -c:v copy -c:a aac -shortest ./assets/demo_fast_6_7_with_sound.mp4
	ffmpeg -i ./assets/demo_fast_iphone.mp4 -vf scale=1080x1920,fps=25 -aspect:v 1080:1920 ./assets/demo_fast_5_5.mp4
	ffmpeg -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -i ./assets/demo_fast_5_5.mp4 -c:v copy -c:a aac -shortest ./assets/demo_fast_5_5_with_sound.mp4
	
	# ipad
	ffmpeg -i ./assets/demo_ipad.mp4 -vf  "setpts=0.5*PTS" ./assets/demo_fast_ipad.mp4
	ffmpeg -i ./assets/demo_fast_ipad.mp4 -vf scale=1200x1600,fps=25 -aspect:v 1200:1600 ./assets/demo_fast_12_9.mp4
	ffmpeg -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -i ./assets/demo_fast_12_9.mp4 -c:v copy -c:a aac -shortest ./assets/demo_fast_12_9_with_sound.mp4
