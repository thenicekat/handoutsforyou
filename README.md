# Handouts For You.

## Features
- Handouts
- Course Prerequisites
- Course Reviews
- Course PYQs
- Course Resources
- Course Grading (Midsem)
- Practice School Cutoffs
- Practice School Chronicles
- Practice School Reviews
- Summer Internship Chronicles (Might become hard to find lmao)
- Summer Internship Company Details
- Placement Chronicles
- Research Chronicles
- Higher Studies Resources

## Development
- First install the dependencies by using pnpm after installing [pnpm](https://pnpm.io/installation)
```bash
pnpm install
```

- Then, run the development server and for the pages you are making changes to, replace `{session &&` with `{true &&`. This lets you overcome the auth temporarily locally. This will work only for pages without server side verification. None of the database relient features will work.

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts
### Course Reviews.
- `add_reviews.py` -> There is only one script which pushed directly to the database.

### Course Prereqs.
- `prereqs.py` -> This is the script which parses data from course prereqs excel.
- Use this to convert the excel TTD puts out on cms regarding prereqs to a json format
- I don't think you'll need to use this for a long long time :)

### Practice School.

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

## Contributors - Developers
1. Divyateja Pasupuleti
2. Adarsh Das
3. Pratyush Nair
4. Namit Bhutani
5. Anirudh Agarwal
6. Santrupti Behera


## Contributors - Content
Redirected to [https://handoutsforyou.vercel.app](https://handoutsforyou.vercel.app)

## Pull Request Guidelines
We aim to follow the following standards for PRs
  1. build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
  2. ci: Changes to CI configuration files and scripts
  3. docs: Documentation only changes
  4. feat: A new feature
  5. fix: A bug fix
  6. perf: A code change that improves performance
  7. refactor: A code change that neither fixes a bug nor adds a feature
  8. style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  9. test: Adding missing tests or correcting existing tests
  10. chore: edits to files that aren't src, build, or ci files
