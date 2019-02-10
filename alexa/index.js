const Alexa = require('ask-sdk-core');
const request = require('request');

var url = "https://winged-precinct-230506.appspot.com";

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to your friendly surge priced microwave';
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const CookIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'CookIntent');
  },
  handle(handlerInput) {
    var req = handlerInput.requestEnvelope.request;
    var time = req.intent.slots.time.value;

    request.post(url+'/time', {
      json: 
        { 
          time: parseInt(time)
        }
      }, function(err, res, body){
      if(err) console.log(err)
      return handlerInput.responseBuilder
      .speak("Microwaving for " + time + " seconds")
      .getResponse();
    });
    return handlerInput.responseBuilder
      .speak("Microwaving for " + time + " seconds")
      .getResponse(); 
  },
};

const UnlockHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'UnlockIntent');
  },
  handle(handlerInput) {
    request.get(url+'/unlock', function(err, res, body){
      if(err) console.log(err)
      return handlerInput.responseBuilder
      .speak("Unlocked microwave")
      .getResponse();
    });
    return handlerInput.responseBuilder
      .speak("Unlocked microwave")
      .getResponse();
  },
};

const LockHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'LockIntent');
  },
  handle(handlerInput) {
    request.get(url+'/recognize-t', function(err, res, body){ // place face in front of camera
      if(err) console.log(err)
      request.get(url+'/lock', function(err, res, body){
        if(err) console.log(err)
        return handlerInput.responseBuilder
        .speak("Locked microwave")
        .getResponse();
      });
    });
    return handlerInput.responseBuilder
      .speak("Locked microwave")
      .getResponse();
  },
};

const RecognizeFoodHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'RecognizeFoodIntent');
  },
  handle(handlerInput) {
    request.get(url+'/recognize-food-t', function(err, res, body){ // place face in front of camera
      if(err) console.log(err)
      return handlerInput.responseBuilder
      .speak("Scan your item")
      .getResponse();
    });
    return handlerInput.responseBuilder
      .speak("Scan your item")
      .getResponse();
  },
};

const CookFoodIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'CookFoodIntent');
  },
  handle(handlerInput) {
    request.get(url+'/single-food', function(err, res, body){ // place face in front of camera
      if(err) console.log(err)
      
      return handlerInput.responseBuilder
        .speak("Microwaving for " + body.time + " seconds")
        .getResponse();
    });
    return handlerInput.responseBuilder
        .speak("Microwaving food")
        .getResponse();
  }
}

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'No need for help';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};


const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    CookIntentHandler,
    LockHandler,
    UnlockHandler,
    RecognizeFoodHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    CookFoodIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();