from bs4 import BeautifulSoup
import pandas as pd

page = open('../data/works.html')
soup = BeautifulSoup(page, 'lxml')
entries = []

table = soup.find('table')

for row in table.findAll('tr'):
    cells = row.findAll('td')

    if len(cells) == 5:
        no = int(cells[0].text)

        if cells[1].find('img'):
            image = cells[1].find('img').get('src').replace('./images/', '')

        title = cells[2].text.strip()
        year = cells[3].text
        location = cells[4].text

        entry = {
            'number': no,
            'image': image,
            'title': title,
            'year': year,
            'location': location
        }

        entries.append(entry)

df = pd.DataFrame(entries)
df.to_csv('../data/van-gogh-works.csv', index=False, columns=['number', 'title', 'image', 'year', 'location'])
