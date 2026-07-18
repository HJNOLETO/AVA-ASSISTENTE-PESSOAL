"""
AVATron Server — Servidor HTTP interno do Unreal Engine
Porta 30011 | Executa Python remotamente
"""
import unreal
import http.server
import json
import threading
import traceback
import io
import sys

PORT = 30011

class AvaHandler(http.server.BaseHTTPRequestHandler):
    """Handler que recebe comandos Python e executa no editor."""

    def log_message(self, format, *args):
        pass

    def do_POST(self):
        if self.path != "/exec":
            self._respond(404, {"error": "Use POST /exec"})
            return

        try:
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            data = json.loads(body)
            code = data.get("code", "")
        except Exception as e:
            self._respond(400, {"error": f"Bad request: {e}"})
            return

        if not code:
            self._respond(400, {"error": "Missing 'code' field"})
            return

        stdout = io.StringIO()
        stderr = io.StringIO()
        old_out, old_err = sys.stdout, sys.stderr
        sys.stdout, sys.stderr = stdout, stderr

        result = None
        error = None

        try:
            exec_globals = {"unreal": unreal, "__builtins__": __builtins__}
            exec(code, exec_globals)
            result = stdout.getvalue()
        except Exception:
            error = stderr.getvalue() + "\n" + traceback.format_exc()
        finally:
            sys.stdout, sys.stderr = old_out, old_err

        self._respond(200, {"result": result, "error": error})

    def do_GET(self):
        if self.path == "/ping":
            self._respond(200, {"status": "ok", "editor": "connected"})
        else:
            self._respond(404, {"error": "Not found"})

    def _respond(self, code, data):
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))


def start_server():
    server = http.server.HTTPServer(("127.0.0.1", PORT), AvaHandler)
    unreal.log(f"[AVATron] Servidor iniciado em http://localhost:{PORT}")
    unreal.log(f"[AVATron] POST /exec  -> executar codigo Python")
    unreal.log(f"[AVATron] GET  /ping  -> health check")
    server.serve_forever()


thread = threading.Thread(target=start_server, daemon=True)
thread.start()
unreal.log("[AVATron] Thread iniciada")
