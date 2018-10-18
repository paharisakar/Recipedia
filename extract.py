# import urllib2
from bs4 import BeautifulSoup
import requests

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

all_ingredients = []
for d in dishes:
    all_ingredients += dishes[d][0]
