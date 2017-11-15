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

pp_tokenizer = RegexpTokenizer('^(?:[0-9]+ ?)+?\.\s')
paragraphs_by_title_indices = list(zip(pp_tokenizer.tokenize(text), pp_tokenizer.span_tokenize(text)))
paragraphs = []

for i, paragraph in enumerate(paragraphs_by_title_indices):
    p = [paragraph[0], [paragraph[1][1], 0]]
    try:
        p[1][1] = paragraphs_by_title_indices[i+1][1][0]
    except:
        pass
    paragraphs.append(p)

paragraph_indices = []

# Skip Notes at end of doc.
break_next = False
i = 0
for paragraph in paragraphs:
    if break_next:
        break

    if '232. ' in paragraph[0]:
        break_next = True

    entry = {
        'paragraph': paragraph[0].replace('. ', ''),
        'index_left': paragraph[1][0],
        'index_right': paragraph[1][1]
    }
    paragraph_indices.append(entry)
    i = 1

print(paragraph_indices)

df = pd.DataFrame(paragraph_indices)
df.to_csv('paragraph_list.csv', index=False)
