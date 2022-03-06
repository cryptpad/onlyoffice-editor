CD /D %~dp0
call npm install -g grunt-cli
call npm install

SET PRODUCT_VERSION=4.4.1
SET BUILD_NUMBER=1

rem call grunt --level=WHITESPACE_ONLY --formatting=PRETTY_PRINT
call grunt --level=ADVANCED

pause