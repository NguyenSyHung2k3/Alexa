'use strict';
const Alexa = require('ask-sdk-core');
const { SkillBuilders } = require('ask-sdk-core');
const express = require('express');
const morgan = require('morgan');
const { ExpressAdapter } = require('ask-sdk-express-adapter')
const {google} = require('googleapis');


const app = express();
app.use(morgan('dev'));
const PORT = process.env.PORT || 3000

const LaunchRequestHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
      const speakOutput = 'Welcome, to my name app';

      return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
  }
};

const NameIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NameIntent';
  },
  handle(handlerInput) {
    const speechText = 'My Name is Hung';

    return handlerInput.responseBuilder
      .speak(speechText)
      //.withSimpleCard('The weather today is sunny.', speechText)
      .getResponse();
  }
};


const HelpIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can ask me to turn on the fan';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('You can ask me anything', speechText)
      .getResponse();
  }
};


const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
        || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Goodbye!', speechText)
      .withShouldEndSession(true)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    // Any clean-up logic goes here.
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I don\'t understand your command. Please say it again.')
      .reprompt('Sorry, I don\'t understand your command. Please say it again.')
      .getResponse();
  }
};

// let skill;

// exports.handler = async function (event, context) {
//   console.log(`REQUEST++++${JSON.stringify(event)}`);
//   if (!skill) {
//     skill = Alexa.SkillBuilders.custom()
//       .addRequestHandlers(
//         LaunchRequestHandler,
//         AskWeatherIntentHandler,
//         HelpIntentHandler,
//         CancelAndStopIntentHandler,
//         SessionEndedRequestHandler,
//       )
//       .addErrorHandlers(ErrorHandler)
//       .create();
//   }

//   const response = await skill.invoke(event, context);
//   console.log(`RESPONSE++++${JSON.stringify(response)}`);

//   return response;
// };


exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        NameIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        //FallbackIntentHandler,
        SessionEndedRequestHandler
        //IntentReflectorHandler
        )
    .addErrorHandlers(
        ErrorHandler)
  
const skillBuilder = SkillBuilders.custom().addRequestHandlers(LaunchRequestHandler, NameIntentHandler).addErrorHandlers(ErrorHandler);

const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, false, false);

app.post('/api/v1/webhook-alexa', adapter.getRequestHandlers());
app.use(express.json())

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})