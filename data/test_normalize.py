from normalize import clean_ingredient_string

norm_ingredients = set()

files = ['allr_recipes.txt', 'epic_recipes.txt', 'menu_recipes.txt']
for f in files:
    for line in open(f):
        norm_ingredients.update(list(line.rstrip('\n').split('\t'))[1:])

norm_ingredients.remove('tea')

norm_ingredients = [' '.join(item.split('_')) for item in norm_ingredients]

norm_ingredients = '\n'.join(list(norm_ingredients))

print('salt' in norm_ingredients)

with open('norm_ingredients.txt', 'w') as f:
    f.write(norm_ingredients)
