import csv
import json
from collections import defaultdict

zip_to_districts = defaultdict(list)
data = []

with open('zccd.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        data.append(row)

with open('zip_to_district.json', 'w') as jsonfile:
    json.dump(data, jsonfile, indent=2)