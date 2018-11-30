norm_ingredients = set()

files = ['allr_recipes.txt', 'epic_recipes.txt', 'menu_recipes.txt']
for f in files:
    for line in open(f):
        norm_ingredients.update(list(line.rstrip('\n').split('\t'))[1:])


def clean_ingredient_string(receipe):

    receipe = str.lower(receipe)

    receipe = receipe.replace('&', '').replace('(', '').replace(')','')
    receipe = receipe.replace('\'', '').replace('\\', '').replace(',','')
    receipe = receipe.replace('.', '').replace('%', '').replace('/','')

    receipe = ''.join([i for i in receipe if not i.isdigit()])

    # Return a list with unique elements from the norm_ingredients list
    return list(set([ingredient for ingredient in norm_ingredients if ingredient in receipe]))

clean_ingredient_string('2 tablespwrgwgoons, butter srgwrgalted')
