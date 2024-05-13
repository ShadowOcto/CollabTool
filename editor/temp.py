import json

print("Started")

parts = []

def addPart(length, gameplay, gameplayComplete, decoration, decorationComplete, color = '#3498DB', comment=''):
    return {'length': length, 'color': color, 'gameplay': gameplay, 'gameplayComplete': gameplayComplete, 'decoration': decoration, 'decorationComplete': decorationComplete, 'comment': comment}

part1 = addPart(length=12, color='#1da9ff', gameplay='Shadow', gameplayComplete=True, decoration='Shadow', decorationComplete=True)
part2 = addPart(length=9, color='#26ffe3', gameplay='Shadow', gameplayComplete=True, decoration='Shadow', decorationComplete=True)
part3 = addPart(length=10, color='#9e51ff', gameplay='Shadow', gameplayComplete=True, decoration='Shadow', decorationComplete=True)
part4 = addPart(length=5, color='#eb79ff', gameplay='Shadow', gameplayComplete=True, decoration='Hykre', decorationComplete=True, comment="part version 2!")
part5 = addPart(length=2, color='#a95aff', gameplay='Shadow', gameplayComplete=True, decoration='Minaxa', decorationComplete=False, comment="it's been months!")
part6 = addPart(length=7, color='#5aa4ff', gameplay='Shadow', gameplayComplete=True, decoration='youngs', decorationComplete=False)
part7 = addPart(length=1, color='#5adcff', gameplay='Shadow', gameplayComplete=True, decoration='Shadow', decorationComplete=False)

parts.append(part1)
parts.append(part2)
parts.append(part3)
parts.append(part4)
parts.append(part5)
parts.append(part6)
parts.append(part7)

file = {'name': 'Shattered', 'difficulty': 'ExtremeDemon', 'invite': 'eAvP23z2', 'song': 'Fragile', 'songURL': 'https://www.youtube.com/watch?v=QvVCqYqa_-4', 'nong': True, 'version': 2.1, 'parts': parts}

with open('./Collab.json', 'w+') as f:
    f.write(json.dumps(file, indent=2))
