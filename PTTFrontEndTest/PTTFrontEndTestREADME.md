# PTTWeb2 Frontend Test by Selenium
## Setup Website
1. Install `npm` (recommand version: 6.5.0-next.0)
2. Run the following commands to setup the environment:
```
cd PTTWeb2
npm install
```
## Run Website
```
npm start
```
## Install selenium python library
```
pip install selenium
or
pip3 install selenium
```
## Download chromedriver which should be in the same folder of the test1.py file.
## Run test
```
cd PTTFrontEndTest
python test.py <url> # The url where our front host is hosted.
or
python3 test.py <url>
```
## Note
Use(optionally) test.sh shell script to download chomedriver before launching the testing.
test1.py is python3 code.

##Notice

Driver Path should be modified accorrding to your own path