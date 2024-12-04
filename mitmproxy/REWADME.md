# mitmproxy script

This folder includes a [mitmproxy](https://mitmproxy.org/) [addon](https://docs.mitmproxy.org/stable/addons-overview/) which can replace the OnlyOffice client in any CryptPad instance with files served from the local disk.

## How to install and setup mitmproxy

### 1) Install [mitmproxy](https://mitmproxy.org/)

### 2) Create a dedicated profile for you browser

Since we will weaken you browsers security with a self signed certificate, I suggest that you created a dedicated browser profile you use together with mitmproxy. When using Firefox, you can call `firefox -P` and create a new profile.


### 3) Setup your browser

Start `mitmproxy` from a terminal and configure your browser to use http://localhost:8080 as your proxy for the HTTP and HTTPS protocol.

After that open http://mitm.it/ and download the created certificate for your browser and read the instructions on how to install it.

### 4) Check your setup

Now you should be able to browse the internet and all requests should appear in the terminal where `mitmproxy` is running.

## How to use mitmproxy to replace the OnlyOffice client with a local copy

TODO
