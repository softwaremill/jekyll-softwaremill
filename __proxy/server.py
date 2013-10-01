#!/usr/bin/env python2

import BaseHTTPServer
import SimpleHTTPServer

class MyHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    error_message_format = open("404.html", "r").read()

BaseHTTPServer.test(MyHandler, BaseHTTPServer.HTTPServer)
