from bs4 import BeautifulSoup
import requests
import pandas as pd
import numpy as np
import time

df = pd.read_csv('all_ing.csv', index_col=0)

with open('recipe_links.txt', 'r') as f:
    urls = f.read().split('\n')

urls = [url for url in urls if 'allrecipes.com/recipe' in url]

def find_ingredients(url):

    page = requests.get(url)
    time.sleep(1)

    soup = BeautifulSoup(page.content, 'html.parser')

    dish_name = soup.find(class_="recipe-summary__h1").get_text()
    ingredient_list = soup.find_all(class_="recipe-ingred_txt added")
    ingredient_list = [item.get_text() for item in ingredient_list]

    return dish_name, ingredient_list

# for url in urls:
    # name, ing = find_ingredients(url)

# print(df)
