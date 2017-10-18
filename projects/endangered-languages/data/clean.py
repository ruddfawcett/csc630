import json
import csv
from mpl_toolkits.basemap import Basemap
import pandas as pd
import shapely.geometry
bm = Basemap()

original = open('raw/endangered-languages.csv')
africa_geojson = json.load(open('africa.geojson'))

def clean_coordinates():
    on_land = []
    off_land = []

    for line in csv.DictReader(original):
        if (line['Longitude'] and line['Latitude']):
            x = float(line['Longitude'])
            y = float(line['Latitude'])

            if (bm.is_land(x, y)):
                on_land.append(line)
            else:
                off_land.append(line)

    land = pd.DataFrame(on_land)
    off = pd.DataFrame(off_land)

    land.to_csv('clean/endangered-languages-on-land.csv', index=False)
    off.to_csv('clean/endangered-languages-off-land.csv', index=False)

def africa_coordinates():
    in_africa = []

    for line in csv.DictReader(original):
        if (line['Longitude'] and line['Latitude']):
            x = float(line['Longitude'])
            y = float(line['Latitude'])

            for country in africa_geojson['features']:
                shape = shapely.geometry.asShape(country['geometry'])
                point = shapely.geometry.Point(x, y)
                if shape.contains(point):
                    in_africa.append(line)

    africa = pd.DataFrame(in_africa)
    africa.to_csv('clean/endangered-languages-africa.csv', index=False)

africa_coordinates()
