## Lab 2: D3 scatterplots, transitions, and interactivity
Your task is to create a scatterplot to practice your many D3 skills. We will be using a dataset found on the website Kaggle (Links to an external site.)Links to an external site., which (among other things) hosts machine learning competitions and also serves many datasets. It's a good place to go to just peruse for data! You might need to make an account to download the dataset... not sure.

### The Dataset

Head to this website (Links to an external site.)Links to an external site. to get the dataset. You're looking for cwurData.csv, which is a ranking of 2200 colleges by several different factors. Click on "Column Metadata" to find out more about each column.

Note that this choice of dataset is a bit tongue-in-cheek. I do not condone the use of such ranking systems to make real-life decisions. But it's the perfect dataset for our task today and tomorrow!

### Your Task
Create a single data visualization that serves as a scatterplot for any pair of these columns, chosen by the user. For example, the user might say they want to compare "ranking based on number of patents" to "world ranking". They get the scatter plot, then they decide they want to change the patents one to "ranking based on alumni employment".  Some conditions:

1. Obvious UI: when a user wants to make a change, it should be obvious how I do it. It should be obvious that I even can do it. One simple way to make that happen is to have the axis labels be dropdown menus (Links to an external site.)Links to an external site.. Feel free to give some simple instructions in your "explanation paragraph" at the bottom of your site.

2. Transition: When the user changes "views", the data should smoothly transition. As in, the circles should flow across the screen as needed to show their new (i.e. updated!) locations.  There should be good object constancy: if I knew a circle corresponded to UT Austin, and the data changes, it should be easy to know (and be correct!) in knowing where UT Austin went.

3. Mouseover: Upon mouseover, tell me what the school is, and its world ranking. How you do this is up to you, but make it look nice! You could have text appear near the circle, or words that are in other places become more prominent somehow; the choice is yours!

4. Axes: make it happen.  You will likely need to build scales for all your datasets, and then recall the axes when you change a column (i.e., axis).

5. Don't show all 2200 data points. You should allow the user to switch between two slices of the data: top 200 colleges (i.e., the first 200 rows), and some random 200 colleges (it's okay if it's the same random subset each time, but virtual bonus points for making it be a new random slice each time). Make the way the user switches between these options obvious: perhaps a big beautiful button that clearly performs what you want it to... maybe the button's text switches accordingly?

6. Make this something that you would be proud to show a grandparent, or a stranger.

### Some hints

Probably the easiest and most sophisticated way to deal with the "Chrome is causing me issues" type of problem in terms of loading local data is to turn the folder into a simple server. The fastest way to do this is to navigate to the desired folder then use the command

```python
python -m http.server 8000
```

If this doesn't work, use python3 instead of python. This will allow you to use addresses like

```python
d3.csv("http://localhost:8000/cwurData.csv", ...)
```

You need to make sure to open your HTML file through the server as well (by navigating to it in the browser), and not through your finder/explorer/terminal/cmd.

You'll need to use a key function in order to keep the data in sync across changes in column. Check out my Key Functions I and II example visualizations (and the code of them, by viewing source!)

You'll be graded (in some amount) by the design/style of your work. Don't make it gaudy!
