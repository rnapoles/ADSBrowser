from adsbrowser.tests import *

class TestBrowserController(TestController):

    def test_index(self):
        response = self.app.get(url_for(controller='Browser'))
        # Test response...
