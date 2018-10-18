from time import time
from requests_html import HTMLSession
import requests

session = HTMLSession()
# r = session.get('https://allrecipes.com/')

prefix = "https://www.allrecipes.com/recipe"
suffix = "recipe/"

proxies = {
  'http': 'http://10.10.1.10:3128',
  'https': 'http://10.10.1.10:1080',
}

# requests.get('http://google.com', proxies=proxies)

def all_links(s):
    '''
    Returns a dictionary of links as keys and all the pages on that link as values. It takes in a start_page 's',
    as an argument.
    '''
    visited = set() # initialization of an empty set
    unvisited = {s} # initialization of a set with a start_page 's'

    # the loop terminates when the unvisisted set is empty
    st = time()
    count = 0
    while unvisited != set():
        try:
            p = unvisited.pop() # `p` removes an element from unvisited set and stores it
            r = session.get(p)
        except:
            print('CONNECTION WAS ABORTED')
            return visited | unvisited
        links = list(r.html.absolute_links)
        p_links = [link for link in links if link[len(link)-len(suffix):] == suffix]

        visited.add(p) # adds `p` to the visited set

        p_links = set(p_links) # converts plinks to a set
        unvisited = unvisited | p_links # unvisited becomes union of unvisited and p_links

        unvisited = unvisited - visited # unvisited is updated to difference of unvisited and visisted
        # return unvisited

        if time() - st > 700:
            return visited | unvisited
        count += 1
        print(count, '*'*count)

    return visited | unvisited


start_page = 'https://sugarspiceslife.com/'
# print(session.get(start_page).html.absolute_links)
recipe_links = all_links(start_page)

for item in ['pizza', 'burger', 'pasta', 'mexican', 'indian']:
    recipe_links = recipe_links | all_links('https://sugarspiceslife.com/?s='+item)

with open('recipe_links.txt', 'a') as f:
    print('\n\n\n',len(recipe_links))
    for i in recipe_links: f.write(i+'\n')
