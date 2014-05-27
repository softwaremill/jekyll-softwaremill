#!/usr/bin/env python2

import BaseHTTPServer
import SimpleHTTPServer
import SocketServer
import subprocess
import cgi


class MyHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    error_message_format = open("404.html", "r").read()

    rewrites = {
        "/wp-content/uploads/": "/img/uploads/",
        "/joinus": "/join-us"
    }

    dynamics = {
        "/dynamic/contact.json.php": "../__dynamic/contact.json.php",
        "/dynamic/newsletter.json.php": "../__dynamic/newsletter.json.php"
    }

    def do_GET(self):
        for before, after in self.rewrites.items():
            if self.path.startswith(before):
                self.path = after + self.path[before.__len__():]
                break

        if '?' in self.path:
            self.path = self.path.split('?')[0]

        SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={"REQUEST_METHOD": "POST"}
        )

        env = {}
        for item in form.list:
            env[item.name] = item.value

        for request_path, php_file in self.dynamics.items():
            if self.path.startswith(request_path):
                proc = subprocess.Popen(["php", php_file], env=env, stdout=subprocess.PIPE)
                output = proc.communicate()[0]

                print "Input:  " + env.__str__()
                print "Output: " + output

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", output.__len__())
                self.end_headers()
                self.wfile.write(output)
                break

        self.do_GET()


class ThreadingSimpleServer(SocketServer.ThreadingMixIn, BaseHTTPServer.HTTPServer):
    pass


BaseHTTPServer.test(MyHandler, ThreadingSimpleServer)
