import inspect

import logging
log = logging.getLogger(__name__)

# functions
# from http://stefaanlippens.net/python_inspect
def whoami():
	return str(inspect.stack()[1][3])
def whosdaddy():
	return str(inspect.stack()[2][3])

class AppLog:
	handler = logging.FileHandler('Error.log')
	formatter = logging.Formatter('%(asctime)s %(levelname)-5.5s [%(name)s] %(message)s')
	handler.setFormatter(formatter)
	log.addHandler(handler)
	log.setLevel(logging.ERROR)

	def LogError(self,message):
		#message='Function '+str(whosdaddy())+' '+message;
		
		log.error(message);
		#log.info(whosdaddy());
		log.info("Msg:"+str(message));