import json
import string

import numpy as np
import pandas as pd
import requests

import nltk
from nltk import RegexpTokenizer
from nltk import WhitespaceTokenizer

tokenizer = WhitespaceTokenizer()

text = open('manifesto.txt').read()

re_tokenizer = RegexpTokenizer("^(?:[A-Z-‘’]+ ?)+?(?=\n)")

chapters_by_title_indices = list(zip(re_tokenizer.tokenize(text), re_tokenizer.span_tokenize(text)))

chapters = []

for i, chapter in enumerate(chapters_by_title_indices):
    # Carry over the chapter title
    c = [chapter[0], [chapter[1][1], 0]]
    try:
        # grab the starting index of the next chapter, if it exists
        c[1][1] = chapters_by_title_indices[i+1][1][0]
    except:
        # it didn't work, meaning we're at the end.
        pass
    chapters.append(c)

print(*chapters, sep="\n")
