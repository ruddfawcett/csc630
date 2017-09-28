import requests

def fetch_repos(username):
    r = requests.get(f'https://api.github.com/users/{username}/repos')

    print(r.json())

fetch_repos('ruddfawcett')
