# Handouts For You.

## Features

1. Search for handouts
2. Course prerequisites
3. Course Reviews
4. Practice School Cutoffs
5. Practice School Chronicles
6. Summer Internship Chronicles (Might become hard to find lmao)
7. Minors on Campus
8. Notes and Resources

## Development

First, run the development server and for the pages you are making changes to, replace `{session &&` with `{true &&`. This lets you overcome the auth temporarily locally.

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Course Reviews Scripts

There is only one script which pushed directly to the database

## Practice School Scripts

1. Download the most up to date copy of **PS2_master.csv**
2. Add the new year to be added to the end of the CSV
3. Run `similar_names_filter` script on this csv to ensure that it gives you all the similar names in that particular csv from the company column
4. This will generate a `soundex_filter.txt` which contains all the companies which are similar in the format of CompanyA<|>CompanyB now the task here is to ensure only those companies which are together are in the same line. For example:

```
National Aerospace Lab<|>National Aerospace Laboratories<|>National Aerospace Laboratory<|>National Chemical Laboratory<|>National Chemical Laboratory (NCL), Pune<|>National Chemical Laboratory - Pune<|>National Chemical Laboratory, Pune<|>National Council for Cement and Building Materials<|>National Council of Applied Economic Research<|>National Instruments<|>National Instruments (Bangalore)<|>National Instruments Systems (India) Pvt. Ltd. - Bengaluru<|>National Instruments, Bangalore
```

should become

```
National Aerospace Lab<|>National Aerospace Laboratories<|>National Aerospace Laboratory

National Chemical Laboratory<|>National Chemical Laboratory (NCL), Pune<|>National Chemical Laboratory - Pune<|>National Chemical Laboratory, Pune

National Council for Cement and Building Materials

National Council of Applied Economic Research

National Instruments<|>National Instruments (Bangalore)<|>National Instruments Systems (India) Pvt. Ltd. - Bengaluru<|>National Instruments, Bangalore
```

5. Now the next step is to run `data_consolidator` script which consolidates all the stations of same name into one station.
   NOTE: Incase you want to ignore two completely dissimilar companies add it to scripts/ignore.txt
6. In the end run `parse_ps` to generate json from csv

## Pre-requisite Courses Script

-   Use this to convert the excel TTD puts out on cms regarding prereqs to a json format
-   I don't think you'll need to use this for a long long time :)

## Contributors - Developers

1. Divyateja Pasupuleti
2. Adarsh Das
3. Namit Bhutani

## Contributors - Content

1. Vashisth Choudhari
2. Ruban Srirambabu
3. Mahith Tunuguntula
