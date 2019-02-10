import io
from google.cloud import vision
from google.cloud.vision import types

client = vision.ImageAnnotatorClient()


with io.open('./image.png', 'rb') as image_file:
	content = image_file.read()
	image = types.Image(content=content)
	response = client.label_detection(image=image)

	print (response)