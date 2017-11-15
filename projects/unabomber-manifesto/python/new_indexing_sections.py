import json
import string

import numpy as np
import pandas as pd
import requests

from collections import Counter

import nltk
from nltk import RegexpTokenizer
from nltk import WhitespaceTokenizer
from nltk.corpus import stopwords
from nltk.probability import FreqDist

tokenizer = WhitespaceTokenizer()
punctuation = string.punctuation + '“”’.,'
text = open('manifesto.txt').read()

ch_tokenizer = RegexpTokenizer('^(?:[A-Z-‘’]+ ?)+?(?=\n)')
chapters_by_title_indices = list(zip(ch_tokenizer.tokenize(text), ch_tokenizer.span_tokenize(text)))
chapters = []

for i, chapter in enumerate(chapters_by_title_indices):
    c = [chapter[0], [chapter[1][1], 0]]
    try:
        c[1][1] = chapters_by_title_indices[i+1][1][0]
    except:
        pass
    chapters.append(c)

chapter_indices = []
i = 0
for chapter in chapters:
    if 'INDUSTRIAL SOCIETY AND ITS FUTURE' in chapter[0] or 'NOTES' in chapter[0]:
        continue
    else:
        entry = {
            'section': chapter[0],
            'index_left': chapter[1][0],
            'index_right': chapter[1][1]
        }
        chapter_indices.append(entry)
        i = 1

df = pd.DataFrame(chapter_indices)
df.to_csv('section_list.csv', index=True)
