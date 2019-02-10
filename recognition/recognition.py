import face_recognition
import numpy as np
import cv2
import requests
import time
import io
import json
from google.cloud import vision
from google.cloud.vision import types

client = vision.ImageAnnotatorClient()

foods = [
	{
		'name': 'popcorn',
		'time': 150,
		'calories': 180
	},
	{
		'name': 'muffin',
		'time': 30,
		'calories': 600
	},
	{
		'name': 'water',
		'time': 30,
		'calories': 5
	},
]

cam = cv2.VideoCapture(0)

url = "https://winged-precinct-230506.appspot.com"

auth_encode = None

process = True

repeat = False

locked = False

while True:
	ret_val, img = cam.read()
	img = cv2.resize(img, (0, 0), fx=0.25, fy=0.25)
	cv2.imshow('my webcam', img)
	if process:
		simg = img[:, :, ::-1]

		r = requests.get(url+"/recognize")
		s = requests.get(url+'/recognize-food')
		j = requests.get(url+'/food')

		calories = 0
		j = j.json()
		if(len(j)):
			for food in j["foods"]:
				calories += food["calories"]

		if calories > 650 and not locked:
			locked = True
			requests.get(url+'/lock')

		if(r.json()["recognize"]):
			locked = True
			print("added face")
			cv2.imwrite('foo.jpg', img)
			face = face_recognition.load_image_file("foo.jpg")
			auth_encode = face_recognition.face_encodings(face)
			time.sleep(5)

		elif auth_encode:
			print("finding face")
			face_locations = face_recognition.face_locations(simg)
			face_encodings = face_recognition.face_encodings(simg, face_locations)

			for face_encoding in face_encodings:
				try:
					matches = face_recognition.compare_faces(auth_encode, face_encoding, tolerance=0.3)
					if True in matches:
						print("face found!")
						r = requests.get(url+'/unlock')
						locked = False
						auth_encode = None
				except:
					pass
		elif(s.json()["recognizeFood"] or repeat):
			cv2.imwrite('foo.jpg', img)
			with io.open('foo.jpg', 'rb') as image_file:
				content = image_file.read()
			image = types.Image(content=content)
			response = client.label_detection(image=image)
			repeat = True
			k = False
			for item in response.label_annotations:
				if(k): break
				for food in foods:
					if(item.description.lower() == food['name']):
						print food['name']
						r = requests.post(url+'/food', json=food)
						repeat = False
						k = True
						break
			time.sleep(1)


	process = not process

	if cv2.waitKey(1) == 27: 
		break  # esc to quit
	cv2.destroyAllWindows()