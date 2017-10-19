from PIL import Image
from kmeans import Kmeans
import csv
from base64 import b16encode
import pandas as pd

works = open('../data/van-gogh-works.csv')

entries = []
k = Kmeans(k=5)

for work in csv.DictReader(works):
    src = work['image']

    img = Image.open('../data/images/{}'.format(src))

    try:
        rgbs = k.run(img)

        for idx in range(len(rgbs)):
            rgb = ()
            for value in rgbs[idx]:
                rgb = rgb + (int(value),)
            work['color_{}'.format(idx+1)] = str(b'#'+b16encode(bytes(rgb)), 'utf-8')

        entries.append(work)
    except:
        pass
        continue

all_works = pd.DataFrame(entries)
cols = ['number', 'title', 'image', 'year', 'location', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5']
all_works.to_csv('data/van-gogh-works-colors.csv', index=False, columns=cols)
