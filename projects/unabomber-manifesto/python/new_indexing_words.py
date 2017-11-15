import json
import string
import csv

import numpy as np
import pandas as pd
from collections import Counter

import nltk
from nltk import RegexpTokenizer
from nltk import WhitespaceTokenizer
from nltk.corpus import stopwords
from nltk.probability import FreqDist

tokenizer = WhitespaceTokenizer()
punctuation = string.punctuation + '“”’.,'
text = open('manifesto.txt').read()

most_common_words = {}
for row in csv.DictReader(open('most_common_words.csv')):
    most_common_words[row['word']] = {
        'rank': row['rank'],
        'count': row['count']
    }

word_indices = []

def all_occurences(file, str):
    initial = 0
    while True:
        initial = file.find(str, initial)
        if initial == -1: return
        yield initial
        initial += len(str)

for common in most_common_words:
    indicies = all_occurences(text, common)
    for index in indicies:
        entry = {
            'word': common,
            'index': index,
            'rank': most_common_words[common]['rank']
        }

        word_indices.append(entry)

print(word_indices)

df = pd.DataFrame(word_indices)
df.to_csv('word_list.csv', index=False)
