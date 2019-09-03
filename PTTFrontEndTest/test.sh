#!/bin/bash
if [ ! -f "./chromedriver" ]; then
	if [[ "$OSTYPE" == "linux-gnu" ]]; then
		echo "Downloading Chrome driver for Linux ..."
		wget "https://chromedriver.storage.googleapis.com/73.0.3683.68/chromedriver_linux64.zip" -O "chromedriver.zip"

	elif [[ "$OSTYPE" == "darwin"* ]]; then
		echo "Downloading Chrome driver for Mac OSX ..."
		wget "https://chromedriver.storage.googleapis.com/73.0.3683.68/chromedriver_mac64.zip" -O "chromedriver.zip"

	else
		echo "WARNING: Unknown type of OS. Please download the appropriate version of chromedriver for your OS to the current directory from https://chromedriver.storage.googleapis.com/index.html?path=73.0.3683.68/."
	fi

	unzip "chromedriver.zip"
	rm -f "chromedriver.zip"
fi

python test.py
# if [[ "$OSTYPE" == "linux-gnu" ]]; then
# 	# ...
# elif [[ "$OSTYPE" == "darwin"* ]]; then
# 	# Mac OSX
# 	echo "Downloading PhantomJS for Mac OSX ..."
# else
# 	echo "WARNING: Unknown type of OS. Please download the appropriate version of PhantomJS for your OS to the current directory."
# 	# Unknown.
# fi
