import json
import copy

with open('assets\pokemon_ko.json', encoding='utf8') as f:
    json_object = json.load(f)

newJson = copy.deepcopy(json_object)

for key in json_object:
    value = json_object[key]
    print(value)
    for v in value:
      print(v)
      newJson[v] = [v]

with open('assets\pokemon_ko_v2.json', 'w', encoding='utf8') as f:
    json.dump(newJson, f, ensure_ascii=False)
