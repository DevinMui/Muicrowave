[![Demo](microwave.jpg)](https://www.youtube.com/watch?v=FyAfWWDDA9Q)

## Inspiration
After jokingly talking about creating a smart microwave at a previous competition, we decided to make this joke a reality. Our team came prepared with the plan of making the muicrowave. Some features directly inspired by Brian Anderson.

## What it does
Our microwave is unlike any other. Using the Google Cloud Vision API, users no longer have to deal with the guesswork involved in normal microwaves. Simply scan your food item, pop it in the oven, and ask Alexa to turn the microwave on. It's that easy.

With Authorize.net, we even built in surge pricing for all you young entrepreneurs out there. Place the microwave in your dorm, your office, or basically any communal living space and watch the cash rake in. $0.50 / 30 seconds on off hours and $1 / 30 seconds during lunch and dinner times. 

Afraid someone will steal your food? Just use the facial recognition feature to automatically lock and unlock the microwave after you pay! When your food is done, simply look at the camera and the microwave will unlock itself.

Your food isn't hot enough? Just ask Alexa to "ask microwave to cook for [number divisible by 30] seconds!" Muicrowave will automatically add more time on to the clock.

## How we built it
We spent 3 whole hours taking apart a microwave we got from Craigslist for free. We desoldered the PCB's connection to the capacitive touch sensor and added our own wires. For the next 2 hours, we had to reverse engineer signals that would correspond to each key on the touch sensor. [Here](https://scontent-sjc3-1.xx.fbcdn.net/v/t1.15752-9/51286692_626817584435248_5275851093836824576_n.jpg?_nc_cat=104&_nc_ht=scontent-sjc3-1.xx&oh=8d17574f99283b7d8ab3b88e69bfada9&oe=5CF196DD) is a list of all combinations we found. Finally, we found the add 30 seconds button. We figured that would be enough for a proper demo and forgot about finding time cook and all the other numbers. We were super lazy so we just popped a tactile button onto the breadboard that would control a HIGH signal to trigger the add 30 seconds function on the PCB. To trigger this button, we also taped a mini servo onto the breadboard. Next, we wanted to add a lock to the microwave so we taped a knife to a continuous servo motor and then taped that motor onto the top of the microwave. We wired the mini servo and the knife servo to our Qualcomm Dragonboard 410c. Unfortunately, we spent a few hours trying to find how PWM worked on the Dragonboard just to find out that the Dragonboard only had one PWM port (on 28) when we needed two. Fortunately, the Mezzanine board from 96boards came in the kit. This board is a shield for the Dragonboard and includes a built-in Arduino. We used this Arduino to power and control our servo motors through serial.

We wanted to add in a bunch of really cool but useless features. First, we added image recognition through Google Cloud Vision. The documentation is pretty solid and we used the Node.js library to detect images through a mobile-optimized web application. We then created a small dataset of food items, their calories, and their time in the microwave to cook. When the food is detected, the microwave will microwave for the amount of time specified by the dataset. We would also keep track of calories. When calories > 650 (this was slightly larger than a muffin so it was easy to demo), we would automatically lock the microwave to prevent any more consumption. We also added Authorize.net for surge pricing features into the mobile-optimized web application.

Using Python, we easily interfaced our Dragonboard with our Node.js server deployed on the Google App Engine. To communicate with the Arduino, we used pyserial to send commands that would cause the microwave to either lock, unlock, or microwave for 30 seconds.

Our Alexa skill was quite simple and just requested the Dragonboard to lock, unlock, or microwave. We also added facial recognition! Using another Python program, we used the face_recognition library to learn someone's face when the lock command is called on Alexa. Then, the camera would take a picture of the user's face and lock the microwave. The user then walks away and when they come back, the program recognizes the user and unlocks the microwave.

## Challenges we ran into
My high school electronics teacher told me to always treat circuits as if they were live. Of course, we totally abandoned those rules. Deconstructing the microwave was super annoying. Metal isn't as malleable as we thought it to be. After taking out all the screws, we got to see the microwave's guts. The capacitor is the most dangerous electrical components in the microwave. A single touch could literally instantly kill a person. So naturally, we prodded it with a screwdriver. Jokes aside, the prodding would discharge the capacitor. Unfortunately, we had no real clue if we actually discharged it or if our multimeter was not working or if we were using the multimeter incorrectly. So, we just took out the PCB anyways and desoldered it while the capacitor could have been live. Hey! We're still alive so I guess we did it correctly!

After that bit, we searched for the schematic online but we were unable to find it. We had to reverse engineer the IO for the PCB until we found the add 30 seconds button combination. The total amount of combinations possible was 2^10-1. We had no patience so we just stopped once we found the 30 seconds part.

The continuous servo was acting up weird. It would lock then unlock even though I had not called unlock. I figured it was because I installed the servo upside down and the program worked. I lost 2 hours working on this bug. Authorize.net seemed to be crashing the server but we fixed it by installing the request library on Node.js (*ahem* Aaron). Alexa was one of the trickiest parts to get right. We wanted to add the request library to Alexa which requires us to zip our files along with `node_modules` to AWS Lambda. Unfortunately, no one really tells you that you also have to install the `ask-sdk-core` module locally. I assumed that AWS Lambda would just have it stored globally or something. Oh well, I guess that was my mistake. That cost us another 2 hours to fix. Simple bugs have harsh consequences. 

## Accomplishments that we're proud of
We didn't die!

## What we learned
How not to die. Simple bugs can kill your time. Run code locally before deployment. Node.js is the only real dev language.

## What's next for Muicrowave
Tbh, what is the definition of next? Though, the microwave has been stripped of parts, we will continue to reuse the components on future hackathon projects. Muicrowave will always live on if not in body, then in spirit. #recycling
