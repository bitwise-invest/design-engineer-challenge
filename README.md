Welcome to the virtual onsite and technical challenge. You will be recreating our Correlations Tool. This tool allows you to view correlations for stocks, ETFs, and mutual funds for a given time period. You also view the rolling correlation for a given number of trading days to see how the correlation between the assets has changed over time.

The tool is live here:

[Correlations Tool | Bitwise Investments](http://experts.bitwiseinvestments.com/tools/correlations)

# Order of the Day

There will be a Slack channel setup where you can ask any questions. If at any point you want to hop on call to ask questions or get feedback we can Slack huddle. Please over communicate if you have questions or notes, I will be available for the entire time during the challenge to assist.

- 9-9:30a - Project Overview
- 12-1p - Review and Questions

# Setup

This project can just be done on your local machine, all you need is git and node installed. If you’ve worked on any Next.js project in the past you should be good to jump right in.

## Repo

Clone this repo which has a Typescript Next.js project initialized with some libraries that we use heavily to build this project; Tailwind, Dayjs, Jotai, etc. You’re not required or limited to using these libraries, take advantage of the tools you’re most comfortable using to get the best output.

https://github.com/bitwise-invest/design-engineer-challenge

## Backend

This is the url to which you’ll need to send your request to get the correlation data.

```jsx
BACKEND_URL = "https://backend.bitwiseinvestments.com/tools/correlation";
```

### Request Structure

This is the structure the backend expects to receive the data. Pass it this request structure via a `JSON.stringify` in the body of the request.

Points of note:

1.  The `compare` fields are the Designated Ticker in the design.
2.  The `compareType` doesn’t match to the AssetOption type field directly. There’s a mapping function [under help](https://www.notion.so/Design-Engineer-Correlations-Tool-1c38a476fbc48064beeeda3ab4622053?pvs=21) to assist.

```tsx
interface Request {
  compareSymbol: string; // Ticker
  compareType: CompareType;
  stockSymbols: string[]; // Ticker
  cryptoSymbols: string[]; //Ticker
  startDateString: string; // XXXX-XX-XX
  endDateString: string; // XXXX-XX-XX
  rollingWindow: number; // default value: 90
  debug: boolean;
}

enum CompareType {
  BITWISE_FUND = "bit",
  CRYPTO = "crypto",
  STOCK = "stock",
}
```

### Response Structure

This is the structure you can expect the backend to respond with. It will aid you in planning how to build UI components for data visualization.

```tsx
interface Response {
  errors: {
    errors: string[];
    warnings: {
      endDate: string;
      error: "data_missing" | "date_range_short";
      startDate: string;
      [symbol: string]: any;
    }[];
  };
  correlations: {
    correlationChart: {
      [symbol: string]: [number, number];
    }[];
    correlationMatrix: {
      [symbol: string]: number;
    }[];
  };
}
```

### Tickers

In the repo there’s a Typescript file `app/_data/assets.ts` array’s of `AllAssets` and `DefaultAssets`. These assets will return correlations data from the backend you can use this list to build on without needing to go out and find an asset list. The assets are structured like this:

```tsx
export interface AssetOption {
  readonly value: string;
  readonly label: string;
  readonly type: string;
  readonly inceptionDate?: string;
}
```

# Experience

Don’t feel tied to the current design or experience, there’s a few note’s below that share the base expected experience of tool. We’re looking for you to explore and build the best idea you can, not to merely copy the existing tool.

### Input

**Designated Ticker:** There should be a single designated ticker

**Comparison Tickers:** There should be at least a single comparison ticker and up to 5 total comparison tickers. You shouldn’t be allowed to add a comparison ticker with the same value as the designated ticker.

**Date Range:** The minimum date range should be 90 days between the start and end date.

### Output

**Correlation Matrix:** This table shows the degree to which two assets move in relation to each other. The axis moves across and down the chart presenting the values as decimals.

![Screenshot 2025-04-01 at 1.48.50 PM.png](attachment:b7ca35dc-e15c-4762-9e26-d2865d35650a:Screenshot_2025-04-01_at_1.48.50_PM.png)

**Rolling Correlation:** This is a line chart with the y axis presenting the correlation value as decimals and the x axis the date. The line chart has a toggle to display only specific tickers.

![Screenshot 2025-04-01 at 1.49.20 PM.png](attachment:a2900a67-72e8-4bfb-8895-dabf636cf956:Screenshot_2025-04-01_at_1.49.20_PM.png)

**PDF Export:** We're using a combination of `docraptor` and `@fileforge/react-print` to build out the PDF export. This shouldn’t be a priority in this challenge and should be ignored.

# Helpers

A couple quick notes on things that should provide context and help you build this tool.

### All Assets vs Default Assets

You may be wondering why there’s two arrays of assets. The select loads the default assets immediately and then allows the user to search the all assets array. This keeps us from needing to load in the massive all assets array and have full control over the default assets shown as there are compliance implications around which assets we need to show by default.

### Compare Types

The assets have a number of different types, but when those types are passed into the backend they need to fit into one of three categories. This function will get the appropriate compare type for the designated asset.

```tsx
enum CompareType {
  BITWISE_FUND = "bit",
  CRYPTO = "crypto",
  STOCK = "stock",
}

const assetToCompareType = (ticker: AssetOption) => {
  if (ticker.value === "BITW" || ticker.value === "BITQ") {
    return CompareType.BITWISE_FUND;
  } else if (
    ticker.type === "stock" ||
    ticker.type === "etf" ||
    ticker.type === "trust"
  ) {
    return CompareType.STOCK;
  } else {
    return CompareType.CRYPTO;
  }
};
```

### Split Symbols

The comparison assets need to be passed into the backend in two categories based on what kind of data we need to pull for them; Crypto and Stock. You should write a function to split the comparison tickers into the two categories.

If the `asset.type` is crypto then it should be in the crypto category, the rest of the assets should go in the stock category.

### Warning & Errors

**Warnings**

The backend will respond with two soft warnings based on the input.

1. The `data_missing` is a general error that has to do with the available data on the backend. The request may be valid but potentially there is an underlying data issue so we return this error and additional detail such as the available data for `${symbol}` is from `${startDate}` to `${endDate}` .
2. The `date_range_short` is a more specific error that explains that the chosen date range is larger than the available data. We rarely return this error as we’re validating the front-end date range to the inception date. When we return this error it comes with additional detail such as the available data for `${symbol}` is from `${startDate}` to `${endDate}` .

**Errors**

These are critical failures, authentication, bad request, etc. They come down directly from the server as an array of strings based on the error.

```tsx
interface ResponseErrors {
  errors: {
    errors: string[];
    warnings: {
      endDate: string;
      error: "data_missing" | "date_range_short";
      startDate: string;
      [symbol: string]: any;
    }[];
  };
}
```
