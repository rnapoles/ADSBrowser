from adsbrowser.tests import *

class TestUserController(TestController):

    def test_index(self):
        response = self.app.get(url_for(controller='User'))
        # Test response...
