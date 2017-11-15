import string

import numpy as np
import pandas as pd
import nltk
from nltk import RegexpTokenizer
from nltk.corpus import stopwords

tokenizer = WhitespaceTokenizer()
punctuation = string.punctuation + '“”’.,'
text = open('manifesto.txt').read()

ch_tokenizer = RegexpTokenizer('^(?:[A-Z-‘’]+ ?)+?(?=\n)')
sections_by_title_indices = list(zip(ch_tokenizer.tokenize(text), ch_tokenizer.span_tokenize(text)))
sections = []

for i, section in enumerate(sections_by_title_indices):
    c = [section[0], [section[1][1], 0]]
    try:
        c[1][1] = sections_by_title_indices[i+1][1][0]
    except:
        pass
    sections.append(c)

section_indices = []
i = 0
for section in sections:
    # Skip the chapter title and final notes section.
    if 'INDUSTRIAL SOCIETY AND ITS FUTURE' in section[0] or 'NOTES' in section[0]:
        continue
    else:
        entry = {
            'section': section[0],
            'index_left': section[1][0],
            'index_right': section[1][1]
        }
        section_indices.append(entry)
        i = 1

df = pd.DataFrame(section_indices)
df.to_csv('section_list.csv', index=True)
