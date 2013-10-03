#!/usr/bin/env python2

import BaseHTTPServer
import SimpleHTTPServer


class MyHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    error_message_format = open("404.html", "r").read()

    routes = {
        "/wp-content/uploads/": "/img/uploads/"
    }

    def do_GET(self):
        for before, after in self.routes.items():
            if self.path.startswith(before):
                self.path = after + self.path[before.__len__():]

        SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)


BaseHTTPServer.test(MyHandler, BaseHTTPServer.HTTPServer)
