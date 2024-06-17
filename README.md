# Playwright email verification - Mailisk

This is an example app that shows how to use Cypress to test email verification functionality. This example uses the [mailisk](https://mailisk.com) library.

This example includes a simple full stack React (NextJs) and Express application. The Express server uses [Mailisk SMTP](https://mailisk.com/blog/smtp-now-available) to send emails.

## Install packages

You will need to install packages in all directories. Run the following command in the root directory:

```shell
npm --prefix ./server install ./server \
npm --prefix ./app install ./app
```

## Setup

### Get namespace and api key

The Api Key and namespace can be found in your dashboard. See the [Getting Started](https://docs.mailisk.com) guide for detailed steps.

Create a `.env` file in the root project directory. Add the following lines from your settings:

```ini
MAILISK_API_KEY=your_api_key
MAILISK_NAMESPACE=your_namespace
```

## Running the app and server

Head into the `app` folder and run:

```shell
npm run dev
```

Then go into the `server` folder and run:

```shell
npm run dev
```

## Running tests

Once both the backend and frontend are running. You can run the tests.

To run the test run the following command in the `app` folder:

```shell
npx playwright test
```

Alternatively you can run the tests using the GUI version by running the following command:

```shell
npx playwright test --ui
```
