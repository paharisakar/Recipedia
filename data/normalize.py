import pandas as pd
norm_ingredients = set()

files = ['allr_recipes.txt', 'epic_recipes.txt', 'menu_recipes.txt']
for f in files:
    for line in open(f):
        norm_ingredients.update(list(line.rstrip('\n').split('\t'))[1:])

norm_ingredients.remove('tea')

norm_ingredients = [' '.join(item.split('_')) for item in norm_ingredients]

def clean_ingredient_string(receipe):

    receipe = str.lower(receipe)

    receipe = receipe.replace('&', '').replace('(', '').replace(')','')
    receipe = receipe.replace('\'', '').replace('\\', '').replace(',','')
    receipe = receipe.replace('.', '').replace('%', '').replace('/','')

    receipe = ''.join([i for i in receipe if not i.isdigit()])
    # receipe = receipe.split()

    # Return a list with unique elements from the norm_ingredients list

    # for ingredient in norm_ingredients:
        # recipe = recipe.

    # print(receipe)

    return list(set([ingredient for ingredient in norm_ingredients if ingredient+' ' in receipe or ' '+ingredient in receipe]))
    # return list(set([ingredient for ingredient in norm_ingredients if ingredient in receipe]))



df = pd.read_csv('all_ing.csv', index_col=0)
normalized = []
for i in df['Ingredient']:
    if  not clean_ingredient_string(i): normalized.append('')
    else: normalized.append(max(clean_ingredient_string(i), key=len))

# Writing to the csv file
#########################################
df['Normalized'] = normalized
df = df[['Ingredient', 'Normalized', 'Name of Dish']]
df.to_csv('all_ing.csv')
#########################################
