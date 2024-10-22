"""Replace requests to the OnlyOffice client code with files from the local disk"""

import logging
from mitmproxy import http
from urllib.parse import urlparse
from pathlib import Path

LOCAL_ONLYOFFICE_PATH = str(Path('~/dummy/cryptpad-replace/www/').expanduser())
ONLYOFFICE_URL_PATH_PREFIX = ''
# LOCAL_ONLYOFFICE_PATH = str(Path('~/XWiki/develop/cryptpad/www/common/onlyoffice/dist/v7').expanduser())

# ONLYOFFICE_URL_PATH_PREFIX = '/common/onlyoffice/dist/v7'

def request(flow: http.HTTPFlow) -> None:
    path = urlparse(flow.request.url).path
    if path.startswith(ONLYOFFICE_URL_PATH_PREFIX) and path.endswith('.js'):
        # We only replace .js files. We would need a way to determin the Content-Type otherwise.
        path = LOCAL_ONLYOFFICE_PATH + path[len(ONLYOFFICE_URL_PATH_PREFIX):]
        try:
            content = Path(path).read_bytes()
            flow.response = http.Response.make(
                200,
                content,
                {"Content-Type": "application/javascript"},
            )
            flow.response.headers["cross-origin-resource-policy"] = 'cross-origin';

            logging.info('Replaced %s (%d bytes)', path, len(content))
        except:
            logging.error('Could not read file %s', path, exc_info=True)
            #pass  # Could not open file -> do nothing
