import json
import csv

import pandas as pd

json_data = open('word_location.json').read()
data = json.loads(json_data)

most_common_words = {}
for row in csv.DictReader(open('most_common_words.csv')):
    most_common_words[row['word']] = {
        'rank': row['rank'],
        'count': row['count']
    }

chapter_entries = []
paragraph_entries = []
word_entries = []

for chapter in data:
    entry = {
        'chapter': chapter,
        'index_left': data[chapter]['index_left'],
        'index_right': data[chapter]['index_right'],
    }

    chapter_entries.append(entry)

    for paragraph in data[chapter]['paragraphs']:
        entry = {
            'paragraph': paragraph,
            'index_left': data[chapter]['paragraphs'][paragraph]['index_left'],
            'index_right': data[chapter]['paragraphs'][paragraph]['index_right'],
        }

        paragraph_entries.append(entry)

        for word in data[chapter]['paragraphs'][paragraph]['words']:
            for index in data[chapter]['paragraphs'][paragraph]['words'][word]:
                entry = {
                    'word': word,
                    'index': index,
                    'rank': most_common_words[word]['rank']
                }

                word_entries.append(entry)

df = pd.DataFrame(chapter_entries)
df.to_csv('chapter_list.csv', index=False)

df = pd.DataFrame(paragraph_entries)
df.to_csv('paragraph_list.csv', index=False)

df = pd.DataFrame(word_entries)
df.to_csv('word_rank.csv', index=False, columns=['word', 'rank', 'index'])
