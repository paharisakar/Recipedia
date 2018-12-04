from bs4 import BeautifulSoup
from urllib.request import Request, urlopen
import time
from os.path  import basename
import requests
import pandas as pd

def web_content(link):
    req = Request(link,headers={'User-Agent':' Mozilla/5.0 (Windows NT 6.1; WOW64; rv:12.0) Gecko/20100101 Firefox/12.0'})
    content = urlopen(req).read().decode('utf-8')
    soup = BeautifulSoup(content.encode('utf-8'),'html.parser')
    return soup

def add_quote(text):
    if ',' in text:
        return '\"'+text+'\"'
    text = text.replace('\"\"','\"').replace('\n', '')
    return text

def get_name(soup):
    for name in soup.select('h1[class="recipe-summary__h1"]'):
        recipeName = name.get_text()
        return add_quote(recipeName)
    return "Error when scripting name"

def get_description(soup,url):
    for tag in soup.select('div[class="submitter__description"]'):
        description = tag.get_text().replace('\n','').replace('        ','')
        return add_quote(description)
    print("Error when scripting description " + url)
    return "Error when scripting description"

def get_calories(soup):
    for tag in soup.select('span[itemprop="calories"]'):
        cal = tag.get_text().replace(' calories;','')
        return cal
    return '0'

def get_image(soup,url):
    for tag in soup.select('img[itemprop="image"]'):
        imageLink = add_quote(tag['src'])
        return imageLink
    print("Error when scripting image " + url)
    return "Error when scripting image"

def write_to_file(soup,url):
    recipeName = get_name(soup).replace(u'\xae','').replace(u'\xa0', u' ')
    if recipeName != 'Error when scripting name':
        imageLink = get_image(soup,url).replace('\n', '')
        des = get_description(soup,url).replace('\n', '')
        if imageLink != 'Error when scripting image' and des !='Error when scripting description':
            print("downloading: "+recipeName)
            cal = get_calories(soup).replace('\n', '')
            with open('new_imageUrl.csv',"a+") as f:
                data = recipeName + ','+ url +','+ imageLink + ','+ des +','+ cal + '\n'
                data = data.replace(u'\xae','').replace(u'\xa0', u' ')
                f.write(data)
        elif imageLink == 'Error when scripting image':
            error_record('image',url)
        elif des == 'Error when scripting description':
            error_record('description',url)

def record(line):
    with open('record.txt',"a+") as f:
        f.write(line)

def error_record(part,link):
    with open('error_record.csv',"a+") as f:
        f.write(part+','+line)

def read_file(path):
    with open(path,'r') as rd:
        while True:
            row = rd.readline()
            if not row:
                break
            record(row)
            soup = web_content(row.replace('\n',''))
            write_to_file(soup,row.replace('\n',''))
            time.sleep(3)
def main():
    path = 'recipe_links.txt'
    read_file(path)


main()
