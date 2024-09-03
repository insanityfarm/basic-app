# Basic App

This is the frontend for a quiz app. It's a single-page webapp which asks each question in a separate step. Three question types are supported: Short answer (text input), long answer (textarea), and multiple choice (radio buttons). A 3-minute countdown is displayed for each question; when the timer hits zero the app will advance to the next step and reset itself. The sample quiz data is located in `./src/data/quiz.json`.

The app was built with accessibility in mind, including the following features:

-   Screen reader support, including "question n of 3" info with each question announcement, an alert when time is up and a warning 30 seconds before that happens
-   Two separate keyboard navigation flows, one for those using screen readers and one for everyone else
-   Color contrast within WCAG AA guidelines

At the moment I only have access to VoiceOver for Mac so I wasn't able to test on other screen readers, but it should be fairly consistent on JAWS and NVDA. I've tested in Chrome, Firefox, and Safari.

## How to Use

Run `npm start` to start the React app dev server (will open browser to http://localhost:3000/). TypeScript will auto-compile and hot reload as the source is modified
