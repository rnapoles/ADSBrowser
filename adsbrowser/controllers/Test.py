import logging

from adsbrowser.lib.base import *;
from adsbrowser.model.base import BaseModel;



log = logging.getLogger(__name__)

class TestController(BaseController):

	def index(self):
		TestBaseModel = BaseModel("administrator","0x41ebx1");
		if TestBaseModel.isAuthenticate():
			response.write(TestBaseModel.RootDSE);
			response.write(TestBaseModel.DnsDomain);
		else:
			response.write(TestBaseModel.LastErrorStr);
			response.write(TestBaseModel.LastErrorNumber);
			

