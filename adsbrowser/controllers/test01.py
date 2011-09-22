import logging

from pylons import request, response, session, tmpl_context as c, url
from pylons.controllers.util import abort, redirect

from adsbrowser.lib.base import BaseController, render

log = logging.getLogger(__name__)

class Test01Controller(BaseController):

    def index(self):
        # Return a rendered template
        #return render('/test01.mako')
        # or, return a response
        return 'Hello World'
