# Parser to create our database of ingridients and nutrition info

import re
import requests
from time import time

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

        p = unvisited.pop() # `p` removes an element from unvisited set and stores it
        p_links = re.findall(r'<a href="(.*?recipe/)" ', requests.get(p).text) # `p_links` stores all the links found on the page `p`
        if len(p_links) < 1 : continue

        visited.add(p) # adds `p` to the visited set

        p_links = set(p_links) # converts plinks to a set
        unvisited = unvisited | p_links # unvisited becomes union of unvisited and p_links

        unvisited = unvisited - visited # unvisited is updated to difference of unvisited and visisted

        # if time() - st > 5:
            # return visited
        count += 1
    print('Count: ', count)
    return visited

# my_dict stores a links and their outgoing pages

my_dict = all_links('https://sugarspiceslife.com/')
type(my_dict)


my_dict
len(my_dict)

items = ['pizza', 'burger', 'salad', 'pasta']
for item in items: my_dict = my_dict | all_links('https://sugarspiceslife.com/?s='+item)


my_dict = {'1', '2'}
with open('urls.txt', 'w') as f:
    f.write("\n".join(list(my_dict)))
