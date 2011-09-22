from adsbrowser.tests import *

class TestTest01Controller(TestController):

    def test_index(self):
        response = self.app.get(url(controller='test01', action='index'))
        # Test response...
