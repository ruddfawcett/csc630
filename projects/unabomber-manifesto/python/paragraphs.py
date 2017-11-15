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

sections = {}

for chapter in chapters:
    if 'INDUSTRIAL SOCIETY AND ITS FUTURE' in chapter[0] or 'NOTES' in chapter[0]:
        continue
    else:
        chapter_text = text[chapter[1][0]: chapter[1][1]-1]
        pp_tokenizer = RegexpTokenizer('^(?:[0-9]+ ?)+?\.\s')

        paragraph_by_title_indices = list(zip(pp_tokenizer.tokenize(chapter_text), pp_tokenizer.span_tokenize(chapter_text)))

        paragraphs = {}

        for i, paragraph in enumerate(paragraph_by_title_indices):
            p = [paragraph[0], [paragraph[1][1], 0]]
            try:
                p[1][1] = paragraph_by_title_indices[i+1][1][0]
            except:
                pass

            paragraph_text = chapter_text[p[1][0]: p[1][1]-1]
            paragraphs[paragraph[0].replace('. ', '')] = {
                'text': paragraph_text.replace('\n', ' ').replace('\r', ''),
                'words': {},
                'index_left': p[1][0],
                'index_right': p[1][1]-1
            }

        sections[chapter[0]] = {
            'paragraphs': paragraphs,
            'index_left': chapter[1][0],
            'index_right': chapter[1][1]-1
        }

dictionary = Counter()

def tokenize_text(text):
    for punc in punctuation:
        text = text.replace(punc, "")

    word_tokens = nltk.word_tokenize(text)
    for i, word in enumerate(word_tokens):
        if len(word) == 1 and  word in punctuation:
            word_tokens.pop(i)

    return [w.lower() for w in word_tokens if w.lower() not in stopwords.words('english')]

for section in sections:
    useful_word_tokens = [tokenize_text(sections[section]['paragraphs'][paragraph_no]['text']) for paragraph_no in sections[section]['paragraphs']]
    for word_token in useful_word_tokens:
        dictionary.update(word_token)

most_common = dictionary.most_common(50)

most_common_words = []
for item in most_common:
    entry = {
        'word': item[0],
        'count': item[1]
    }

    most_common_words.append(entry)

df = pd.DataFrame(most_common_words)
df.to_csv('most_common_words.csv', index=True, columns=['word', 'count'])

for section in sections:
    for paragraph_no in sections[section]['paragraphs']:
        word_tokens = nltk.word_tokenize(sections[section]['paragraphs'][paragraph_no]['text'])
        for word in word_tokens:
            for common in most_common:
                if (common[0] == word):
                    indicies = [i for i, item in enumerate(word_tokens) if item == word]
                    sections[section]['paragraphs'][paragraph_no]['words'][word] = indicies

        sections[section]['paragraphs'][paragraph_no].pop('text', None)

with open('word_location.json', 'w') as fp:
    json.dump(sections, fp)
