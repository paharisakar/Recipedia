# import urllib2
from bs4 import BeautifulSoup
import requests
import pandas as pd
import numpy as np
from time import time

url = 'https://sugarspiceslife.com/2018/06/19/enchilada-stuffed-peppers-recipe/'

def find_ingredients(url):

    page = requests.get(url)

    soup = BeautifulSoup(page.content, 'html.parser')

    dish_name = soup.find(class_="entry-title").get_text()
    ingredient_list = soup.find_all(class_="wprm-recipe-ingredient-name")
    ingredient_list = [item.get_text() for item in ingredient_list]

    # ingredient_amount = soup.find_all(class_="wprm-recipe-ingredient-amount")
    # ingredient_amount = [item.get_text() for item in ingredient_amount]
    #
    # ingredient_unit = soup.find_all(class_="wprm-recipe-ingredient-unit")
    # ingredient_unit = [item.get_text() for item in ingredient_unit]

    instructions = soup.find_all(class_="wprm-recipe-instruction")
    instructions = [item.get_text() for item in instructions]

    return dish_name, ingredient_list, instructions

with open('recipe_links.txt', 'r') as f:
    urls = f.read().split('\n')

urls = [url for url in urls if 'sugarspiceslife.com' in url]

dishes = dict()
for url in urls:
    name, list, amount = find_ingredients(url)
    dishes[name] = list, amount

instructions = []
ingredients = []
for d, i in dishes.items():
    instructions.append((d, "".join(i[1])))
    for item in i[0]:
        ingredients.append([item, d])

# np.array(ingredients)[:,1]


df = pd.DataFrame(ingredients, columns=['Ingredient', 'Name of Dish'])
df.to_csv('ingredient.csv')

df2 = pd.DataFrame(instructions, columns=['Name of Dish', 'Instruction'])
df2.to_csv('instructions.csv')

print(df.groupby('Name of Dish').groups)




def all_recipe(url):

    page = requests.get(url)
    st = time()
    soup = BeautifulSoup(page.content, 'html.parser')

    try:
        dish_name = soup.find(class_="recipe-summary__h1").get_text()
        ingredient_list = soup.find_all(class_="recipe-ingred_txt added")
        ingredient_list = [item.get_text() for item in ingredient_list]

        instructions = soup.find_all(class_="recipe-directions__list--item")
        instructions = [item.get_text() for item in instructions]

    except: return '', [], []

    while(time() - st < 1): continue
    return dish_name, ingredient_list, instructions

with open('recipe_links.txt', 'r') as f:
    urls = f.read().split('\n')

urls = [url for url in urls if 'allrecipes.com' in url and 'reviews' not in url]

all_dishes = dict()
i = 0
for url in urls:
    name, list, amount = all_recipe(url)
    all_dishes[name] = list, amount
    i+=1


all_ins = []
all_ing = []
for d, i in all_dishes.items():
    all_ins.append((d, "".join(i[1])))
    for item in i[0]:
        all_ing.append([item, d])



df = pd.DataFrame(all_ing, columns=['Ingredient', 'Name of Dish'])
df.to_csv('all_ing.csv')

df2 = pd.DataFrame(all_ins, columns=['Name of Dish', 'Instruction'])
df2.to_csv('all_ins.csv')

print(df.groupby('Name of Dish').groups)

norm_ingredients = set()

files = ['allr_recipes.txt', 'epic_recipes.txt', 'menu_recipes.txt']
for f in files:
    for line in open(f):
        # print(line)
        norm_ingredients.update(list(line.rstrip('\n').split('\t'))[1:])


def clean_ingredient_string(receipe):

    receipe = str.lower(receipe)

    receipe = receipe.replace('&', '').replace('(', '').replace(')','')
    receipe = receipe.replace('\'', '').replace('\\', '').replace(',','')
    receipe = receipe.replace('.', '').replace('%', '').replace('/','')

    receipe = ''.join([i for i in receipe if not i.isdigit()])

    # Return a list with unique elements from the norm_ingredients list
    return list(set([ingredient for ingredient in norm_ingredients if ingredient in receipe]))
