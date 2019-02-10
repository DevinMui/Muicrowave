import requests
from time import sleep
import serial

ser = serial.Serial('/dev/cu.usbmodem142301', 9600)
sleep(1)
# ser.setDTR(True)

def turnOnMicrowave(time):
	time = time / 30
	for i in xrange(time):
		ser.write('1')
		sleep(2)

# send 3
def lock():
	print "lock"
	ser.write('3')
	sleep(2)

# send 2
def unlock():
	print "unlock"
	ser.write('2')
	sleep(2)

url = "https://winged-precinct-230506.appspot.com"

while True:
	try:
		r = requests.get(url)
		r = r.json()
		if("time" in r and r["time"]):
			turnOnMicrowave(r["time"])
		elif("lock" in r and r["lock"]):
			print r
			lock()
		elif("unlock" in r and r["unlock"]):
			print r
			unlock()
	except:
		pass

	sleep(2)