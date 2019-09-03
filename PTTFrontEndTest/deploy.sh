#!/bin/sh
cd PTTWeb2/PTTFrontEndTest
sshpass -p u2password ssh u2@172.17.0.7 python3 /6301Spring19PPTPrj2/PTTWeb2/PTTFrontEndTest/test.py http://172.18.0.1:8021
